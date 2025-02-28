import { removeNonNumberChars } from "pages/Accounting/utils";

export const calculateNewExchangeRate = ((baseAmount: any, againstAmount: any, conversionType: string) => {
    let exchangeRate = 0;
    const baseAmountNumber = Number(removeNonNumberChars(baseAmount))
    const againstAmountNumber = Number(removeNonNumberChars(againstAmount))
    if(conversionType === 'multiplication') {
        if(baseAmountNumber === 0) {
            exchangeRate = 0;
        } else {
            exchangeRate = againstAmountNumber/ baseAmountNumber
        }
    } else {
        if(baseAmountNumber === 0) {
            exchangeRate = 0;
        } else {
            exchangeRate = baseAmountNumber / againstAmountNumber 
        }
    }
    return exchangeRate
})