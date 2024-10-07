import useAuth from "@/storage/useAuth";
import useFriends from "@/storage/useFriends";
import useFriendsCommitments from "@/storage/useFriendsCommitments";
import useMyCommitments from "@/storage/useMyCommitments";
import { Redirect, Tabs } from "expo-router";
import { useEffect } from "react";
import TabIcon from "@/components/tabIcon";
import * as Linking from "expo-linking";
import { firebaseAuthLoadingState, userState } from "@/storage/atomStorage";
import { useAtom } from "jotai";

const HomeLayout = () => {
    useFriendsCommitments();
    useFriends();
    useMyCommitments();

    const [user, ] = useAtom(userState);
    const { createSessionFromUrl } = useAuth();
    const [loading, ] = useAtom(firebaseAuthLoadingState);

    

    if (!loading && !user){
        // return <Redirect href={"/login"} />
        return <Redirect href={"/onboarding"} />
    }

    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: "#000000",
            tabBarInactiveTintColor: "#a6a6a6",
            tabBarStyle: {
                backgroundColor: "#f0f0f0"
            }
        }} >
            <Tabs.Screen options={{
                headerShown: false,
                tabBarIcon: props => <TabIcon {...props} icon="Friends" />,
                title: "Friends"
            }} name="friends/index"  />
            <Tabs.Screen options={{
                headerShown: false,
                tabBarIcon: props => <TabIcon {...props} icon="Home" />,
                title: "Home"
            }} name="home/index" />
            <Tabs.Screen options={{
                headerShown: false,
                tabBarIcon: props => <TabIcon {...props} icon="Workouts" />,
                title: "Workouts"

            }} name="commitments/index" />
        </Tabs>
    )
}

export default HomeLayout;