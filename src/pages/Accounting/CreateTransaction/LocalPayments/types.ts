import {
    defaultInterestCostProps,
    defaultTransaction,
    InterestCostProps,
    Transaction
} from "../../types";

export interface LocalPaymentsFormDataType extends Transaction {
    debtor_financial_account?: number,
    debtor_interest: InterestCostProps,
    debtor_cost: InterestCostProps,
    creditor_financial_account?: number,
    creditor_interest: InterestCostProps,
    creditor_cost: InterestCostProps,
    total_amount: 0,
    is_edit_enabled: false,
    currency?: number,
    payments: any,
}

export const defaultLocalPaymentsFormData : LocalPaymentsFormDataType = {
    ...structuredClone(defaultTransaction),
    transaction_type: "direct-currency-transfer",
    debtor_financial_account: undefined,
    debtor_interest: defaultInterestCostProps,
    debtor_cost: defaultInterestCostProps,
    creditor_financial_account: undefined,
    creditor_interest: defaultInterestCostProps,
    creditor_cost: defaultInterestCostProps,
    total_amount: 0,
    is_edit_enabled: false,
    currency: undefined,
    payments: [],
}