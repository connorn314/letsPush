/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import { onDocumentUpdated } from "firebase-functions/v2/firestore"
import {logger} from "firebase-functions";
import * as admin from "firebase-admin";
import { DocumentData, Timestamp } from "firebase-admin/firestore";
import axios from "axios";
import { Expo, ExpoPushErrorReceipt, ExpoPushMessage } from 'expo-server-sdk';

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
    if (object_type === "activity" && aspect_type === "create" && owner_id && event_time){
      try{
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

        if (commitmentsSnap.empty){
          logger.error("No commitments found")
          res.status(200).send("No commitments found");
        }

        const activityTime = new Date(Number(event_time) * 1000);

        const matchingCommitment = commitmentsSnap.docs.find(commitment => {
          const time = (commitment.data().startDate as Timestamp).toDate();

          // account for timezone soon (from 5pm to midnight this timezone is a day ahead of utc)
          return (time.getFullYear() === activityTime.getFullYear() 
            && time.getMonth() === activityTime.getMonth() 
            && time.getDate() === activityTime.getDate())
        })

        if (!matchingCommitment){
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
    logger.info(JSON.stringify(req.body), {structuredData: true});
    res.status(200).json({});
  }

  res.status(400).json({"message": "bad request"})
  // Respond with 200 and no content for non-GET requests
});

export const activityIDAttached = onDocumentUpdated("commitments/{commitmentId}", async (event) => {
  // const comId = event.params.commitmentId;
  if (!event.data) {
    logger.error("could not find commitment document after");
    return;
  }

  const data = event.data.after.data();

  if (!data['strava_activity_id']){
    logger.info("no commitment.strava_activity_id")
    return null;
  }
  // const previousData = event.data.before.data();
  if (data['strava'] && data.strava['distance'] && data.strava['moving_time'] && data.strava['elapsed_time']){
    logger.info("strava info updated already, assume push already sent")
    return null;
  }

  const handlePushReceiptError = async ({ expoPushToken, error } : { expoPushToken?: string; error?: "DeveloperError" | "DeviceNotRegistered" | "ExpoError" | "InvalidCredentials" | "MessageRateExceeded" | "MessageTooBig" | "ProviderError"}) => {
    if (!error) return;
    if (error === "DeviceNotRegistered"){
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
      if (!(strava.exists && strava.data())){
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
    if (!userStravaDetailsSnap.exists || !userStravaDetailsSnap.data()?.access_token){
      logger.error(`not finding strava details for this user, id: ${data.userId}`);
      return;
    }
    let token = userStravaDetailsSnap.data()?.access_token;
    if (userStravaDetailsSnap.data()?.expires_at < (Date.now() / 1000)){
      token = (await refreshToken(userStravaDetailsSnap.data()?.refresh_token as string)).access_token
    }

    const activityDetails = (await axios.get(`https://www.strava.com/api/v3/activities/${data.strava_activity_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })).data;

    const { sport_type, distance, moving_time, elapsed_time, total_elevation_gain } = activityDetails;

    if (sport_type !== "TrailRun" && sport_type !== "Run"){
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
      status: "complete"
    });

    logger.info("just updated")

    // SEND PUSH NOTIFICATION TO FRIENDS: SUCCESSFUL ATTEMPT AT COMMITMENT
    const userSnap = await db.doc(`/users/${data.userId}`).get();
    // logger.info("this")
    const { name, friends } = userSnap.data() as DocumentData;
    // logger.info("is")
    const friendsSnap = await db.collection("users").where(admin.firestore.FieldPath.documentId(), "in", friends).get();
    // logger.info("broken")

    if (friendsSnap.empty){
      logger.info("this user has no friends, lol")
      return;
    }

    const messages: ExpoPushMessage[] = [];

    // logger.info("defined vars at start of push notification section", friendsSnap.docs.map(fS => fS.data()?.name ?? "unknown name"))

    friendsSnap.forEach(fSnap => {
      if (!fSnap.exists) return;
      const { pushToken } = fSnap.data() as DocumentData;

      if (!pushToken || !Expo.isExpoPushToken(pushToken)) return;
      // logger.info(`Push token ${pushToken} is not a valid Expo push token`);
      messages.push({
        to: pushToken,
        sound: 'default',
        title: `${name} isn't weak!`,
        body: `"${data.name}" commitment complete.`,
        badge: 1,
        data: { url: "bevvarra.com://testFilePath/wildcard" }
      })
    })

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
      } else if (ticket.message){
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
            if (details && details.error) { handlePushReceiptError({ expoPushToken, error: details.error}) }
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