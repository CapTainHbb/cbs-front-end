
export const defaultCompanyProfile = {
    name: "",
    profile_photo: "",
    country: "",
    state: "",
    city: "",
    address: "",
    zip_code: "",
    email: "",
    phone: "",
    website: "",
    fax: "",
}

export interface FinancialAccount {
    id?: number;
    name: string;
    code: string;
    parent_group: number;
    full_code?: string;
    full_name?: string;
    customer?: number;
    is_confidential: boolean;
}

export const defaultFinancialAccount : FinancialAccount = {
    id: undefined,
    name: "",
    code: "",
    parent_group: -1,
    customer: undefined,
    is_confidential: false,
}

export interface CurrencyAccount {
    financial_account: FinancialAccount;
    balance: number;
    currency: number;
}

export interface Currency {
    id?: number;
    name: string;
    alternative_name?: string;
}

export const defaultCurrency : Currency = {
    id: undefined,
    name: '',
    alternative_name: "",
}

export interface PartyType {
    id: number;
    name: string;
    translated_name: string;
}


export const getBalanceByCurrencyId = (currencyAccounts: CurrencyAccount[], currencyId: number | undefined) => {
    return currencyAccounts.find((account) => account.currency === currencyId)?.balance || 0
}

export const getCurrencyById  = (currencies: Currency[], currencyId: number | undefined) => {
    return currencies.find((currency: Currency) => currency?.id === currencyId)
}


export const getCurrencyNameById = (currencies: Currency[], currencyId: number | undefined) => {
    return getCurrencyById(currencies, currencyId)?.name
}

export const formatNumber = (number: any) => {
    if (number == null) return '';

    const numberString = number.toString();
    const [integerPart, decimalPart] = numberString.split('.');

    // Format the integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Check if the decimal part is non-zero or undefined
    return decimalPart && parseInt(decimalPart) !== 0
        ? `${formattedInteger}.${decimalPart}`
        : formattedInteger;
};