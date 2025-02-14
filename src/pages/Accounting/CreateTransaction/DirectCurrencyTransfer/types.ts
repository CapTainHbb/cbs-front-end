import {defaultParty, Party} from "../../types";

export interface DirectCurrencyTransferTransaction {
    id?: number;
    date: string;
    time: string;
    amount: number;
    transaction_type: string;
    description: string;
    user_specified_id: string;
    prev_transaction?: number;
    next_transaction?: number;
    creditor_party: Party;
    debtor_party: Party;
    is_edit_enabled: boolean;
}

export const defaultDirectCurrencyTransferFormData : DirectCurrencyTransferTransaction = {
    transaction_type: "direct-currency-transfer",
    amount: 0,
    date: "",
    time: "",
    description: "",
    user_specified_id: "",
    is_edit_enabled: false,
    creditor_party: { ...defaultParty, type: "creditor", document_type: "main"},
    debtor_party: { ...defaultParty, document_type: "main"},
    prev_transaction: undefined,
    next_transaction: undefined,
}