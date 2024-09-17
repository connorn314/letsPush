
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