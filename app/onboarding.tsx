import { View, FlatList, Text } from "react-native";
import SingleOnboardingPage from "@/components/singleOnboardingPage";
import { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";


const OnboardingFlow = () => {

    const router = useRouter()

    const [index, setIndex] = useState(0);

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50, // Trigger the callback when 50% of an item is visible
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setIndex(viewableItems[0].index)
        }
    }).current;

    const onPressNext = () => {
        if (index + 1 === 3) {
            router.push("/login")
            return;
        };
        swiperRef.current?.scrollToIndex({
            index: index + 1
        })
        // setIndex(index + 1)
    }
    
    const swiperRef = useRef<null | FlatList>(null)

    return (
        <View className="w-screen h-screen bg-white">
            <SafeAreaView className=" ">
                <View className="w-full h-full relative">

                <FlatList data={[0, 1, 2]}
                        renderItem={({index}) => <SingleOnboardingPage index={index} goNext={onPressNext} />}
                        keyExtractor={(index) => `slide_${index}`}
                        horizontal
                        pagingEnabled
                        snapToAlignment="center"
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={viewabilityConfig}
                        // initialNumToRender={1}
                        // maxToRenderPerBatch={2}
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