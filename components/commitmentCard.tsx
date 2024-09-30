import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { myFriends, userState } from '@/storage/atomStorage';
import { Workout } from '../types/workouts';
import { User } from '../types/user';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { actualPaceFaster, calculatePace, convertSeconds, formatTime, metersToMiles, parsePace } from '../util/helpers';

const CommitmentCard = ({ commitment, onPress, personal }: { commitment: Workout, onPress: () => void, personal?: boolean }) => {

    const date = commitment.startDate.toDate();
    const [friends] = useAtom(myFriends);
    const [author, setAuthor] = useState<User | null>(null);

    useEffect(() => setAuthor(friends.find(friend => friend.id === commitment.userId) ?? null), [friends])
    // useEffect(() => console.log(author), [author])
    return (
        <View className='w-full px-4'>
            <View className="bg-[#ffffff] shadow-sm w-full p-4 my-1 justify-center rounded-xl items-start" >
                <View className='flex-row justify-between items-center w-full'>
                    <View className='flex-row justify-start items-center'>
                        {/* <View className={`rounded-full justify-center items-center h-16 w-16 ${commitment.status === "complete" ? "bg-green-300" : (commitment.status === "failure" ? "bg-red-400" : "bg-slate-200")}`}> */}
                        <View className={`rounded-full justify-center items-center h-16 w-16 bg-[#a538ff]`}>
                            <Text className={`text-2xl font-semibold text-center text-white `}>{`${author?.name[0]?.toLocaleUpperCase() ?? "N"}`}</Text>
                        </View>
                        <View className="ml-2">
                            <Text className="text-lg font-medium">{commitment.name || `${Math.round(commitment.distance)} mile run`}</Text>
                            <Text className='text-sm h-6 '>{personal ? "Me" : author?.name} </Text>
                            <View className='flex-row justify-start items-center py-1'>
                                <FontAwesome5 name="running" size={18} color="black" />
                                <Text className='ml-2 font-medium'>Scheduled for {`${date.getMonth() + 1}/${date.getDate()}`}</Text>
                            </View>
                        </View>
                    </View>
                    <View className=''>
                        {commitment.status === "NA" && (
                            <FontAwesome name="clock-o" size={24} color="black" />
                        )}
                        {commitment.status === "complete" && (
                            <Entypo name="check" size={24} color="green" />
                        )}
                        {commitment.status === "failure" && (
                            <FontAwesome5 name="times" size={24} color="red" />
                        )}
                    </View>
                </View>
                <View className={`w-full flex-row  items-start py-4 ${commitment?.strava ? "justify-between" : "justify-start"}`}>
                    <View className='flex-row '>
                        <View className={``}>
                            <View className={`flex-row items-center ${commitment?.strava ? `${metersToMiles(commitment?.strava?.distance) > commitment.distance ? "bg-[#75ffa1]" : "bg-[#fd474c]"} justify-center py-1 px-2 rounded-full` : ""}`}>
                                {commitment?.strava && <CommitmentIcon a={metersToMiles(commitment?.strava?.distance) > commitment.distance} />}
                                <Text className='font-medium mr-1'>Distance</Text>


                            </View>
                            {commitment?.strava?.distance && <Text className="text-xl">{metersToMiles(commitment?.strava?.distance).toFixed(2)} mi</Text>}
                            <Text className={` ${commitment?.strava ? "text-md" : "text-xl"}`}>{commitment.distance} mi</Text>
                        </View>
                        <View className={`ml-4 `}>
                            <View className={`flex-row items-center ${commitment?.strava ? `${actualPaceFaster(calculatePace(commitment.strava.moving_time, metersToMiles(commitment?.strava?.distance)), parsePace(commitment.pace)) ? "bg-[#75ffa1]" : "bg-[#fd474c]"} justify-center py-1 px-2 rounded-full` : ""}`}>
                                {commitment?.strava && <CommitmentIcon a={actualPaceFaster(calculatePace(commitment.strava.moving_time, metersToMiles(commitment?.strava?.distance)), parsePace(commitment.pace))} />}
                                <View className=''>
                                    <Text className='font-medium  mr-1'>Pace</Text>
                                </View>
                            </View>
                            {commitment?.strava?.moving_time && commitment.strava.distance && <Text className="text-xl">{`${calculatePace(commitment.strava.moving_time, metersToMiles(commitment?.strava?.distance)).minutes}:${calculatePace(commitment.strava.moving_time, metersToMiles(commitment?.strava?.distance)).seconds}`}" / mi</Text>}
                            <Text className={`${commitment?.strava ? "text-md" : "text-xl"}`}>{(commitment.pace.length <= 2 ? "00" : commitment.pace.length === 3 ? `0${commitment.pace.slice(0, commitment.pace.length - 2)}` : commitment.pace.slice(0, commitment.pace.length - 2))}:{(commitment.pace.length > 2 ? commitment.pace.slice(commitment.pace.length - 2) : (commitment.pace.length === 1 ? `0${commitment.pace}` : commitment.pace)) || "00"}" / mi</Text>
                        </View>
                    </View>
                    {commitment.strava?.moving_time && (
                        <View className='mr-4'>
                            <View className='flex-row'>
                                <Text className='font-medium mr-1'>Time</Text>
                            </View>
                            <Text className="text-xl">{formatTime(convertSeconds(commitment.strava.moving_time))}</Text>
                        </View>
                    )}

                </View>
                {commitment.strava && (
                    <TouchableOpacity onPress={() => console.log("link to strava")} className='w-full flex-row justify-end items-center'>
                        <Text className='text-gray-600 underline'>See in Strava</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

export default CommitmentCard;

const CommitmentIcon = ({ a }: { a: boolean }) => {
    return a ? (
        <View className=' rounded-full p-[2px]'>
            <Entypo name="check" size={12} />
        </View>
    ) : (
        <View className=' rounded-full py-[2px] px-[4px]'>
            <FontAwesome5 name="times" size={12} />
        </View>
    )
}