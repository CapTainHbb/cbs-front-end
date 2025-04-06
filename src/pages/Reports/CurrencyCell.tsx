import BalanceAmount from "./BalanceAmount";
import CreditorDebtorAmount from "./CreditorsAndDebtors/CreditorDebtorAmount";
import { determinePartyType } from "./utils";
import {getBalanceByCurrencyId} from "../../helpers/currency";

export const CurrencyCell = (currencyId: number | undefined)  => (info: any)  => { // Use JSX.Element for components
    const { flow_type, balance_currency_accounts } = info.row.original;
    const amount = getBalanceByCurrencyId(balance_currency_accounts, currencyId);

    if (flow_type === "balance") {
        return <BalanceAmount amount={amount} />;
    } else if (flow_type === "incoming" || flow_type === 'outgoing')  {
        const partyType = determinePartyType(flow_type);
        return (
            <CreditorDebtorAmount
                amount={amount}
        type={partyType}
        party_type={partyType}
        />
        );
    } else {
        return <BalanceAmount amount={amount} />;
    }
};