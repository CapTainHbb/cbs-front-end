import React from 'react';
import Billing from "../Billing/Billing";
import {t} from "i18next";

const AllTransactions = () => {
    return (
        <Billing
            loadItemsApi={'/transactions/'}
            hasFinancialAccountViewDetail={false}
            hasFinancialAccount={false}
            pageName={t("All Transactions")}
        />
    );
};

export default AllTransactions;