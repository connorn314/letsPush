import { Workout } from "../types/workouts"
import { View, Text, TouchableOpacity } from "react-native";


const PersonalCommitmentCard = ({ item, onPress }: {item: Workout; onPress: () => void;}) => {
    const date = item.startDate.toDate();
    return (
        <TouchableOpacity key={`${item.id}`} className="bg-[#ffffff] shadow-sm border-rounded-full w-full rounded-lg p-4 my-1 flex-row justify-start items-center"
            onPress={onPress}  >
            <View className={`rounded-md justify-center items-center h-16 w-16 ${item.status === "complete" ? "bg-green-300" : (item.status === "failure" ? "bg-red-400" : "bg-slate-200")}`}>
                <Text className={`text-lg text-center `}>{`${date.getMonth() + 1}/${date.getDate()}`}</Text>
            </View>
            <View className="ml-2">
                <Text className="text-lg">{item.name}</Text>
                <Text className="">{item.distance} miles</Text>
                <Text className="">{(item.pace.length <= 2 ? "00" : item.pace.length === 3 ? `0${item.pace.slice(0, item.pace.length - 2)}` : item.pace.slice(0, item.pace.length - 2))}:{(item.pace.length > 2 ? item.pace.slice(item.pace.length - 2) : (item.pace.length === 1 ? `0${item.pace}` : item.pace)) || "00"}" / mi</Text>
            </View>
            <View className="grow text-right ">
                <Text className="grow text-right">{item.status === "complete" ? "Complete" : (item.status === "failure" ? "Failed" : "Unattempted")}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default PersonalCommitmentCard;