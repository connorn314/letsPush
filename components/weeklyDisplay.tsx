import { useAtom } from "jotai";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { myWorkoutsState } from "@/storage/atomStorage";
// import FadeInViewWrapper from "./fadeInViewWrapper";
import PersonalCommitmentCard from "./personalCommitmentCard";
import { useRouter } from "expo-router";
import { daysOfWeek } from "@/util/helpers";

const WeeklyCalendarDisplay = () => {

    const router = useRouter();
    const [weekdays,] = useState(daysOfWeek);
    const [currSelection, setCurrSelection] = useState(daysOfWeek().find(selection => selection.today))
    const [myCommitments,] = useAtom(myWorkoutsState);

    return (
        <View className=" justify-center items-center p-4 w-full">
            <View className=" w-full rounded-xl bg-[#ffffff] shadow-sm justify-center items-center p-4">
                <View className="w-full flex-row items-start justify-start pb-8">
                    <Text className=" text-lg font-medium">Weekly Commitments</Text>
                </View>
                <View className="flex-row  justify-between items-center px-2 pb-4 rounded-lg ">
                    {weekdays.map(item => (
                        <TouchableOpacity onPress={() => setCurrSelection(item)} key={`${item.year}_${item.simpleString}`} className={` items-center justify-center`}>
                            <View className={`${item.today ? "bg-black" : ""} w-3 h-3 mb-2 rotate-45`} />
                            <View className={`${currSelection?.day === item.day ? "bg-black" : ""} text-center rounded-full items-center justify-center`}>
                                <Text className={`${currSelection?.day === item.day ? " text-white" : ""} p-4`}>{item.day}</Text>
                            </View>
                            <View className={`${myCommitments.find(commit => (
                                commit.startDate.toDate().getDate() === item.day
                                && commit.startDate.toDate().getMonth() + 1 === item.month
                                && commit.startDate.toDate().getFullYear() === item.year)) ? "bg-cyan-500" : ""} mt-2 rounded-full w-6 h-2 `} ></View>
                        </TouchableOpacity>
                    ))}
                </View>
                {myCommitments.filter(commit => (
                    commit.startDate.toDate().getDate() === currSelection?.day
                    && commit.startDate.toDate().getMonth() + 1 === currSelection?.month
                    && commit.startDate.toDate().getFullYear() === currSelection?.year)).map(commit => (
                        <PersonalCommitmentCard key={`a_${commit.id}`} item={commit} onPress={() => {
                            router.push({
                                pathname: `/commitment/[commitmentId]`,
                                params: {
                                    commitmentId: commit.id
                                }
                            })
                        }} />
                    ))}
            </View>
        </View>
    )
}

export default WeeklyCalendarDisplay;