import {getBalanceByCurrencyId} from "../../../helpers/currency";
import CreditorDebtorAmount from "../CreditorsAndDebtors/CreditorDebtorAmount";
import BalanceAmount from "../BalanceAmount";

export const totalPerformanceCurrencyCell = (currencyId: number | undefined) => (info: any) => {
    const { flow_type, currency_accounts } = info.row.original;
    const amount = getBalanceByCurrencyId(currency_accounts, currencyId);

    if(flow_type === "incoming") {
        return <CreditorDebtorAmount type={'creditor'} party_type={'creditor'} amount={amount} />
    } else if(flow_type === "outgoing") {
        return <CreditorDebtorAmount type={'debtor'} party_type={'debtor'} amount={amount} />
    } else if(flow_type === "balance") {
        return <BalanceAmount amount={amount} />
    }
}
