// src/billingFiltersSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BillingFiltersState {
    financial_account?: number;
    date_from?: string;
    date_to?: string;
    time_from?: string;
    time_to?: string;
    transaction_type?: string;
    description?: string;
    currency?: number;
    creditor_from_value?: number;
    creditor_to_value?: number;
    debtor_from_value?: number;
    debtor_to_value?: number;
    balance_from_value?: number;
    balance_to_value?: number;
    user_specified_id?: string;
    transaction_id_from?: string;
    transaction_id_to?: string;
}

const initialState: BillingFiltersState = {};

const billingFiltersSlice = createSlice({
    name: "BillingFilters",
    initialState,
    reducers: {
        setFilter: <K extends keyof BillingFiltersState>(
            state: BillingFiltersState,
            action: PayloadAction<{ key: K; value: BillingFiltersState[K] }>
        ) => {
            state[action.payload.key] = action.payload.value;
        },
        resetFilters: () => initialState,
    },
});

export const { setFilter, resetFilters } = billingFiltersSlice.actions;
export default billingFiltersSlice.reducer;
