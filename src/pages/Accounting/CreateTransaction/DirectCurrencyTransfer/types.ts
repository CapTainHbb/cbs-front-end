import {defaultDate, defaultParty, defaultTime, Party} from "../../types";

export interface DirectCurrencyTransferTransaction {
    id?: number;
    transaction_type: string;
    user_specified_id: string;
    description: string;
    date: string;
    time: string;
    prev_transaction?: number;
    next_transaction?: number;
    creditor_party: Party;
    debtor_party: Party;
    is_edit_enabled: boolean;
}

export const defaultDirectCurrencyTransferFormData : DirectCurrencyTransferTransaction = {
    transaction_type: "direct-currency-transfer",
    user_specified_id: "",
    description: "",
    date: defaultDate,
    time: defaultTime,
    is_edit_enabled: false,
    creditor_party: { ...defaultParty, type: "creditor", document_type: "main"},
    debtor_party: { ...defaultParty, document_type: "main"},
    prev_transaction: undefined,
    next_transaction: undefined,
}