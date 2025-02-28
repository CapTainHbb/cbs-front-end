import {pdf, Text, View} from "@react-pdf/renderer";
import {t} from "i18next";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {abs} from "mathjs";
import {FinancialAccount} from "../../types";
import {useSelector} from "react-redux";
import {usePDFStyles} from "../hooks/usePdfStyles";
import {Currency, formatNumber} from "../../../Reports/utils";
import axiosInstance from "../../../../helpers/axios_instance";
import {createTempoDownloadLink, groupByCurrency} from "../utils";
import ExportButton from "./ExportButton";
import {useBillingFilters} from "../hooks/useBillingFilters";
import BillingPdfComponent from "./BillingPdfComponent";
import { customFormatNumber } from "pages/Accounting/utils";


const DownloadBillingPDF = () => {
    const { currencies, companyProfile, financialAccounts } = useSelector((state: any) => state.InitialData);
    const commonPDFStyles = usePDFStyles()

    const {filters} = useBillingFilters();

    const selectedFinancialAccount: FinancialAccount = useMemo(() => {
        return financialAccounts?.find(((acc: FinancialAccount) => acc.id === filters?.financial_account));
    }, [filters?.financial_account])

    const renderAccountSummaryTableBody = useCallback(async (data: any) => {
        const accountSummary = await groupByCurrency(data);

        return accountSummary.map((row: any, index: number) => (
            <View key={index} style={[commonPDFStyles.tableRow]}>
                <Text key={0} style={[commonPDFStyles.tableBodyCell, commonPDFStyles.fullWidth]}>
                    {currencies.find((cur: Currency) => cur.id === Number(row?.currency))?.name}
                </Text>
                <Text
                    key={1}
                    style={[
                        commonPDFStyles.tableBodyCell,
                        commonPDFStyles.fullWidth,
                        Number(row?.previous_balance) > 0
                            ? commonPDFStyles.creditorColumn
                            : row?.previous_balance === 0
                                ? commonPDFStyles.zeroValue
                                : commonPDFStyles.debtorColumn,
                    ]}
                >
                    {customFormatNumber(abs(row?.previous_balance))}
                </Text>
                <Text
                    key={2}
                    style={[
                        commonPDFStyles.tableBodyCell,
                        commonPDFStyles.fullWidth,
                        Number(row?.total_debtor) > 0
                            ? commonPDFStyles.debtorColumn
                            : commonPDFStyles.zeroValue,
                    ]}
                >
                    {customFormatNumber(row?.total_debtor)}
                </Text>
                <Text
                    key={3}
                    style={[
                        commonPDFStyles.tableBodyCell,
                        commonPDFStyles.fullWidth,
                        Number(row?.total_creditor) > 0
                            ? commonPDFStyles.creditorColumn
                            : commonPDFStyles.zeroValue,
                    ]}
                >
                    {customFormatNumber(row?.total_creditor)}
                </Text>
                <Text
                    key={4}
                    style={[
                        commonPDFStyles.tableBodyCell,
                        commonPDFStyles.fullWidth,
                        Number(row?.balance) > 0
                            ? commonPDFStyles.creditorColumn
                            : row?.balance === 0
                                ? commonPDFStyles.zeroValue
                                : commonPDFStyles.debtorColumn,
                    ]}
                >
                    {customFormatNumber(abs(row?.balance))}
                </Text>
            </View>
        ));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [isGenerating, setIsGenerating] = useState(false);

    const generateAndDownloadPDF = async () => {
        // Add a loading cursor to the body
        document.body.style.cursor = 'progress';
        setIsGenerating(true);
        const generate = async () => {
            try {
                const response = await axiosInstance.post('/transactions/', {
                    filters: filters,
                    make_paginated: false,
                    pagination: {}
                })
                const accountSummaryRows = await renderAccountSummaryTableBody(response.data);

                let referenceNumber: string = "0";
                try {
                    const response = await axiosInstance.get('/core/reference-number/')
                    referenceNumber = response.data
                } catch (error) {
                    console.error(error)
                }
                // Generate the PDF as a blob
                const blob = await pdf(<BillingPdfComponent
                    referenceNumber={referenceNumber}
                    filters={filters}
                    tableData={response.data}
                    selectedFinancialAccount={selectedFinancialAccount}
                    currencies={currencies}
                    companyProfile={companyProfile}
                    accountSummaryColumns={[
                        t("Currency Type"),
                        t("Previous Balance"),
                        t("Debtor"),
                        t("Creditor"),
                        t("Balance")
                    ]}
                    accountSummaryRows={accountSummaryRows}
                />).toBlob();


                createTempoDownloadLink(blob,selectedFinancialAccount ? `${selectedFinancialAccount?.name}.pdf` : 'all-transactions.pdf' )

            } catch (error) {
                console.error('Error generating PDF:', error);
            } finally {
                // Revert the cursor back to default
                document.body.style.cursor = 'default';
                setIsGenerating(false);
            }
        }
        generate();
    };

    return (
        <ExportButton isGenerating={isGenerating}
                      disabled={isGenerating || !selectedFinancialAccount}
                      onClick={generateAndDownloadPDF}
                      text={t("Print Billing")}
        />
    );
};

export default DownloadBillingPDF;
