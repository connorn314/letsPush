import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStore, Provider } from 'jotai';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import HomeScreen from './app/screens/home';

const Stack = createNativeStackNavigator();
export const store = createStore();

import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <NavigationContainer >
                <Stack.Navigator >
                    {/* <Stack.Screen options={{headerShown: false}} name="Login" component={Login} /> */}
                    <Stack.Screen options={{headerShown: false}} name="Home" component={HomeScreen} />
                    {/* <Stack.Screen name="Tour Details" component={TourDetails} /> */}
                </Stack.Navigator>
              </NavigationContainer>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
