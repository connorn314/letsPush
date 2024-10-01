/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import * as admin from "firebase-admin";
import { DocumentData, Timestamp } from "firebase-admin/firestore";
import axios from "axios";
import { Expo, ExpoPushErrorReceipt, ExpoPushMessage, ExpoPushSuccessTicket } from 'expo-server-sdk';

admin.initializeApp();
const db = admin.firestore();

const expo = new Expo({
  useFcmV1: true,
});

export const stravaWebhook = functions.https.onRequest(async (req, res) => {

  // Handle GET requests for Strava webhook verification
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Check if the request is a valid subscription verification request from Strava
    if (mode && token && challenge) {
      // Respond with the challenge to confirm the webhook
      res.status(200).json({ "hub.challenge": challenge });
    }
  }

  if (req.method === 'POST') {
    const { owner_id, event_time, object_id, object_type, aspect_type } = req.body
    if (object_type === "activity" && aspect_type === "create" && owner_id && event_time) {
      try {
        const usersRef = db.collection("users");
        const userSnapshot = await usersRef.where("strava_athlete_id", "==", Number(owner_id)).limit(1).get();

        if (userSnapshot.empty) {
          logger.error("No user found with the given strava_athlete_id")
          res.status(404).send("No user found with the given strava_athlete_id");
        }

        // Get the first matched document
        const userId = userSnapshot.docs[0].id;

        const commitmentsRef = db.collection("commitments");
        const commitmentsSnap = await commitmentsRef.where("userId", "==", userId).get();

        if (commitmentsSnap.empty) {
          logger.error("No commitments found")
          res.status(200).send("No commitments found");
        }

        const activityTime = new Date(Number(event_time) * 1000);
        // timezone offset is -7 but eventually will be dynamic - think of as + (timzoneoffset)
        activityTime.setUTCHours(activityTime.getUTCHours() - 7)

        const matchingCommitment = commitmentsSnap.docs.find(commitment => {
          const time = (commitment.data().startDate as Timestamp).toDate();

          // account for timezone soon (from 5pm to midnight this timezone is a day ahead of utc)
          return (time.getUTCFullYear() === activityTime.getUTCFullYear()
            && time.getUTCMonth() === activityTime.getUTCMonth()
            && time.getUTCDate() === activityTime.getUTCDate())
        })

        if (!matchingCommitment) {
          logger.error("No commitments found matching the activity date")
          res.status(200).send("No commitments found matching the activity date");
        }


        // Update the user document with the provided data
        await matchingCommitment?.ref.update({
          strava_activity_id: object_id
        });

        // Send success response
        res.status(200).send("User updated successfully");

      } catch (err) {
        logger.error("Error updating user:", err);
        res.status(500).send("Internal Server Error");
      }
    }
    logger.info(JSON.stringify(req.body), { structuredData: true });
    res.status(200).json({});
  }

  res.status(400).json({ "message": "bad request" })
  // Respond with 200 and no content for non-GET requests
});

