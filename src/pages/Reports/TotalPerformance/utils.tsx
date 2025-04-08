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


export const loopThroughDates = (fromDate: string, toDate: string, callback: any) => {
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    
    // Validate dates
    if (startDate > endDate) {
        console.error("From date cannot be after to date");
        return [];
    }

    let dates = []
    const currentDate = new Date(startDate);
    while(currentDate <= endDate) {
        const formattedDate = currentDate.toISOString().split('T')[0];
        dates.push(formattedDate)
        currentDate.setDate(currentDate.getDate() + 1);
        callback(formattedDate);
    }

    return dates;
}
