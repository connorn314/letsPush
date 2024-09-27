import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// A simple list of timezones for demonstration purposes
const timezones = [
    { label: 'GMT-12:00', value: 'Etc/GMT+12' },
    { label: 'GMT-11:00', value: 'Etc/GMT+11' },
    { label: 'GMT-10:00', value: 'Etc/GMT+10' },
    { label: 'GMT-09:00', value: 'Etc/GMT+9' },
    { label: 'GMT-08:00', value: 'Etc/GMT+8' },
    { label: 'GMT-07:00', value: 'Etc/GMT+7' },
    { label: 'GMT-06:00', value: 'Etc/GMT+6' },
    { label: 'GMT-05:00', value: 'Etc/GMT+5' },
    { label: 'GMT-04:00', value: 'Etc/GMT+4' },
    { label: 'GMT-03:00', value: 'Etc/GMT+3' },
    { label: 'GMT-02:00', value: 'Etc/GMT+2' },
    { label: 'GMT-01:00', value: 'Etc/GMT+1' },
    { label: 'GMT+00:00', value: 'Etc/GMT' },
    { label: 'GMT+01:00', value: 'Etc/GMT-1' },
    { label: 'GMT+02:00', value: 'Etc/GMT-2' },
    { label: 'GMT+03:00', value: 'Etc/GMT-3' },
    { label: 'GMT+04:00', value: 'Etc/GMT-4' },
    { label: 'GMT+05:00', value: 'Etc/GMT-5' },
    { label: 'GMT+06:00', value: 'Etc/GMT-6' },
    { label: 'GMT+07:00', value: 'Etc/GMT-7' },
    { label: 'GMT+08:00', value: 'Etc/GMT-8' },
    { label: 'GMT+09:00', value: 'Etc/GMT-9' },
    { label: 'GMT+10:00', value: 'Etc/GMT-10' },
    { label: 'GMT+11:00', value: 'Etc/GMT-11' },
    { label: 'GMT+12:00', value: 'Etc/GMT-12' },
];

const TimezoneSelector = () => {
    const [selectedTimezone, setSelectedTimezone] = useState(-420);

    const isDaylightSavings = () => {
        const date = new Date();
        const jan = new Date(date.getFullYear(), 0, 1);
        const jul = new Date(date.getFullYear(), 6, 1);
        return date.getTimezoneOffset() < Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    };

    const constructTimeZones = () => {
        const DST = isDaylightSavings();
        return [
            {   // Hawaii does not observe DST, hence no conditional
                value: (-10 * 60), 
                label: "Hawaii Standard Time"
            },
            { // Pacific Time zone
                value: !DST ? (-8 * 60) : (-7 * 60),
                label: !DST ? "Pacific Standard Time" : "Pacific Daylight Time"
            },
            { // Mountain Time zone
                value: !DST ? (-7 * 60) : (-6 * 60),
                label: !DST ? "Mountain Standard Time" : "Mountain Daylight Time"
            },
            { // Central Time zone
                value: !DST ? (-6 * 60) : (-5 * 60),
                label: !DST ? "Central Standard Time" : "Central Daylight Time"
            },
            { // Eastern Time zone
                value: !DST ? (-5 * 60) : (-4 * 60),
                label: !DST ? "Eastern Standard Time" : "Eastern Daylight Time"
            }
            // If we ever need to add a new timezone, we would add it here,
            // if it observes DST then it would follow the above convention, otherwise it would look like Hawaii
        ]
    }

    return (
        <View className='h-80 border justify-center items-center'>
                {constructTimeZones().map((timezone) => (
                    <View>
                        <Text >{timezone.label}</Text>
                    </View>
                ))}
        </View>
    );
};


export default TimezoneSelector;