export const activityIDAttached = onDocumentUpdated("commitments/{commitmentId}", async (event) => {
  // const comId = event.params.commitmentId;
  if (!event.data) {
    logger.error("could not find commitment document after");
    return;
  }

  const data = event.data.after.data();
  // const id = event.data.after.id

  if (!data['strava_activity_id']) {
    logger.info("no commitment.strava_activity_id")
    return null;
  }
  // const previousData = event.data.before.data();
  if (data['strava'] && data.strava['distance'] && data.strava['moving_time'] && data.strava['elapsed_time']) {
    logger.info("strava info updated already, assume push already sent")
    return null;
  }

  const handlePushReceiptError = async ({ expoPushToken, error }: { expoPushToken?: string; error?: "DeveloperError" | "DeviceNotRegistered" | "ExpoError" | "InvalidCredentials" | "MessageRateExceeded" | "MessageTooBig" | "ProviderError" }) => {
    if (!error) return;
    if (error === "DeviceNotRegistered") {
      logger.error("attempting to send push notification to device no longer registered")
      if (!expoPushToken) return;
      const usersWithTokenSnaps = await db.collection("users").where("pushToken", "==", expoPushToken).get();
      if (usersWithTokenSnaps.empty) return;
      // shouldn't be more than one but just in case;
      // eventually this should be a concurrent operation;
      usersWithTokenSnaps.docs.forEach(userWithToken => {
        userWithToken.ref.update({
          pushToken: admin.firestore.FieldValue.delete()
        })
      })
      return;
    }
    logger.error(`We had a push error that wasn't a device registered issue: ${error}`)
  }

  const refreshToken = async (token: string) => {
    try {
      const strava = await db.doc('/adminOnly/vars').get();
      if (!(strava.exists && strava.data())) {
        logger.error("can't reach strava variables")
        return;
      }

      const res = await axios.post("https://www.strava.com/api/v3/oauth/token", {
        client_id: strava.data()?.STRAVA_CLIENT_ID,
        client_secret: strava.data()?.STRAVA_CLIENT_SECRET,
        refresh_token: token,
        grant_type: "refresh_token"
      })

      const { refresh_token, access_token, expires_at } = res.data
      await db.doc(`/users/${data.userId}/strava/me`).update({
        refresh_token,
        access_token,
        expires_at
      })
      // await syncStravaData({ refresh_token, access_token, expires_at })
      return res.data

    } catch (err) {
      alert("err refreshing token: " + err)
    }
  }

  try {
    // get user
    const userStravaDetailsSnap = await db.doc(`/users/${data.userId}/strava/me`).get();
    if (!userStravaDetailsSnap.exists || !userStravaDetailsSnap.data()?.access_token) {
      logger.error(`not finding strava details for this user, id: ${data.userId}`);
      return;
    }
    let token = userStravaDetailsSnap.data()?.access_token;
    if (userStravaDetailsSnap.data()?.expires_at < (Date.now() / 1000)) {
      token = (await refreshToken(userStravaDetailsSnap.data()?.refresh_token as string)).access_token
    }

    const activityDetails = (await axios.get(`https://www.strava.com/api/v3/activities/${data.strava_activity_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })).data;

    const { sport_type, distance, moving_time, elapsed_time, total_elevation_gain } = activityDetails;

    if (sport_type !== "TrailRun" && sport_type !== "Run") {
      logger.info("not a run activity, detach the activity_id association from commitment")
      return event.data.after.ref.update({
        strava_activity_id: admin.firestore.FieldValue.delete()
      })
    }

    logger.info("haven't updated yet");

    await event.data.after.ref.update({
      strava: {
        sport_type,
        distance,
        moving_time,
        elapsed_time,
        total_elevation_gain
      },
      status: "complete",
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });

    logger.info("just updated")

    // SEND PUSH NOTIFICATION TO FRIENDS: SUCCESSFUL ATTEMPT AT COMMITMENT
    const userSnap = await db.doc(`/users/${data.userId}`).get();
    // logger.info("this")
    const { name, friends } = userSnap.data() as DocumentData;
    // logger.info("is")
    const friendsSnap = await db.collection("users").where(admin.firestore.FieldPath.documentId(), "in", friends).get();
    // logger.info("broken")

    if (friendsSnap.empty) {
      logger.info("this user has no friends, lol")
      return;
    }

    const messages: ExpoPushMessage[] = [];
    const batch = db.batch()
    const pushNotificationsRef = db.collection("push_notifications")

    // logger.info("defined vars at start of push notification section", friendsSnap.docs.map(fS => fS.data()?.name ?? "unknown name"))
    friendsSnap.forEach(fSnap => {
      if (!fSnap.exists) return;
      const { pushToken } = fSnap.data() as DocumentData;

      if (!pushToken || !Expo.isExpoPushToken(pushToken)) return;
      // logger.info(`Push token ${pushToken} is not a valid Expo push token`);
      const notif: ExpoPushMessage = {
        to: pushToken,
        sound: 'default',
        title: `${name} did it`,
        body: `${data.name || "Today's Run"} - complete`,
        badge: 1,
        data: { url: `/weekOfCommitments/${data.weekPlanId ?? "none"}` }
      }
      messages.push(notif);
      const docRef = pushNotificationsRef.doc(); // Create a new document reference with a unique ID
      batch.set(docRef, {
        content: notif,
        userId: fSnap.id,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        viewed: false
      });
    })

    batch.commit()
      .then(() => logger.info("successfully created notifications"))
      .catch(({ reason }) => logger.warn(`error creating notifications: ${JSON.stringify(reason)}`))

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (let chunk of chunks) {
      try {
        // logger.info(`starting first chunk of push notifications: ${JSON.stringify(chunk)}`)
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        // logger.info(JSON.stringify(ticketChunk))
        tickets.push(...ticketChunk);
      } catch (error) {
        logger.error(`this is where the error is ${JSON.stringify(error)}`);
      }
    }

    const receiptIds = [];
    for (let ticket of tickets) {
      // NOTE: Not all tickets have IDs; for example, tickets for notifications
      // that could not be enqueued will have error information and no receipt ID.
      // logger.info('creating receipt id array with tickets ^')
      if (ticket.status === 'ok') {
        receiptIds.push(ticket.id);
      } else if (ticket.message) {
        logger.warn(ticket.message)
      }
    }

    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    for (let chunk of receiptIdChunks) {
      try {
        // logger.info(`beginning to fetch receipts for this chunk: ${JSON.stringify(chunk)}`);
        const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        logger.info(`receipts: ${JSON.stringify(receipts)}`);

        // The receipts specify whether Apple or Google successfully received the
        // notification and information about an error, if one occurred.
        for (let receiptId in receipts) {
          const { status } = receipts[receiptId];
          if (status === 'ok') {
            continue;
          } else if (status === 'error') {
            const { message, details, expoPushToken } = receipts[receiptId] as ExpoPushErrorReceipt;
            logger.error(
              `There was an error sending a notification: ${message}`
            );
            if (details && details.error) { handlePushReceiptError({ expoPushToken, error: details.error }) }
          }
        }
      } catch (error) {
        logger.error(error);
      }
    }

    return null;
  } catch (err) {
    logger.error(JSON.stringify(err))
    return null;
  }
})

exports.scheduledUpdateCommitmentsStatus = onSchedule("every 1 hours", async (event) => {

  const handlePushReceiptError = async ({ expoPushToken, error }: { expoPushToken?: string; error?: "DeveloperError" | "DeviceNotRegistered" | "ExpoError" | "InvalidCredentials" | "MessageRateExceeded" | "MessageTooBig" | "ProviderError" }) => {
    if (!error) return;
    if (error === "DeviceNotRegistered") {
      logger.error("attempting to send push notification to device no longer registered")
      if (!expoPushToken) return;
      const usersWithTokenSnaps = await db.collection("users").where("pushToken", "==", expoPushToken).get();
      if (usersWithTokenSnaps.empty) return;
      // shouldn't be more than one but just in case;
      // eventually this should be a concurrent operation;
      usersWithTokenSnaps.docs.forEach(userWithToken => {
        userWithToken.ref.update({
          pushToken: admin.firestore.FieldValue.delete()
        })
      })
      return;
    }
    logger.error(`We had a push error that wasn't a device registered issue: ${error}`)
  }


  // Get the current time
  const pacificTime = new Date()

  // 7 is the offset in california, eventually it will be dynamic to all timezones
  const time = pacificTime.getUTCHours() >= 7 ? pacificTime.getUTCHours() - 7 : 24 - Math.abs(pacificTime.getUTCHours() - 7)
  if (time !== 20) {
    logger.info('Current time is not 8 PM Pacific Time. Exiting the function.');
    return;
  }
  // minus six (-7 + 1) because it will take the timestamp to one hour past midnight 
  // on the day the task was to be completed
  // pacificTime.setUTCHours(pacificTime.getUTCHours() - 6);

  // Check if it's 8 PM in Pacific Time
  // const year = pacificTime.getUTCFullYear();
  // const month = pacificTime.getUTCMonth();
  // const day = pacificTime.getUTCDate();

  // const formattedTodayDate = `${year}/${month + 1}/${day}`

  const commitmentsRef = db.collection('commitments');
  const usersRef = db.collection('users');
  const pushNotificationsRef = db.collection("push_notifications");

  try {
    const snapshot = await commitmentsRef
      .where('startDate', '<=', pacificTime)
      .where('status', '==', 'NA')
      .get();

    if (snapshot.size === 0) {
      logger.info("Zero failed workouts")
      return;
    }

    const batch = db.batch();

    // [ [userId, weekPlanId], ... ]
    const userIdsWhoFailed: string[] = [];
    const userToWeekPlanMap: Record<string, string> = {};

    snapshot.forEach(doc => {
      const docRef = commitmentsRef.doc(doc.id);
      batch.update(docRef, { status: 'failure', updated_at: admin.firestore.FieldValue.serverTimestamp() });
      userIdsWhoFailed.push(doc.data().userId)
      userToWeekPlanMap[doc.data().userId] = doc.data().weekPlanId
    });

    await batch.commit();

    if (userIdsWhoFailed.length === 0) {
      logger.info("userIdsWhoFailed length is zero");
      return;
    }

    const allFailedUsersSnapshot = await usersRef
      .where(admin.firestore.FieldPath.documentId(), "in", userIdsWhoFailed)
      .get();

    logger.info("made it to this step");

    const friendsToPushesMap: Map<string, { name: string; id: string; weekPlanId: string }[]> = new Map();

    allFailedUsersSnapshot.forEach(userSnap => {
      if (!userSnap.data().friends || !userSnap.data().friends.length) return;
      (userSnap.data().friends as string[]).forEach(friend => {
        const newPushDetails = { id: userSnap.id, name: userSnap.data().name ?? "Someone", weekPlanId: userToWeekPlanMap[userSnap.id] }
        if (friendsToPushesMap.has(friend)) {
          friendsToPushesMap.set(friend, friendsToPushesMap.get(friend)?.concat(newPushDetails) ?? [newPushDetails])
          return;
        }
        friendsToPushesMap.set(friend, [newPushDetails])
      })
      logger.info(`here we are ${JSON.stringify(userSnap.data().friends)}`);
    })

    if (!friendsToPushesMap.size) {
      logger.info("No friends to push failures to :)")
      return;
    }

    const messages: ExpoPushMessage[] = [];
    const pushBatch = db.batch();

    const friendsSnaps = await usersRef
      .where(admin.firestore.FieldPath.documentId(), "in", Array.from(friendsToPushesMap.keys()))
      .get();

    friendsSnaps.docs.forEach((friendSnap) => {
      if (!friendSnap || !friendSnap.exists) return;
      if (!friendSnap.data()?.pushToken || !Expo.isExpoPushToken(friendSnap.data()?.pushToken)) return;
      friendsToPushesMap.get(friendSnap.id)?.forEach(pushDetails => {
        const message: ExpoPushMessage = {
          to: friendSnap.data().pushToken,
          sound: 'default',
          title: `Alert! ${pushDetails.name} failed`,
          body: `See which commitment`,
          badge: 1,
          data: { url: `/weekOfCommitments/${pushDetails.weekPlanId}` }
        }
        messages.push(message)
        const docRef = pushNotificationsRef.doc(); // Create a new document reference with a unique ID
        pushBatch.set(docRef, {
          content: message,
          userId: friendSnap.id,
          created_at: admin.firestore.FieldValue.serverTimestamp(),
          viewed: false
        });
      })
    })

    await pushBatch.commit();

    logger.info("should have created the push docs in firebase")

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (let chunk of chunks) {
      try {
        // logger.info(`starting first chunk of push notifications: ${JSON.stringify(chunk)}`)
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        // logger.info(JSON.stringify(ticketChunk))
        tickets.push(...ticketChunk);
      } catch (error) {
        logger.error(`this is where the error is ${JSON.stringify(error)}`);
      }
    }

    const receiptIds = [];
    for (let ticket of tickets) {
      // NOTE: Not all tickets have IDs; for example, tickets for notifications
      // that could not be enqueued will have error information and no receipt ID.
      // logger.info('creating receipt id array with tickets ^')
      if (ticket.status === 'ok') {
        receiptIds.push(ticket.id);
      } else if (ticket.message) {
        logger.warn(ticket.message)
      }
    }

    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    for (let chunk of receiptIdChunks) {
      try {
        // logger.info(`beginning to fetch receipts for this chunk: ${JSON.stringify(chunk)}`);
        const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        logger.info(`receipts: ${JSON.stringify(receipts)}`);

        // The receipts specify whether Apple or Google successfully received the
        // notification and information about an error, if one occurred.
        for (let receiptId in receipts) {
          const { status } = receipts[receiptId];
          if (status === 'ok') {
            continue;
          } else if (status === 'error') {
            const { message, details, expoPushToken } = receipts[receiptId] as ExpoPushErrorReceipt;
            logger.error(
              `There was an error sending a notification: ${message}`
            );
            if (details && details.error) { handlePushReceiptError({ expoPushToken, error: details.error }) }
          }
        }
      } catch (error) {
        logger.error(error);
      }
    }

    logger.info(`Updated ${snapshot.size} documents to status 'failure'. Sent ${messages.length} push notifications.`);
  } catch (error) {
    logger.error('Error updating commitments:', error);
  }
});


exports.sendReminderToFriend = onCall(async (request) => {

  const handlePushReceiptError = async ({ expoPushToken, error }: { expoPushToken?: string; error?: "DeveloperError" | "DeviceNotRegistered" | "ExpoError" | "InvalidCredentials" | "MessageRateExceeded" | "MessageTooBig" | "ProviderError" }) => {
    if (!error) return;
    if (error === "DeviceNotRegistered") {
      logger.error("attempting to send push notification to device no longer registered")
      if (!expoPushToken) return;
      const usersWithTokenSnaps = await db.collection("users").where("pushToken", "==", expoPushToken).get();
      if (usersWithTokenSnaps.empty) return;
      // shouldn't be more than one but just in case;
      // eventually this should be a concurrent operation;
      usersWithTokenSnaps.docs.forEach(userWithToken => {
        userWithToken.ref.update({
          pushToken: admin.firestore.FieldValue.delete()
        })
      })
      return;
    }
    logger.error(`We had a push error that wasn't a device registered issue: ${error}`)
  }

  if (!request.data.to) {
    throw new HttpsError("invalid-argument", "The function must be called with a 'to' argument");
  }
  if (!request.auth) {
    throw new HttpsError("failed-precondition", "The function must be " +
      "called while authenticated.");
  }
  const fromUserSnap = await db.doc(`/users/${request.auth.uid}`).get();
  const toUserSnap = await db.doc(`/users/${request.data.to}`).get();

  if (!(fromUserSnap.data()?.friends || []).includes(request.data.to) || !(toUserSnap.data()?.friends || []).includes(request.auth.uid)) {
    throw new HttpsError("permission-denied", "The requested pair are not friends")
  }

  if (!toUserSnap.data()?.pushToken || !Expo.isExpoPushToken(toUserSnap.data()?.pushToken)) {
    throw new HttpsError("failed-precondition", "The user being reminded does not have push notifications enabled");
  }

  try {
    const notif: ExpoPushMessage = {
      to: toUserSnap.data()?.pushToken,
      sound: 'default',
      title: `Reminder from ${fromUserSnap.data()?.name}`,
      body: `Fill out a your commitments for this week`,
      badge: 1,
      data: { url: `/commitments/index?showAddWorkout=true` }
    }
  
    const pushNotificationsRef = db.collection("push_notifications")
  
    await pushNotificationsRef.doc().set({
      content: notif,
      userId: toUserSnap.id,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      viewed: false
    }); 

    await fromUserSnap.ref.update({
      reminders_sent: fromUserSnap.data()?.reminders_sent ? (fromUserSnap.data()?.reminders_sent as string[]).concat([toUserSnap.id]) : [toUserSnap.id]
    })
  
    const tickets = await expo.sendPushNotificationsAsync([notif])
    if (tickets[0].status !== 'ok') {
      logger.warn(tickets[0].message)
    }
  
    const receipts = await expo.getPushNotificationReceiptsAsync(tickets.map(ticket => (ticket as ExpoPushSuccessTicket).id));
    for (let receiptId in receipts) {
      const { status } = receipts[receiptId];
      if (status === 'ok') {
        continue;
      } else if (status === 'error') {
        const { message, details, expoPushToken } = receipts[receiptId] as ExpoPushErrorReceipt;
        logger.error(
          `There was an error sending a notification: ${message}`
        );
        if (details && details.error) { handlePushReceiptError({ expoPushToken, error: details.error }) }
      }
    }
  } catch (err) {
    logger.error('Error sending reminder:', err);
  }
})