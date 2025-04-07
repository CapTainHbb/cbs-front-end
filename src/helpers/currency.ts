import {Currency} from "../pages/Reports/utils";
import {CurrencyAccount} from "../pages/Accounting/types";

export const getBalanceByCurrencyId = (currencyAccounts: CurrencyAccount[], currencyId: number | undefined) => {
    return currencyAccounts?.find((account) => account.currency === currencyId)?.balance || 0
}

export const getCurrencyById  = (currencies: Currency[], currencyId: number | undefined) => {
    return currencies.find((currency: Currency) => currency?.id === currencyId)
}


export const getCurrencyNameById = (currencies: Currency[], currencyId: number | undefined) => {
    return getCurrencyById(currencies, currencyId)?.name
}