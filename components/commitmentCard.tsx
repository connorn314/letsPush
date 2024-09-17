import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { myFriends } from '@/storage/atomStorage';
import { Workout } from '../types/workouts';
import { User } from '../types/user';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { actualPaceFaster, calculatePace, convertSeconds, formatTime, metersToMiles, parsePace } from '../util/helpers';

const CommitmentCard = ({ commitment, onPress }: { commitment: Workout, onPress: () => void }) => {

    const date = commitment.startDate.toDate();
    const [friends] = useAtom(myFriends);
    const [author, setAuthor] = useState<User | null>(null);

    useEffect(() => setAuthor(friends.find(friend => friend.id === commitment.userId) ?? null), [friends])

    return (
        <View className='w-full px-4'>
            <TouchableOpacity className="bg-[#ffffff] shadow-sm w-full p-4 my-1 justify-center rounded-xl items-start"
                onPress={() => {
                    onPress()
                }}  >
                <View className='flex-row justify-between items-center w-full'>
                    <View className='flex-row justify-start items-center'>
                        {/* <View className={`rounded-full justify-center items-center h-16 w-16 ${commitment.status === "complete" ? "bg-green-300" : (commitment.status === "failure" ? "bg-red-400" : "bg-slate-200")}`}> */}
                        <View className={`rounded-full justify-center items-center h-16 w-16 bg-orange-500`}>
                            <Text className={`text-2xl font-semibold text-center text-white `}>{`${author?.name[0]?.toLocaleUpperCase() ?? "N"}`}</Text>
                        </View>
                        <View className="ml-2">
                            <Text className="text-lg font-medium">{commitment.name}</Text>
                            <Text className='text-sm h-6 '>{author?.name} </Text>
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
                    <View className='flex-row'>
                        <View className=''>
                            <View className='flex-row'>
                                <Text className='font-medium mr-1'>Distance</Text>
                                {commitment?.strava && <CommitmentIcon a={metersToMiles(commitment?.strava?.distance) > commitment.distance} />}


                            </View>
                            <Text className="text-xl">{commitment.distance} mi</Text>
                            {commitment?.strava?.distance && <Text className="text-md">{metersToMiles(commitment?.strava?.distance).toFixed(2)} mi</Text>}
                        </View>
                        <View className='ml-4'>
                            <View className='flex-row'>
                                <Text className='font-medium mr-1'>Pace</Text>
                                {commitment?.strava && <CommitmentIcon a={actualPaceFaster(calculatePace(commitment.strava.moving_time, metersToMiles(commitment?.strava?.distance)), parsePace(commitment.pace))} />}
                            </View>
                            <Text className="text-xl">{(commitment.pace.length <= 2 ? "00" : commitment.pace.length === 3 ? `0${commitment.pace.slice(0, commitment.pace.length - 2)}` : commitment.pace.slice(0, commitment.pace.length - 2))}:{(commitment.pace.length > 2 ? commitment.pace.slice(commitment.pace.length - 2) : (commitment.pace.length === 1 ? `0${commitment.pace}` : commitment.pace)) || "00"}" / mi</Text>
                            {commitment?.strava?.moving_time && commitment.strava.distance && <Text className="text-md">{`${calculatePace(commitment.strava.moving_time, metersToMiles(commitment?.strava?.distance)).minutes}:${calculatePace(commitment.strava.moving_time, metersToMiles(commitment?.strava?.distance)).seconds}`}" / mi</Text>}
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
                {/* <View className="grow text-right ">
                    <Text className="grow text-right">{commitment.status === "complete" ? "Complete" : (commitment.status === "failure" ? "Failed" : "Unattempted")}</Text>
                </View> */}
            </TouchableOpacity>
        </View>
    )
}

export default CommitmentCard;

const CommitmentIcon = ({ a }: { a: boolean }) => {
    return a ? (
        <View className='bg-green-600 rounded p-[2px]'>
            <Entypo name="check" size={12} color="white" />
        </View>
    ) : (
        <View className='bg-red-600 rounded py-[2px] px-[4px]'>
            <FontAwesome5 name="times" size={12} color="white" />
        </View>
    )
}