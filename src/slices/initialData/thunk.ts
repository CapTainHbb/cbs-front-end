import {
    setAccountGroups, setCompanyImage,
    setCompanyProfile,
    setCurrencies, setCustomers,
    setFinancialAccounts, setInitialDataIsLoading,
    setLocalCurrency,
    setReferenceCurrencies,
    setReferenceCurrency,
    setUserProfileData, setUsers
} from "./reducer";
import axiosInstance from '../../helpers/axios_instance';
export const fetchInitialData = () => async (dispatch: any) => {
    const endpoints = [
        axiosInstance.get("/users/user-profile/"),
        axiosInstance.get('/currencies/'),
        axiosInstance.get('/currencies/reference-currency/'),
        axiosInstance.get('/currencies/reference-currencies/'),
        axiosInstance.get('/company/company-profile/'),
        axiosInstance.get('/accounts/account-groups/'),
        axiosInstance.get('/accounts/financial-accounts/'),
        axiosInstance.get('/currencies/local-currency/'),
        axiosInstance.get('/accounts/customers/'),
        axiosInstance.get('/users/'),
    ];

    const [
        userProfileData,
        currencies,
        referenceCurrency,
        referenceCurrencies,
        companyProfile,
        accountGroups,
        financialAccounts,
        localCurrency,
        customers,
        users,
    ] = await Promise.all(endpoints);
    dispatch(setUserProfileData(userProfileData.data));
    dispatch(setCurrencies(currencies.data));
    dispatch(setReferenceCurrency(referenceCurrency.data));
    dispatch(setReferenceCurrencies(referenceCurrencies.data));
    dispatch(setCompanyProfile(companyProfile.data));
    dispatch(setAccountGroups(accountGroups.data));
    dispatch(setFinancialAccounts(financialAccounts.data));
    dispatch(setLocalCurrency(localCurrency.data));
    // defaultLocalPayments.currency = localCurrency.data;
    // defaultCreateLocalPayments.currency = localCurrency.data;
    dispatch(setCustomers(customers.data));
    dispatch(setUsers(users.data.data));
    dispatch(setInitialDataIsLoading(false));

    // if(!process.env.REACT_APP_BACKEND_RESOURCE_API_URL) {
    //     return;
    // }

    // if(companyProfile?.data?.profile_photo) {
    //     downloadBlobImage(process.env.REACT_APP_BACKEND_RESOURCE_API_URL + companyProfile?.data?.profile_photo)
    //         .then((imageData: any) => {setCompanyImage(imageData)})
    //         .catch(error => console.error(error));
    // }
};