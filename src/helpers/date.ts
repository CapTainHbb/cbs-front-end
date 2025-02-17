import moment from "moment";

export const getFormattedDate = (date: Date): string => {
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
};

export const getFormattedDateTime = (date: Date): any => {
    if(!date) return {time: undefined, date: undefined}
    const formatted_time = date.toISOString().split("T")[1].split('.')[0];
    const formatted_date = date.toISOString().split("T")[0]
    return {time: formatted_time, date: formatted_date}
}


export const getToday = (): Date => {
    return new Date();
}

export const getFormattedToday = (): string => {
    return getFormattedDate(getToday());
}

export const getFormattedTodayDateTime = (): any => {
    return getFormattedDateTime(getToday());
}

export const handleValidDate = (date: any) => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
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

export const createDate = (dateString: string, timeString: string) => {
    const dateTimeString = `${dateString}T${timeString}`;
    return new Date(dateTimeString)
}