import {
    setAccountGroups,
    setCompanyProfile,
    setCurrencies,
    setFinancialAccounts, setInitialDataIsLoading,
    setLocalCurrency,
    setReferenceCurrencies,
    setReferenceCurrency,
    setUserProfileData, setUsers
} from "./reducer";
import axiosInstance from '../../helpers/axios_instance';
import {hasUserThisPermission} from "../../helpers/casl_utils";
export const fetchInitialData = () => async (dispatch: any) => {
    const userProfileData = (await axiosInstance.get("/users/user-profile/"))?.data;
    dispatch(setUserProfileData(userProfileData));

    if(hasUserThisPermission(userProfileData, "view_currencieslist")){
        const currencies = await axiosInstance.get('/currencies/')
        dispatch(setCurrencies(currencies.data.data));
    }

    if(hasUserThisPermission(userProfileData, "view_referencecurrency")){
        const referenceCurrency = await axiosInstance.get('/currencies/reference-currency/')
        dispatch(setReferenceCurrency(referenceCurrency.data));
    }

    if(hasUserThisPermission(userProfileData, "view_referencecurrencies")){
        const referenceCurrencies = await axiosInstance.get('/currencies/reference-currencies/')
        dispatch(setReferenceCurrencies(referenceCurrencies.data));
    }

    if(hasUserThisPermission(userProfileData, "view_companyprofile")){
        const companyProfile = await axiosInstance.get('/company/company-profile/')
        dispatch(setCompanyProfile(companyProfile.data));
    }

    if(hasUserThisPermission(userProfileData, "view_accountgroupslist")){
        const accountGroups = await axiosInstance.get('/accounts/account-groups/')
        dispatch(setAccountGroups(accountGroups.data));
    }

    if(hasUserThisPermission(userProfileData, "view_financialaccountslist")){
        const financialAccounts = await axiosInstance.get('/accounts/financial-accounts/')
        dispatch(setFinancialAccounts(financialAccounts.data));
    }

    if(hasUserThisPermission(userProfileData, "view_localcurrency")){
        const localCurrency = await axiosInstance.get('/currencies/local-currency/')
        dispatch(setLocalCurrency(localCurrency.data));
    }

    if(hasUserThisPermission(userProfileData, "view_userslist")){
        const users = await axiosInstance.get('/users/')
        dispatch(setUsers(users.data.data));
    }

    dispatch(setInitialDataIsLoading(false));
};