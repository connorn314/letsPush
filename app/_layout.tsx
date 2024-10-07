
import { Stack, Redirect, useRouter, usePathname } from "expo-router";
import { createStore, Provider, useAtom } from 'jotai';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NativeWindStyleSheet } from "nativewind";
import { usePushNotifications } from "@/storage/usePushNotifications";
import { expoPushTokenState, firebaseAuthLoadingState, notificationState, userState } from "@/storage/atomStorage";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig";
import { View } from "react-native";
import SpinLoader from "@/components/spinLoader";
import { BenchNine_400Regular, BenchNine_700Bold, useFonts } from '@expo-google-fonts/benchnine'
// if we ever want to prevent hide of splash screen to load things in background
import { SplashScreen } from "expo-router";
import * as Linking from "expo-linking";
import useAuth from "@/storage/useAuth";


SplashScreen.preventAutoHideAsync();


NativeWindStyleSheet.setOutput({
    default: "native",
});

export const store = createStore();

const RootLayout = () => {

    let [fontsLoaded] = useFonts({
        BenchNine_400Regular,
        BenchNine_700Bold
    })

    // something like this if we wanted to load assets here
    if (!fontsLoaded) {
        return null
    }

    SplashScreen.hideAsync()

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
    // useLocationServices():

    const [user, setUser] = useAtom(userState);
    const [expoToken,] = useAtom(expoPushTokenState);
    const [loading, setLoading] = useAtom(firebaseAuthLoadingState);
    const router = useRouter();
    const path = usePathname();
    const [notification, ] = useAtom(notificationState);
    const { createSessionFromUrl } = useAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, userObj => {
            if (userObj) {
                getMe(userObj);
                // .then(res => {
                //     // console.log(res); 
                //     router.push("/(tabs)/home")
                // });
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
            } 
            setLoading(false);
        } catch (err: any) {
            console.log(err, "err")
            alert(err.message)
        }
    }

    useEffect(() => {
        if (!loading && !user && (!path.includes("onboarding") || !path.includes("login"))){
            // router.push("/login")
            router.push("/onboarding")
        } else if (user && (path.includes("onboarding") || path.includes("login"))) {
            router.push("/(tabs)/home")
        }
    }, [user])

    useEffect(() => {
        const handleDeepLink = (event: any) => {
            console.log(event)
            const { url } = event;
            console.log("Deep link received:", url);

            // Extract OAuth tokens or code from the URL
            createSessionFromUrl(url); // Handle the response here
        };

        // Attach the deep link listener
        const subscription = Linking.addEventListener('url', handleDeepLink);

        return () => {
            // Clean up the listener when the component unmounts
            subscription.remove();
        };
    }, [user]);

    if (loading) {
        return (
            <View className="w-screen h-full justify-center items-center ">
                <SpinLoader color='black' />
            </View>
        );
    }
    
    return (
        <Stack screenOptions={{ gestureEnabled: false }} >
            <Stack.Screen name="(tabs)" options={{headerShown: false}} />
            <Stack.Screen name="commitment/[commitmentId]" options={{headerShown: false}} />
            <Stack.Screen name="profile/[userId]" options={{headerShown: false}} />
            <Stack.Screen name="login" options={{headerShown: false}} />
            <Stack.Screen name="onboarding" options={{headerShown: false}} />
            <Stack.Screen name="weekOfCommitments/[weekPlanId]" options={{headerShown: false}} />
            <Stack.Screen name="bevvarra.com" options={{ headerBackTitle: "Home", title: "Strava Status" }} />
        </Stack>
    )
}