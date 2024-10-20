
export const metersToMiles = (meters: number) => {
    const metersInMile = 1609.34;
    return (meters / metersInMile);
}

export const calculatePace = (timeInSeconds: number, distanceInMiles: number) => {
    const paceInSecondsPerMile = timeInSeconds / distanceInMiles;

    const minutes = Math.floor(paceInSecondsPerMile / 60);
    const seconds = Math.floor(paceInSecondsPerMile % 60);

    return { minutes, seconds }
}

export const parsePace = (str: string) => {
    const seconds = Number(str.slice(-2));
    const minutes = str.length > 2 ? Number(str.slice(0, -2)) : 0;

    return { minutes, seconds }
}

export const generateTotalTime = (paceString: string, distance: number) => {
    const { minutes, seconds } = parsePace(paceString);
    const secondsPerMile = seconds + (minutes * 60)
    return distance * secondsPerMile
}

export const actualPaceFaster = (actual: { minutes: number, seconds: number }, target: { minutes: number, seconds: number }) => {
    if (actual.minutes < target.minutes) return true;
    if (actual.minutes === target.minutes && actual.seconds < target.seconds) return true;
    return false;
}


export const convertSeconds = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
        hours,
        minutes,
        seconds
    };
}

export const formatTime = (timeObject: { hours: number, minutes: number, seconds: number }) => {
    const { hours, minutes, seconds } = timeObject;

    // Add leading zeros if necessary
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export const daysOfWeek = (referenceDay?: Date) => { // reference day = 2024/9/30
    const weekDays = [];
    // console.log(referenceDay, "referenceDay")
    const today = referenceDay ? new Date(referenceDay) : new Date();
    // console.log(today.toDateString())
    const currentDay = today.getDay(); // Get the current day (0 = Sunday, 6 = Saturday)

    // Loop through the week starting from Sunday (0) to Saturday (6)
    for (let i = 0; i < 7; i++) {
        const date = referenceDay ? new Date(referenceDay) : new Date();
        date.setDate(today.getDate() - currentDay + i); // Set the date for each day of the week

        // Create an object for each day
        weekDays.push({
            day: date.getDate(),
            month: date.getMonth() + 1, // Months are 0-indexed, so add 1
            monthString: date.toLocaleString('default', { month: 'short' }),
            year: date.getFullYear(),
            simpleString: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
            today: date.toDateString() === new Date().toDateString()
        });
    }

    return weekDays;
}

export const dayToSimpleString = (date: Date) => {
    // console.log("recieving date", date.toDateString(), date.getDate())
    const day = date.getDate();
    const month = (date.getMonth() + 1) % 12; // Months are 0-indexed, so add 1
    const year = date.getFullYear();
    return `${year}/${month}/${day}`
}


export const getSundayOfWeek = (date: Date): string => {
    // Get the day of the week (0 for Sunday, 1 for Monday, etc.)
    const dayOfWeek = date.getDay();

    // Calculate the difference to the previous Sunday
    const diffToSunday = date.getDate() - dayOfWeek;

    // Create a new date for the Sunday of that week
    const sundayDate = new Date(date.setDate(diffToSunday));

    // Format the date as YYYY/M/D
    const year = sundayDate.getFullYear();
    const month = sundayDate.getMonth() + 1; // Months are 0-indexed
    const day = sundayDate.getDate();

    return `${year}/${month}/${day}`;
}

export const timeAgoString = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(seconds / 86400);
    const weeks = Math.floor(seconds / 604800);
    
    if (seconds < 60) {
        return seconds === 1 ? "1s ago" : `${seconds}s ago`;
    } else if (minutes < 60) {
        return minutes === 1 ? "1m ago" : `${minutes}m ago`;
    } else if (hours < 24) {
        return hours === 1 ? "1hr ago" : `${hours}hr ago`;
    } else if (days < 7) {
        return days === 1 ? "yesterday" : `${days}d ago`;
    } else if (weeks < 4) {
        return weeks === 1 ? "last week" : `${weeks}w ago`;
    } else {
        return `${Math.floor(weeks / 4)}mo ago`;
    }
}