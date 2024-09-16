import { View } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const returnIcon = (icon: "Friends" | "Home" | "Workouts", color: string) => {
    switch (icon) {
        case "Friends":
            return <FontAwesome5 name="user-friends" size={16} color={color} />
        case "Home":
            return <FontAwesome name="home" size={20} color={color} />
        case "Workouts":
            return <FontAwesome5 name="running" size={16} color={color} />
        default:
            break;
    }

}
const TabIcon = ({ focused, color, size, icon }: { focused: boolean, color: string, size: number, icon: "Friends" | "Home" | "Workouts" }) => {
    return (
        <View className="p-2" >
            {returnIcon(icon, color)}
        </View>
    )
}

export default TabIcon;