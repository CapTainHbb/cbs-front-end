import React, {useCallback, useMemo, useState} from 'react';
import {generateXlsx} from "../utils";
import {t} from "i18next";
import ExportButton from "./ExportButton";
import {useBillingFilters} from "../hooks/useBillingFilters";
import axiosInstance from "../../../../helpers/axios_instance";
import {useSelector} from "react-redux";
import {FinancialAccount} from "../../types";

const DownloadBillingXlsx = () => {
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const {filters} = useBillingFilters();
    const {financialAccounts, currencies} = useSelector((state: any) => state.InitialData);

    const selectedFinancialAccount = useMemo(() => {
        return financialAccounts?.find((acc: FinancialAccount) => acc.id === filters?.financial_account);
    }, [filters?.financial_account]);

    const handleClickExportXlsx = useCallback( () => {
        setIsGenerating(true);
        axiosInstance.post('/transactions/', {
            filters: filters,
            make_paginated: false,
            pagination: {}
        })
        .then(response => {
            generateXlsx(response.data, selectedFinancialAccount, currencies);
        }).catch(error => console.error(error)).finally(() => setIsGenerating(false));

    }, [setIsGenerating, filters, selectedFinancialAccount, currencies]);

    return (
        <ExportButton isGenerating={isGenerating}
                      onClick={handleClickExportXlsx}
                      disabled={isGenerating || !filters?.financial_account}
                      text={t("Export to Xlsx")} />
    );
};

export default DownloadBillingXlsx;