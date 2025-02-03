import {createSlice} from "@reduxjs/toolkit";
import {boolean} from "yup";

export interface UserProfileData {
    id: number;
    user: {
        id: number;
        last_login: string;
        is_superuser: boolean;
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        is_staff: boolean;
        is_active: boolean;
        date_joined: string;
        groups: [];
        user_permissions: [];
    }
    profile_photo: string | undefined;
    role: string;
}

export const defaultUserProfileData: UserProfileData = {
    id: -1,
    user: {
        id: -1,
        last_login: "",
        is_superuser: false,
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        is_staff: false,
        is_active: false,
        date_joined: "",
        groups: [],
        user_permissions: [],
    },
    profile_photo: undefined,
    role: "",
}

export const initialState = {
    userProfileData: defaultUserProfileData,
    currencies: [],
    referenceCurrencies: [],
    referenceCurrency: undefined,
    dateType: undefined,
    companyProfile: undefined,
    accountGroups: [],
    financialAccounts: [],
    localCurrency: undefined,
    customers: [],
    users: [],
    companyImage: undefined,
    initialDataIsLoading: true,
}

const InitialDataSlice = createSlice({
    name: 'InitialData',
    initialState,
    reducers: {
        setUserProfileData(state, action) {
            state.userProfileData = action.payload;
        },
        setCurrencies(state, action) {
            state.currencies = action.payload;
        },
        setReferenceCurrencies(state, action) {
            state.referenceCurrencies = action.payload;
        },
        setReferenceCurrency(state, action) {
            state.referenceCurrency = action.payload;
        },
        setDateType(state, action) {
            state.dateType = action.payload;
        },
        setCompanyProfile(state, action) {
            state.companyProfile = action.payload;
        },
        setAccountGroups(state, action) {
            state.accountGroups = action.payload;
        },
        setFinancialAccounts(state, action) {
            state.financialAccounts = action.payload;
        },
        setLocalCurrency(state, action) {
            state.localCurrency = action.payload;
        },
        setCustomers(state, action) {
            state.customers = action.payload;
        },
        setUsers(state, action) {
            state.users = action.payload;
        },
        setCompanyImage(state, action) {
            state.companyImage = action.payload;
        },
        setInitialDataIsLoading(state, action) {
            state.initialDataIsLoading = action.payload;
        }
    }
});

export const {setUserProfileData, setCurrencies,
    setReferenceCurrencies, setReferenceCurrency,
    setDateType, setCompanyProfile, setAccountGroups,
    setFinancialAccounts, setLocalCurrency,
    setCustomers, setUsers,
    setCompanyImage, setInitialDataIsLoading}
    = InitialDataSlice.actions;
export default InitialDataSlice.reducer;