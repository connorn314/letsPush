import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { daysOfWeek, dayToSimpleString, generateTotalTime, metersToMiles, parsePace } from "@/util/helpers";
import AnimatedBar from "./singleBar";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MyDate, WeekOfCommitments, Workout } from "@/types/workouts";
import { friendCommitmentsState, myFriends, myWorkoutsState, userState } from "@/storage/atomStorage";
import { User } from "@/types/user";


const WeeklyCommitmentsDisplay = ({
    weekPlanData,
    personal
}:{
    weekPlanData: WeekOfCommitments;
    personal?: boolean
}) => {

    const [year, month, day] = weekPlanData.start.split("/")
    // console.log(weekPlanData)

    const router = useRouter();
    const [workouts, ] = useAtom(myWorkoutsState);
    const [friendCommitments, ] = useAtom(friendCommitmentsState);
    const [friends, ] = useAtom(myFriends);
    const [user, ] = useAtom(userState);
    const [author, setAuthor] = useState<User | null>(null);
    
    const [weekdays,] = useState(daysOfWeek(new Date(Number(year), Number(month) - 1, Number(day))));
    const [commitments, setCommitments] = useState<Workout[] | null>(null);
    const [actualHeights, setActualHeights] = useState<number [] | null>(null);
    const [goalHeights, setGoalHeights] = useState<number [] | null>(null);

    const [completionRate, setCompletionRate] = useState(1);
    const [paceDiff, setPaceDiff] = useState(0);

    function scaleToMaxHeight(maxHeight: number, overallMax: number, values: number[]): number[] {
        if (values.length === 0) return []; // Return an empty array if no values are provided

        const maxValue = overallMax; // Find the maximum value in the array

        // If the maximum value is 0, return an array of zeros
        if (maxValue === 0) return values.map(() => 0);

        // Scale each value proportionally to maxHeight
        return values.map(value => (value / maxValue) * maxHeight);
    }

    useEffect(() => {
        if (!weekdays || !weekPlanData ||(!personal && !friendCommitments) || (personal && !workouts)) return;
        const actualCommitments = weekPlanData.commitments.map(commitId => {
            return personal ? workouts.find(work => work.id === commitId) : friendCommitments.find(work => work.id === commitId)
        }).filter(com => com)

        if (!actualCommitments.length) return;
        setCommitments(actualCommitments as Workout[])

        const actuals = weekdays.map(day => metersToMiles(matchDayToDistance(day, actualCommitments as Workout[])?.strava?.distance ?? 0))
        const goals = weekdays.map(day => Number(matchDayToDistance(day, actualCommitments as Workout[])?.distance  ?? 0))
        const maxVal = Math.max(...actuals, ...goals);

        // console.log("actuals", actuals)
        // console.log("goals", goals)

        setActualHeights(scaleToMaxHeight(160, maxVal, actuals));
        setGoalHeights(scaleToMaxHeight(160, maxVal, goals));

        const attemptedDistance = (actualCommitments as Workout[]).filter(commit => commit.status === "complete" && commit.strava?.distance).reduce((acc, curr) => acc + metersToMiles(curr.strava?.distance as number), 0) 
        const goalAttemptedDistanceUpToThisPoint = (actualCommitments as Workout[]).filter(commit => commit.status !== "NA").reduce((acc, curr) => acc + Number(curr.distance), 0)

        // console.log("attemptedDistance", attemptedDistance)
        // console.log("goalAttemptedDistanceUpToThisPoint", goalAttemptedDistanceUpToThisPoint)
        
        if (goalAttemptedDistanceUpToThisPoint > 0){
            setCompletionRate(attemptedDistance / goalAttemptedDistanceUpToThisPoint)
        }

        // pace success is by subtracting totaling goal total time - actual total time = answer, then answer / miles = how much you were on average off of pace goal per mile in seconds
        const attemptedTime = (actualCommitments as Workout[]).filter(commit => commit.status === "complete").reduce((acc, curr) => acc + (curr.strava?.moving_time ?? 0), 0) 
        const goalAttemptedTimeUpToThisPoint = (actualCommitments as Workout[]).filter(commit => commit.status !== "NA").reduce((acc, curr) => acc + generateTotalTime(curr.pace, curr.distance), 0)
        
        // console.log(goalAttemptedTimeUpToThisPoint, "goalAttemptedTimeUpToThisPoint")

        if (goalAttemptedTimeUpToThisPoint > 0){
            setPaceDiff((attemptedTime / attemptedDistance) - (goalAttemptedTimeUpToThisPoint / goalAttemptedDistanceUpToThisPoint))
        }
    }, [weekdays, weekPlanData, friendCommitments])

    const matchDayToDistance = (day: MyDate, commits: Workout[]) => {
        return commits.find(commit => dayToSimpleString(commit.startDate.toDate()) === day.simpleString)
    }


    const getDateAbrv = (a: string) => {
        const startSegments = a.split("/")
        return `${startSegments[1]}/${startSegments[2]}`
    }

    useEffect(() => {
        if (!personal){
            setAuthor(friends.find(friend => friend.id === weekPlanData.userId) ?? null)
        }
    }, [friends])

    const start = weekPlanData.start.split("/");


    return (
        <View className=" justify-center items-center p-4 w-full">
            <Pressable onPress={() => {
                router.push({
                    pathname: "/weekOfCommitments/[weekPlanId]",
                    params: {
                        weekPlanId: weekPlanData.id,
                        name: `Week of ${start[1]}/${start[2]}`
                    }
                })
            }} className=" w-full rounded-2xl bg-white shadow-sm justify-center items-center p-4">
                <View className='flex-row w-full justify-start items-center'>
                    {/* <View className={`rounded-full justify-center items-center h-16 w-16 ${commitment.status === "complete" ? "bg-green-300" : (commitment.status === "failure" ? "bg-red-400" : "bg-slate-200")}`}> */}
                    {author?.profile_image_url ? (
                        <Image source={{ uri: author?.profile_image_url }} className="w-12 h-12 "
                        style={{
                            borderBottomLeftRadius: 5,
                            borderBottomRightRadius: 5,
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                        }} resizeMode={"cover"} />
                    ) : (
                        <View className={`rounded-[5px] justify-center items-center h-12 w-12 bg-main`}>
                            <Text className={`text-xl font-semibold text-center text-white `}>{(personal && user.name) ? user.name[0]?.toLocaleUpperCase()  : author?.name[0]?.toLocaleUpperCase() ?? "N"}</Text>
                        </View>
                    )}
                    <View className="ml-2">
                        <Text className="text-lg font-medium">{personal ? "Me" : author?.name ?? "New User"}</Text>
                        <Text className='text-sm h-6 '>Commitments {getDateAbrv(weekPlanData.start)} - {getDateAbrv(weekPlanData.end)}</Text>
                    </View>
                </View>
                <View className=" flex-row justify-evenly items-center w-full px-4 mt-6">
                    <View className="flex-row items-center">
                        <FontAwesome5 name="running" size={28} color="black" />
                        <Text className="w-fit text-3xl font-medium ml-2">{commitments?.filter(c => c.status === "complete").length}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <MaterialCommunityIcons name="emoticon-sick-outline" size={28} color="black" />
                        <Text className="w-fit text-3xl font-medium ml-2">{commitments?.filter(c => c.status === "failure").length}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <FontAwesome name="clock-o" size={28} color="black" />
                        <Text className="w-fit text-3xl font-medium ml-2">{commitments?.filter(c => c.status === "NA").length}</Text>
                    </View>
                </View>
                <View className="w-full flex-row items-center justify-evenly py-6">
                    <View className="w-fit justify-center items-center">
                        <Text className=" text-md font-medium mb-2">Completion</Text>
                        <View className={`rounded-lg px-3 py-1.5 ${completionRate >= .95 ? "bg-[#75ffa1]" : (completionRate >= .85 ? "bg-[#fff175]" : "bg-[#fd474c]")} `}>
                            <Text className=" text-lg font-medium ">{Math.round(completionRate * 100)}%</Text>
                        </View>
                    </View>
                    <View className="w-fit justify-center items-center">
                        <Text className=" text-md font-medium mb-2">Pace</Text>
                        <View className={`rounded-lg px-3 py-1.5 ${paceDiff <= 5 ? "bg-[#75ffa1]" : (paceDiff <= 30 ? "bg-[#fff175]" : "bg-[#fd474c]")}`}>
                            <Text className=" text-lg font-medium">{paceDiff >= 0 && "+"}{Math.round(paceDiff)} sec</Text>
                        </View>
                    </View>
                </View>
                {actualHeights && goalHeights && commitments && (
                    <View className="flex-row  justify-between items-center px-2 pb-4 rounded-lg ">
                        {weekdays.map((item, index) => {
                            const stat = matchDayToDistance(item, commitments)?.status ?? "NA"
                            return (
                                <View key={`${item.day}_${item.simpleString}`} className={` items-center justify-center`}>
                                    <View className="h-[160px] justify-end">
                                        <AnimatedBar status={stat} actualHeight={actualHeights[index]} goalHeight={goalHeights[index]} delay={(250 + (index * 100))} />
                                    </View>
                                    <View className={` text-center rounded-full items-center justify-center`}>
                                        <Text className={` p-4`}>{item.day}</Text>
                                    </View>
                                    <View className={`${item.today ? "bg-black" : ""} w-3 h-3 mb-2 rotate-45`} />
                                </View>
                            )
                        })}
                    </View>
                )}
            </Pressable>
        </View>
    )
}

export default WeeklyCommitmentsDisplay;