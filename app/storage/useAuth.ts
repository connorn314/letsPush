import { useAtom} from "jotai";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import axios from "axios";
import { userState } from "./atomStorage";
import { FIRESTORE_DB } from "../../firebaseConfig";
import { addDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Athlete } from "../types/strava";
import { useEffect } from "react";

const useAuth = () => {

  const [user, setUser] = useAtom(userState);

  useEffect(() => {
    if (user && user.id){
      verifyStravaToken()
    }
  }, [user]);

  WebBrowser.maybeCompleteAuthSession(); // required for web only
  
  const redirectTo = makeRedirectUri({
    path: "bevvarra.com"
  });

  let appOAuthUrlStravaScheme = `strava://oauth/mobile/authorize?client_id=${process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID}&redirect_uri=${redirectTo}&response_type=code&approval_prompt=auto&scope=read,activity:read_all&state=test`
  let webOAuthUrl = `https://www.strava.com/oauth/mobile/authorize?client_id=${process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID}&redirect_uri=${redirectTo}&response_type=code&approval_prompt=auto&scope=read,activity:read_all&state=test`

  const verifyStravaToken = async () => {
    try {
      const stravaDetailsRef = doc(FIRESTORE_DB, `users/${user.id}/strava`, `me`);
      const stravaDoc = await getDoc(stravaDetailsRef);
      if (stravaDoc.exists() && stravaDoc.data().refresh_token && (stravaDoc.data().expires_at < (Date.now() / 1000))){
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
    if (scope !== "activity:read_all,read"){
      alert("We need all requested permission for full use of the app")
    }

    await exchangeCodeForToken(code)
  };

  const exchangeCodeForToken = async (code: string) => {
    try {
      const res = await axios.post("https://www.strava.com/api/v3/oauth/token", {
        client_id: process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID,
        client_secret: process.env.EXPO_PUBLIC_STRAVA_CLIENT_SECRET,
        code,
        grant_type: "authorization_code"
      })

      const { refresh_token, access_token, athlete, expires_at } = res.data

      await syncStravaData({ refresh_token, access_token, athlete, expires_at })
      console.log("stravaData synced")
      setUser({ ...user, strava: { refresh_token, access_token, athlete, expires_at }})

    } catch (err) {
      alert( "err retrieving access token: " + err)
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

      const { refresh_token, access_token, athlete, expires_at } = res.data
      await syncStravaData({ refresh_token, access_token, athlete, expires_at })
      console.log("stravaData synced")
      setUser({ ...user, strava: { refresh_token, access_token, athlete, expires_at }})

    } catch (err) {
      alert( "err refreshing token: " + err)
    }
  }

  const syncStravaData = async (stravaData: { refresh_token: string, access_token:string, athlete: Athlete, expires_at: number}) => {

    const stravaDetailsRef = doc(FIRESTORE_DB, `users/${user.id}/strava`, `me`);
    const stravaDoc = await getDoc(stravaDetailsRef);

    if (stravaDoc.exists()){
      return await updateDoc(stravaDetailsRef, stravaData)
    } else {
      return await setDoc(stravaDetailsRef, stravaData)
    }

  }

  const performOAuth = async () => {
    if (await Linking.canOpenURL(appOAuthUrlStravaScheme)) {
      try {
        Linking.openURL(appOAuthUrlStravaScheme)
        // console.log("res", res)

      } catch (err) {
        alert('err:' + err)
      }
    } else {
      const res = await WebBrowser.openAuthSessionAsync(
        webOAuthUrl,
        redirectTo
      );
      // console.log(res, "let's see")

      if (res.type === "success") {
        // console.log(res, "success")
        const { url } = res;
        await createSessionFromUrl(url);
      }
    }

  };



  return { performOAuth, createSessionFromUrl, refreshToken }
}

export default useAuth;