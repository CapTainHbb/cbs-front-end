import {CurrencyCell, GeneralLedgerCurrencyCell} from "./CurrencyCell";
import CurrencyNameAndFlag from "./CurrencyNameAndFlag";
import {getBalanceByCurrencyId} from "../../helpers/currency";
import {Column} from "@tanstack/react-table";
import {Row} from "reactstrap";
import { GeneralLedgerReportItemType } from "pages/Accounting/GeneralLedger/GeneralLedger";

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

export function scrollToBottom() {
    const container = document.getElementById("scrollContainer");
    if (container) {
        requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight;
        });
    }
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
        minSize: 120,  // Ensure the column doesn't shrink below this size
        maxSize: 120,  // Prevent resizing beyond this size
        width: 120      // Explicitly set the width
    }));
}

export const generalLedgerCurrencyColumns = (currencies: Currency[]) => {
    return currencies.map((currency) => ({
        id: currency?.name,
        cell: GeneralLedgerCurrencyCell(currency?.id),
        header: ({ column }: { column: Column<GeneralLedgerReportItemType> }) => (
            <Row>
                <CurrencyNameAndFlag currencyId={currency?.id} />
                <div onClick={() => column.toggleSorting()}>
                    {column.getIsSorted() === 'asc' ? <i className={'ri-arrow-up-line'}/> :
                        column.getIsSorted() === 'desc' ? <i className={'ri-arrow-down-line'}/> :
                            <i className={'ri-arrow-up-down-line'}/>}
                </div>
            </Row>
        ),
        minSize: 120,
        maxSize: 120,
        width: 120,
        // Add sorting properties
        enableSorting: true,
        sortingFn: 'basic' as const, // or 'alphanumeric' as const
        accessorFn: (row: GeneralLedgerReportItemType) => {
            const { balance_currency_accounts } = row;
            return getBalanceByCurrencyId(balance_currency_accounts, currency?.id); // Adjust this based on your actual data structure
        },
    }));
};