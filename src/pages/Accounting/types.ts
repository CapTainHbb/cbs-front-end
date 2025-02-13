import {Currency} from "../Reports/utils";

const now = new Date();
export const defaultDate = now.toISOString().split('T')[0];
export const defaultTime = now.toTimeString().split(' ')[0].slice(0, 5);

export interface TransactionType {
    id: number;
    name: string;
    englishName: string;
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
    financial_account: any;
    balance: number;
    initial_balance: number;
    currency: number;
}

export interface AccountGroup {
    id: number;
    name: string;
    code: string;
    type: string;
    full_code: string;
    parent_group: any;
    group_level: number;
    children: number[];
    financial_accounts: any[];
    full_name: string;
    currency_accounts?: any[];
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

export const defaultParty : Party = {
    financial_account: undefined,
    type: "debtor",
    amount: undefined,
    date: defaultDate,
    time: defaultTime,
    description: "",
    user_specified_id: "",
    document_type: "",
    transaction_type: "",
    transaction_brief: "",
    cost: {
        rate: 0,
        amount: 0,
        final_amount: 0,
    },
    interest: {
        rate: 0,
        amount: 0,
        final_amount: 0,
    },
    currency: undefined,
}

