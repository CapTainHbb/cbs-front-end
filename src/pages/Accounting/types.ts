import firebase from "firebase/compat";
import {Currency} from "../Reports/utils";

export interface TransactionType {
    label: string;
    value: string;
}

export interface InterestCostProps {
    rate?: number;
    amount?: number;
    final_amount?: number;
}

export const defaultInterestCostProps : InterestCostProps =  {
    rate: 0,
    amount: 0,
    final_amount: 0,
}

export interface Party {
    id?: number;
    financial_account?: FinancialAccount;
    cost: InterestCostProps;
    interest: InterestCostProps;
    type: string;
    currency?: Currency;
    amount: number | undefined;
    date: string;
    time: string;
    transaction_type: string;
    transaction_brief: string;
    document_type?: string;
    counter_financial_account?: FinancialAccount;
    description: string;
    user_specified_id: string;
    balance?: number;
    transaction?: any;
    is_buy?: boolean;
    created_by?: string;
    created_at?: any;
}

export interface FinancialAccount {
    id?: number;
    name: string;
    code: string;
    parent_group: number;
    full_code?: string;
    full_name?: string;
    customer?: number;
    is_confidential: boolean;
}

export const defaultFinancialAccount : FinancialAccount = {
    id: undefined,
    name: "",
    code: "",
    parent_group: -1,
    customer: undefined,
    is_confidential: false,
}

export interface CurrencyAccount {
    financial_account: FinancialAccount;
    balance: number;
    currency: number;
}