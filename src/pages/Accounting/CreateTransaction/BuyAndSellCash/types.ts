import {defaultParty, defaultTransaction, Party, Transaction} from "../../types";

export interface BuyAndSellCashFormDataType extends Transaction {
    exchange_rate: number,
    is_buy: boolean,
    creditor_party: Party;
    debtor_party: Party;
}

export const defaultBuyAndSellCashFormData : BuyAndSellCashFormDataType = {
    ...structuredClone(defaultTransaction),
    transaction_type: "buy-cash",
    exchange_rate: 0,
    is_buy: false,
    creditor_party: { ...defaultParty, type: "creditor", document_type: "main"},
    debtor_party: { ...defaultParty, type: "debtor", document_type: "main"},
}