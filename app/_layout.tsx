
import { Stack, Redirect, useRouter } from "expo-router";
import { createStore, Provider, useAtom } from 'jotai';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeWindStyleSheet } from "nativewind";
import { usePushNotifications } from "@/storage/usePushNotifications";
import { expoPushTokenState, firebaseAuthLoadingState, userState } from "@/storage/atomStorage";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig";
import { View } from "react-native";
import SpinLoader from "@/components/spinLoader";

// if we ever want to prevent hide of splash screen to load things in background
// import { SplashScreen } from "expo-router";
// SplashScreen.preventAutoHideAsync();


NativeWindStyleSheet.setOutput({
    default: "native",
});

export const store = createStore();

const RootLayout = () => {

    // something like this if we wanted to load assets here
    // if (!loaded) {
    //     return null
    // }

    return (
    <Provider store={store}>
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                    <RootLayoutNav />
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    </Provider>
    )
}

export default RootLayout;


const RootLayoutNav = () => {
    usePushNotifications();

    const [user, setUser] = useAtom(userState);
    const [expoToken,] = useAtom(expoPushTokenState);
    const [loading, setLoading] = useAtom(firebaseAuthLoadingState);
    const router = useRouter();
    // const [notification, ] = useAtom(notificationState);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, userObj => {
            if (userObj) {
                getMe(userObj).then(res => {
                    console.log(res);
                    router.push("/(tabs)/home")
                });
            } else {
                setUser(null);
                setLoading(false);
            }
        })

        return unsubscribe;
    }, [])

    useEffect(() => {
        if (user && ((!user.pushToken && expoToken) || (user.pushToken !== expoToken))) {
            updateExpoToken()
        }
    }, [user, expoToken])

    const updateExpoToken = async () => {
        const userRef = doc(FIRESTORE_DB, "users", user.uid)
        await updateDoc(userRef, {
            pushToken: expoToken
        })
    }

    const createUser = async (userObj: any) => {
        const userData = {
            name: "",
            created_at: Date.now(),
            friends: [],
            pushToken: expoToken || "",
            workouts: [],
            weekPlans: []
        }
        // console.log("userData", userData)
        await setDoc(doc(FIRESTORE_DB, "users", userObj.uid), userData);
        return await getDoc(doc(FIRESTORE_DB, "users", userObj.uid))
    }

    const getMe = async (userObj: any) => {
        if (!userObj || !userObj.uid) return;

        const currentUser = FIREBASE_AUTH.currentUser;

        if (!currentUser) {
            console.error("User is not authenticated.");
            return;
        }
        try {
            const userRef = doc(FIRESTORE_DB, `users`, `${userObj.uid}`);
            const userDoc = await getDoc(userRef);
            const stravaDetailsRef = doc(FIRESTORE_DB, `users/${userObj.uid}/strava`, `me`);
            const stravaDoc = await getDoc(stravaDetailsRef);
            // console.log("me: ", userDoc.data(), stravaDoc.data());
            if (userDoc.exists()) {
                // const profile = userDoc.data();
                setUser({ ...userObj, id: userObj.uid, ...userDoc.data(), strava: stravaDoc.exists() ? stravaDoc.data() : undefined });
            } else {
                const newUser = (await createUser(userObj)).data
                setUser({ ...userObj, id: userObj.uid, ...newUser, strava: stravaDoc.exists() ? stravaDoc.data() : undefined })
            }
            setLoading(false);
        } catch (err: any) {
            console.log(err, "err")
            alert(err.message)
        }
    }

    useEffect(() => {
        if (!loading && !user){
            router.push("/login")
        }
    }, [user])

    if (loading) {
        return (
            <View className="w-screen h-full justify-center items-center ">
                <SpinLoader color='black' />
            </View>
        );
    }
    
    return (
        <Stack >
            <Stack.Screen name="(tabs)" options={{headerShown: false}} />
            <Stack.Screen name="commitment/[commitmentId]" options={{headerShown: false}} />
            <Stack.Screen name="profile/[userId]" options={{headerShown: false}} />
            <Stack.Screen name="login" options={{headerShown: false}} />
        </Stack>
    )
}