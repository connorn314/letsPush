import { useAtom } from "jotai";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import axios from "axios";
import { stravaAuthLoadingState, userState } from "./atomStorage";
import { FIRESTORE_DB } from "../firebaseConfig";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Athlete } from "../types/strava";
import { useEffect, useRef } from "react";

const useAuth = () => {

  const [user, setUser] = useAtom(userState);
  const userRef = useRef(user)
  const [, setStravaAuthLoading] = useAtom(stravaAuthLoadingState);
  // console.log("userOutside", user ? user.uid : null)

  useEffect(() => {
    userRef.current = user;
  }, [user])

  useEffect(() => {
    if (user && user.id) {
      verifyStravaToken()
    }
  }, [user]);

  WebBrowser.maybeCompleteAuthSession(); // required for web only

  const redirectTo = makeRedirectUri({
    path: "bevvarra.com"
  });

  let appOAuthUrlStravaScheme = `strava://oauth/mobile/authorize?client_id=${process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID}&redirect_uri=${redirectTo}&response_type=code&approval_prompt=auto&scope=read,activity:read_all`
  let webOAuthUrl = `https://www.strava.com/oauth/mobile/authorize?client_id=${process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID}&redirect_uri=${redirectTo}&response_type=code&approval_prompt=auto&scope=read,activity:read_all`

  const verifyStravaToken = async () => {
    try {
      const stravaDetailsRef = doc(FIRESTORE_DB, `users/${user.id}/strava`, `me`);
      const stravaDoc = await getDoc(stravaDetailsRef);
      if (stravaDoc.exists() && stravaDoc.data().refresh_token && (stravaDoc.data().expires_at < (Date.now() / 1000))) {
        await refreshToken(stravaDoc.data().refresh_token);
      }
    } catch (err) {
      alert(err);
    }
  }
  // 1725591580
  // 1725576563864

  const createSessionFromUrl = async (url: string) => {
    const { params, errorCode } = QueryParams.getQueryParams(url);

    if (errorCode) {
      alert(errorCode);
    }
    const { code, scope } = params;

    // console.log("code: ", code);
    // console.log("scope: ", scope)

    if (!code) return;
    if (scope !== "activity:read_all,read") {
      alert("We need all requested permissions for full use of the app")
    }

    await exchangeCodeForTokenAndSetSubscription(code)
  };

  const exchangeCodeForTokenAndSetSubscription = async (code: string) => {
    try {
      setStravaAuthLoading(true)
      const res = await axios.post("https://www.strava.com/api/v3/oauth/token", {
        client_id: process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID,
        client_secret: process.env.EXPO_PUBLIC_STRAVA_CLIENT_SECRET,
        code,
        grant_type: "authorization_code"
      })

      const { refresh_token, access_token, athlete, expires_at } = res.data

      console.log("user", userRef)
      if (athlete){
        const userReference = doc(FIRESTORE_DB, "users", userRef.current.uid);
        await updateDoc(userReference, { strava_athlete_id: athlete.id, name: `${athlete.firstname} ${athlete.lastname}` });
      }

      // await syncStravaData({ refresh_token, access_token, expires_at, athlete  })
      // first we need to set the subscription 
      // const subscriptionRes = await axios.post("https://www.strava.com/api/v3/push_subscriptions", {
      //   client_id: process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID,
      //   client_secret: process.env.EXPO_PUBLIC_STRAVA_CLIENT_SECRET,
      //   callback_url: process.env.EXPO_PUBLIC_WEBHOOK_URL,
      //   verify_token: "BEVVARRA"
      // })

      // const { id } = subscriptionRes.data;

      await syncStravaData({ refresh_token, access_token, athlete, expires_at })
      // console.log("stravaData synced")
      
      setUser({ 
        ...userRef.current, 
        strava_athlete_id: athlete?.id, 
        name: `${athlete.firstname} ${athlete.lastname}`, 
        strava: { refresh_token, access_token, athlete, expires_at } 
      })
      return;

    } catch (err) {
      alert("err retrieving access token or setting subscription: " + err)
    } finally {
      setStravaAuthLoading(false)

    }
  }

  const refreshToken = async (token: string) => {
    try {
      const res = await axios.post("https://www.strava.com/api/v3/oauth/token", {
        client_id: process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID,
        client_secret: process.env.EXPO_PUBLIC_STRAVA_CLIENT_SECRET,
        refresh_token: token,
        grant_type: "refresh_token"
      })

      // console.log("refresh response", res.data, res.status)

      const { refresh_token, access_token, expires_at } = res.data
      await syncStravaData({ refresh_token, access_token, expires_at })
      console.log("stravaData synced")
      setUser({ ...user, strava: { ...user?.strava, refresh_token, access_token, expires_at } })

    } catch (err) {
      alert("err refreshing token: " + err)
    }
  }

  const syncStravaData = async (stravaData: { refresh_token: string, access_token: string, expires_at: number, athlete?: Athlete, subscription_id?: string }) => {

    const stravaDetailsRef = doc(FIRESTORE_DB, `users/${userRef.current.id}/strava`, `me`);
    const stravaDoc = await getDoc(stravaDetailsRef);

    if (stravaDoc.exists()) {
      return await updateDoc(stravaDetailsRef, stravaData)
    } else {
      return await setDoc(stravaDetailsRef, stravaData)
    }

  }

  const performOAuth = async () => {
    if (await Linking.canOpenURL(appOAuthUrlStravaScheme)) {
      // console.log(appOAuthUrlStravaScheme)
      try {
        // console.log(appOAuthUrlStravaScheme)
        Linking.openURL(appOAuthUrlStravaScheme)
      } catch (err) {
        alert('err:' + err)
      }
    } else {
      const res = await WebBrowser.openAuthSessionAsync(
        webOAuthUrl,
        redirectTo
      );

      if (res.type === "success") {
        const { url } = res;
        await createSessionFromUrl(url);
      }
    }

  };

  const stravaRemoveAuthentication = async () => {
    if (!user?.strava?.access_token){
      alert("No valid access token in user");
      return;
    }
    try {
      setStravaAuthLoading(true)
      if (user.strava.subscription_id){
        const res = await axios.delete(`https://www.strava.com/api/v3/push_subscriptions/${user.strava.subscription_id}`, {
          params: {
            client_id: process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID,
            client_secret: process.env.EXPO_PUBLIC_STRAVA_CLIENT_SECRET
          }
        })
        console.log("successfully deleted subscription (should be 204): ", res.status)
      }
      const { data } = await axios.post(`https://www.strava.com/oauth/deauthorize?access_token=${user.strava.access_token}`)
      console.log("successful de-authorization: ", data)

      const stravaDetailsRef = doc(FIRESTORE_DB, `users/${user.id}/strava`, `me`);
      await deleteDoc(stravaDetailsRef);

      const temp = {...user};
      delete temp.strava
      setUser(temp)
      console.log("successful deleted strava details")

    } catch (err) {
      alert(JSON.stringify(err))
    } finally {
      setStravaAuthLoading(false);
    }
  }

  const stravaGetMe = async () => {
    const { data } = await axios.get("https://www.strava.com/api/v3/athlete", {
      headers: {
        Authorization: `Bearer ${user.strava.access_token}`
      }
    })
    console.log("strava GETME: ", data)
    setUser({...user, strava_athlete_id: data.id, strava: { ...user.strava, athlete: { ...data }}})
  }


  return { performOAuth, createSessionFromUrl, refreshToken, stravaGetMe, stravaRemoveAuthentication }
}

export default useAuth;