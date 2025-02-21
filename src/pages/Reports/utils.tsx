import { CurrencyCell } from "./CurrencyCell";
import CurrencyNameAndFlag from "./CurrencyNameAndFlag";

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



export const formatNumber = (number: any) => {
    if (number == null) return '';

    const numberString = number.toString();
    const [integerPart, decimalPart] = numberString.split('.');

    // Format the integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // If there's no decimal part, return the formatted integer
    if (!decimalPart) {
        return formattedInteger;
    }

    // Remove trailing zeros from the decimal part
    const trimmedDecimal = decimalPart.replace(/0+$/, '');

    // If the trimmed decimal part is not empty, append it to the formatted integer
    return trimmedDecimal.length > 0
        ? `${formattedInteger}.${trimmedDecimal}`
        : formattedInteger;
};






export const determinePartyType = (flowType: string) => {
    return flowType === "incoming" ? "creditor" : "debtor";
}



export const currencyColumns = (currencies: Currency[]) => {
    return currencies.map((currency) => ({
        id: currency?.name,
        cell: CurrencyCell(currency?.id),
        header: () => <CurrencyNameAndFlag currencyId={currency?.id} />,
        size: 40,
    }));
}