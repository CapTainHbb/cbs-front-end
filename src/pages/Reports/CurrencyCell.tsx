import BalanceAmount from "./BalanceAmount";
import {getBalanceByCurrencyId} from "../../helpers/currency";
import CreditorDebtorAmount from "./CreditorsAndDebtors/CreditorDebtorAmount";


export const CurrencyCell = (currencyId: number | undefined)  => (info: any)  => { // Use JSX.Element for components
    const { currency_accounts } = info.row.original;
    const amount = getBalanceByCurrencyId(currency_accounts, currencyId);

    return <BalanceAmount amount={amount} />;
};