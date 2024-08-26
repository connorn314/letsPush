import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStore, Provider } from 'jotai';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import HomeScreen from './app/screens/home';
import { NativeWindStyleSheet } from "nativewind";
import Login from './app/screens/login';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { usePushNotifications } from './app/storage/usePushNotifications';
import { expoPushTokenState, userState } from './app/storage/atomStorage';
import { useAtom } from "jotai";
import FriendsScreen from './app/screens/friends';
import { FIREBASE_AUTH, FIRESTORE_DB } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { User } from './app/types/user';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import WorkoutsScreen from './app/screens/workouts';
import SpinLoader from './app/components/spinLoader';
import { View } from 'react-native';
import useFriendsCommitments from './app/storage/useFriendsCommitments';
import useFriends from './app/storage/useFriends';
// import AddWorkoutModal from './app/components/addWorkout';

// import { usePushNotifications } from './app/storage/usePushNotifications';

NativeWindStyleSheet.setOutput({
  default: "native",
});

export const store = createStore();
const Stack = createNativeStackNavigator();
// const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const LoginStack = () => (
  <Stack.Navigator>
    <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
  </Stack.Navigator>
);

// const TestStack = () => (
//   <Tab.Navigator>
//     <Tab.Screen options={{ headerShown: false }} name="Friends" component={FriendsScreen} />
//     <Tab.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
//     <Tab.Screen options={{ headerShown: false }} name="Workouts" component={WorkoutsScreen} />
//   </Tab.Navigator>
// )

const MainAppStack = () => {
  useFriendsCommitments();
  useFriends();
  return (
    <Tab.Navigator>
      <Tab.Screen options={{ headerShown: false }} name="Friends" component={FriendsScreen} />
      <Tab.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
      <Tab.Screen options={{ headerShown: false }} name="Workouts" component={WorkoutsScreen} />
    </Tab.Navigator>

)};



const SubApp = () => {
  usePushNotifications();

  const [user, setUser] = useAtom(userState);
  const [expoToken,] = useAtom(expoPushTokenState);
  const [loading, setLoading] = useState(true);
  // const [notification, ] = useAtom(notificationState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, userObj => {
      if (userObj) {
        // setUser(userObj);
        getMe(userObj);
      } else {

        console.log("here anytime?")
        setUser(null);
        setLoading(false);
      }
    })

    return unsubscribe;
  }, [])

  const createUser = async (userObj: any) => {
    const userData = {
      name: "",
      created_at: Date.now(),
      friends: [],
      pushToken: expoToken || "",
      workouts: []
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
      if (userDoc.exists()) {
        const profile = userDoc.data();
        // console.log("retrieved profile", profile);
        setUser({ ...userObj, ...profile });
      } else {
        const newUser = (await createUser(userObj)).data
        setUser({ ...userObj, ...newUser })
      }
      setLoading(false);
    } catch (err: any) {
      console.log(err, "err")
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <View className="w-screen h-full justify-center items-center ">
        <SpinLoader color='black' />
      </View>
    );
  }
  return user ? <MainAppStack /> : <LoginStack />
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <NavigationContainer >
              {<SubApp />}
              {/* <Stack.Navigator >
                    <Stack.Screen options={{headerShown: false}} name="Home" component={HomeScreen} />
                    <Stack.Screen name="Add Workout" component={AddWorkoutScreen} />
                </Stack.Navigator> */}
            </NavigationContainer>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
};
