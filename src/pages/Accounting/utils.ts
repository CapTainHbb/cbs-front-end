import {t} from "i18next";

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