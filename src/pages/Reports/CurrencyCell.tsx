import BalanceAmount from "./BalanceAmount";
import {getBalanceByCurrencyId} from "../../helpers/currency";

export const GeneralLedgerCurrencyCell = (currencyId: number | undefined) => (info: any) => {
    const { balance_currency_accounts } = info.row.original;
    const amount = getBalanceByCurrencyId(balance_currency_accounts, currencyId);
    return <BalanceAmount amount={amount} />;
}

export const CurrencyCell = (currencyId: number | undefined)  => (info: any)  => { // Use JSX.Element for components
    const { currrency_accounts } = info.row.original;
    const amount = getBalanceByCurrencyId(currrency_accounts, currencyId);
    return <BalanceAmount amount={amount} />;
};