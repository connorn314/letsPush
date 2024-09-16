import { useAtom } from "jotai";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { myWorkoutsState } from "../storage/atomStorage";
import FadeInViewWrapper from "./fadeInViewWrapper";
import PersonalCommitmentCard from "./personalCommitmentCard";

const daysOfWeek = () => {
    const weekDays = [];
    const today = new Date();
    const currentDay = today.getDay(); // Get the current day (0 = Sunday, 6 = Saturday)

    // Loop through the week starting from Sunday (0) to Saturday (6)
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() - currentDay + i); // Set the date for each day of the week

        // Create an object for each day
        weekDays.push({
            day: date.getDate(),
            month: date.getMonth() + 1, // Months are 0-indexed, so add 1
            year: date.getFullYear(),
            today: date.toDateString() === today.toDateString()
        });
    }

    return weekDays;
}

const WeeklyCalendarDisplay = ({ navigation }: { navigation: any }) => {

    const dateToday = (new Date()).getDate();
    const monthToday = (new Date()).getMonth() + 1;
    const yearToday = (new Date()).getFullYear();

    const [weekdays, setWeekdays] = useState(daysOfWeek);
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
                        <TouchableOpacity onPress={() => setCurrSelection(item)} key={item.day} className={` items-center justify-center`}>
                            <FadeInViewWrapper>
                                <View className={`${item.today ? "bg-black" : ""} w-3 h-3 mb-2 rotate-45`} >

                                </View>
                            </FadeInViewWrapper>
                            <View className={`${currSelection?.day === item.day ? "bg-black" : ""} text-center rounded-full items-center justify-center`}>
                                <Text className={`${currSelection?.day === item.day ? " text-white" : ""} p-4`}>{item.day}</Text>
                            </View>
                            <FadeInViewWrapper >
                                <View className={`${myCommitments.find(commit => (
                                    commit.startDate.toDate().getDate() === item.day
                                    && commit.startDate.toDate().getMonth() + 1 === item.month
                                    && commit.startDate.toDate().getFullYear() === item.year)) ? "bg-cyan-500" : ""} mt-2 rounded-full w-6 h-2 `} ></View>
                            </FadeInViewWrapper>
                        </TouchableOpacity>
                    ))}
                </View>
                <FadeInViewWrapper>
                    {myCommitments.filter(commit => (
                        commit.startDate.toDate().getDate() === currSelection?.day
                        && commit.startDate.toDate().getMonth() + 1 === currSelection?.month
                        && commit.startDate.toDate().getFullYear() === currSelection?.year)).map(commit => (
                            <PersonalCommitmentCard key={`a_${commit.id}`} item={commit} onPress={() => {
                                navigation.navigate("Personal Workout Details", {
                                    workoutDetails: commit
                                })
                            }} />
                        ))}
                </FadeInViewWrapper>
            </View>
        </View>
    )
}

export default WeeklyCalendarDisplay;