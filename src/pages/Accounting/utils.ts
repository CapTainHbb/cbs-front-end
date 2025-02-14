import {t} from "i18next";
import {useCallback} from "react";

export const determineCreditorOrDebtor = (balance: number) => {
    if(balance > 0) {
        return t("Creditor");
    } else if(Number(balance) === 0) {
        return "";
    } else {
        return t("Debtor");
    }
};

export const determineCurrencyTextColor = (balance: number) => {
    return balance > 0 ? '#008e00' : (balance < 0? '#ec0000': '')
}

export const removeNonNumberChars = (input: any) => {
    // Remove invalid characters (allow digits and a single decimal point)
    return input.replace(/[^0-9.]/g, '');
}

export const customFormatNumber = (rawInput: any) => {
    rawInput = removeNonNumberChars(rawInput);

    const parts = rawInput.split('.');
    if (parts.length > 2) {
        rawInput = parts[0] + '.' + parts.slice(1).join('');
    }

    // Split integer and decimal parts
    const [integerPart, decimalPart] = rawInput.split('.');

    // Format the integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Reconstruct the formatted value
    let formattedValue = decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;

    // Handle the case where the user types only '.'
    if (rawInput.startsWith('.')) formattedValue = '.' + decimalPart;
    return formattedValue;
}