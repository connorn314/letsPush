import { View, FlatList, Text } from "react-native";
import SingleOnboardingPage from "@/components/singleOnboardingPage";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FIRESTORE_DB } from "@/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useAtom } from "jotai";
import { userState } from "@/storage/atomStorage";


const OnboardingFlow = () => {

    const router = useRouter()

    const [user,] = useAtom(userState)

    const { indexStart } = useLocalSearchParams();

    // console.log("indexStart", indexStart)

    const [index, setIndex] = useState(Number(indexStart ?? "0"));

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50, // Trigger the callback when 50% of an item is visible
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            console.log(viewableItems[0].index, "hi")
            setIndex(viewableItems[0].index)
        }
    }).current;

    const updateOnboardingStatus = async () => {
        const userRef = doc(FIRESTORE_DB, "users", user.id)
        await updateDoc(userRef, {
            onboarding_incomplete: false
        })
    }

    const onPressNext = () => {
        if (index + 1 === 3) {
            // updateOnboardingStatus()
            router.push("/(tabs)/home")
            return;
        };
        console.log(index, "onpressNext")
        swiperRef.current?.scrollToIndex({
            index: index + 1
        })
    }

    const swiperRef = useRef<null | FlatList>(null);
    useEffect(() => {
        if (indexStart){
            swiperRef.current?.scrollToIndex({
                index: Number(indexStart),
                animated: false
            })
            // setIndex()
        }
    }, [])
    // console.log("index", index);

    return (
        <View className="w-screen h-screen bg-white">
            <SafeAreaView className=" ">
                <View className="w-full h-full relative">
                    <FlatList data={[0, 1, 2]}
                        renderItem={({ index: itemIndex }) => <SingleOnboardingPage index={itemIndex} goNext={onPressNext} />}
                        keyExtractor={(index) => `slide_${index}`}
                        // initialScrollIndex={Number(indexStart)}
                        onScrollToIndexFailed={info => {
                            console.log("info", info)
                            const wait = new Promise(resolve => setTimeout(resolve, 500));
                            wait.then(() => {
                                swiperRef.current?.scrollToIndex({ index: info.index, animated: false });
                            });
                        }}
                        horizontal
                        // pagingEnabled
                        // snapToAlignment="center"
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={false}
                        initialNumToRender={3}
                    // maxToRenderPerBatch={2}
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={viewabilityConfig}
                        ref={swiperRef}
                    />
                    <View className="absolute z-20 top-4 right-4">
                        <Text className="text-lg font-medium">{index + 1} / 3</Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default OnboardingFlow;