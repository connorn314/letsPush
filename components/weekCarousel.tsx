
// you can only create week workout plans for weeks in future 

import { daysOfWeek, dayToSimpleString } from "@/util/helpers";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Pressable, View, Text } from "react-native";
import OneWeekSlide from "./oneWeekSlide";
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { lockPageOnCarousel } from "@/storage/atomStorage";
import { useAtom } from "jotai";


const WeekCarousel = () => {
    const dayNextWeek = new Date()
    const dayInTwoWeeks = new Date()
    dayNextWeek.setDate(dayNextWeek.getDate() + 7);
    dayInTwoWeeks.setDate(dayInTwoWeeks.getDate() + 14);
    // console.log("dayInTwoWeeks", dayInTwoWeeks)
    const [weeks, setWeeks] = useState([daysOfWeek(), daysOfWeek(dayNextWeek), daysOfWeek(dayInTwoWeeks)])

    const [index, setIndex] = useState(0);
    const [lockPage, setLockPage] = useAtom(lockPageOnCarousel);

    const buttonOpacityLeft = useSharedValue(0);
    const buttonOpacityRight = useSharedValue(1);
    const buttonPosition = useSharedValue(0);

    const swiperRef = useRef<null | FlatList>(null)

    const generateNewWeek = () => {
        const lastDay = weeks[weeks.length - 1][6]
        // console.log("lastDay", lastDay)
        const nextDate = new Date(lastDay.year, lastDay.month - 1, lastDay.day)
        // console.log("generateNewWeek", nextDate.toLocaleString())
        nextDate.setDate(nextDate.getDate() + 1);
        // console.log("generateNewWeek2", nextDate.toLocaleString())
        setWeeks([...weeks, daysOfWeek(nextDate)])
    }

    const onPressNext = () => {
        if (index + 1 === weeks.length || lockPage) return;
        swiperRef.current?.scrollToIndex({
            index: index + 1
        })
        // setIndex(index + 1)
    }

    const onPressPrevious = () => {
        if (index === 0 || lockPage) return;
        swiperRef.current?.scrollToIndex({
            index: index - 1
        })
        // setIndex(index - 1)
    }

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50, // Trigger the callback when 50% of an item is visible
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setIndex(viewableItems[0].index)
        }
    }).current;

    const andimatedOpacityLeft = useAnimatedStyle(() => ({
        opacity: buttonOpacityLeft.value,
        left: buttonPosition.value,
    }))

    const andimatedOpacityRight = useAnimatedStyle(() => ({
        opacity: buttonOpacityRight.value,
        right: buttonPosition.value
    }))

    useEffect(() => {
        if (index + 1 === weeks.length - 1) {
            generateNewWeek()
        }
    }, [index])

    useEffect(() => {
        // if page is locked and either button has opacity greater than one, animate opacity to one
        if (lockPage && (buttonOpacityLeft.value > 0 || buttonOpacityRight.value > 0)) {
            setTimeout(() => {
                buttonOpacityRight.value = withTiming(0, { duration: 300, easing: Easing.elastic(1) });
                buttonOpacityLeft.value = withTiming(0, { duration: 300, easing: Easing.elastic(1) });
                buttonPosition.value = withTiming(-100, { duration: 300, easing: Easing.elastic(1) });
            }, 50)
        } else if (!lockPage && (buttonOpacityLeft.value < 1 || buttonOpacityRight.value < 1)) {
            setTimeout(() => {
                buttonOpacityRight.value = withTiming(1, { duration: 300, easing: Easing.elastic(1) });
                buttonPosition.value = withTiming(0, { duration: 300, easing: Easing.elastic(1) });
                if (index === 0) return;
                buttonOpacityLeft.value = withTiming(1, { duration: 300, easing: Easing.elastic(1) });
            }, 150)
        } 

        if (index === 0 && buttonOpacityLeft.value > 0){
            setTimeout(() => {
                buttonOpacityLeft.value = withTiming(0, { duration: 500, easing: Easing.elastic(1) });
            }, 100)
        }
    }, [lockPage, index])

    return (
        <View className=" ">
            <View className="  relative">
                <FlatList data={weeks}
                    renderItem={({ item }) => <OneWeekSlide days={item} />}
                    keyExtractor={(item) => `slide_${item[0].simpleString}`}
                    horizontal
                    pagingEnabled
                    snapToAlignment="center"
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={!lockPage}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    // initialNumToRender={1}
                    // maxToRenderPerBatch={2}
                    ref={swiperRef}
                />
                <Animated.View style={[{}, andimatedOpacityLeft]} className="h-full px-4 justify-center items-center absolute"  >
                    <Pressable className="h-full w-full justify-center items-center" onPress={onPressPrevious}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </Pressable>
                </Animated.View>
                <Animated.View style={[{}, andimatedOpacityRight]} className="h-full px-4 justify-center items-center absolute "  >
                    <Pressable className="h-full w-full justify-center items-center" onPress={onPressNext}>
                        <Ionicons name="arrow-forward" size={24} color="black" />
                    </Pressable>
                </Animated.View>
            </View>

        </View>
    )
}

export default WeekCarousel;