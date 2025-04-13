import moment from "moment";

export const getUTCFormattedDate = (date: Date): string | null => {
    if(!date) return null;

    return date?.toLocaleDateString("en-CA"); // Format as YYYY-MM-DD
};

export const getUTCFormattedDateTime = (date: Date): any => {
    if(!date) return {time: undefined, date: undefined}
    const formatted_time = date.toISOString().split("T")[1].split('.')[0];
    const formatted_date = date.toISOString().split("T")[0]
    return {time: formatted_time, date: formatted_date}
}

export const getToday = (): Date => {
    return new Date();
}

export const getFormattedToday = (): string | null => {
    return getUTCFormattedDate(getToday());
}

export const getUTCFormattedTodayDateTime = (): any => {
    return getUTCFormattedDateTime(getToday());
}

export const handleValidDate = (date: any) => {
    const date1 = moment(new Date(date)).format("DD/MM/Y");
    return date1;
};

export const handleValidTime = (time: any) => {
    const time1 = new Date(time);
    const getHour = time1.getHours();
    const getMin = time1.getMinutes();
    const getTime = `${getHour}:${getMin}`;
    var meridiem = "";
    if (getHour >= 12) {
        meridiem = "PM";
    } else {
        meridiem = "AM";
    }
    return moment(getTime, 'hh:mm').format('hh:mm') + " " + meridiem;
};

export const createLocalizedDate = (dateString: string, timeString: string) => {
    const dateTimeString = `${dateString}T${timeString}Z`; // Ensure it's treated as UTC
    return moment.utc(dateTimeString).local().toDate();
};

export const getLocalizedFormattedToday = () => {
    return getLocalizedFormattedDateTime(getToday());
}

export const getLocalizedFormattedDateTime = (date: Date) => {
    if(!date) return {time: undefined, date: undefined}
    const formatted_time = date?.toLocaleTimeString?.();
    const formatted_date = date?.toLocaleDateString?.()
    return {time: formatted_time, date: formatted_date}
}

export const getNowLocalTime = (): string => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0'); // Get hours (00-23)
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Get minutes (00-59)
    const seconds = "00"; // Manually set seconds to "82"

    return `${hours}:${minutes}:${seconds}`;
}

export const convertUtcTimeToLocal = (utcTime: string): string => {
    // Split the UTC time string into hours, minutes, and seconds
    const [utcHours, utcMinutes, utcSeconds] = utcTime.split(':').map(Number);

    // Create a Date object with the current date and the parsed UTC time
    const now = new Date();
    const utcDate = new Date(
        Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            utcHours,
            utcMinutes,
            utcSeconds
        )
    );

    // Convert the UTC date to local time
    const localHours = String(utcDate.getHours()).padStart(2, '0');
    const localMinutes = String(utcDate.getMinutes()).padStart(2, '0');
    const localSeconds = String(utcDate.getSeconds()).padStart(2, '0');

    // Format the local time as a string
    return `${localHours}:${localMinutes}:${localSeconds}`;
}