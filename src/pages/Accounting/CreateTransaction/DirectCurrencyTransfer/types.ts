import {defaultParty, defaultTransaction, Party, Transaction} from "../../types";

export interface DirectCurrencyTransferTransaction extends Transaction {
    amount: number;
    creditor_party: Party;
    debtor_party: Party;
}

export const defaultDirectCurrencyTransferFormData : DirectCurrencyTransferTransaction = {
    ...structuredClone(defaultTransaction),
    transaction_type: "direct-currency-transfer",
    amount: 0,
    creditor_party: { ...defaultParty, type: "creditor", document_type: "main"},
    debtor_party: { ...defaultParty, document_type: "main"},
}