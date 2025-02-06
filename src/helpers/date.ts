export const getFormattedDate = (date: Date): string => {
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
};

export const getFormattedDateTime = (date: Date): any => {
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
