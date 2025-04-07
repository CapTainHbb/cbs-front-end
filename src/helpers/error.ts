import {t} from "i18next";


export const normalizeDjangoError = (error: any): string => {
    console.error(error);
    if(error?.response && error?.response?.status === 500) {
        return "Internal Server Error";
    }
    const extractMessages = (errors: any, prefix = ''): string[] => {
        if(!errors) return [""]

        return Object.entries(errors).flatMap(([key, value]) => {
            const fieldName = prefix ? `${prefix}.${key}` : key;
            if (Array.isArray(value)) {
                return [`${fieldName}: ${value.join(' ')}`];
            } else if (typeof value === 'object' && value !== null) {
                return extractMessages(value, fieldName);
            } else {
                return [`${fieldName}: ${t(String(value))}`];
            }
        });
    };

    return extractMessages(error?.response?.data).join('\n');
};

