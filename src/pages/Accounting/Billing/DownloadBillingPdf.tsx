import {pdf, Text, View} from "@react-pdf/renderer";
import {t} from "i18next";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {abs} from "mathjs";
import {FinancialAccount} from "../types";
import {useSelector} from "react-redux";
import {usePDFStyles} from "./hooks/usePdfStyles";
import {Currency, formatNumber} from "../../Reports/utils";
import BillingPdfComponent from "./BillingPdfComponent";
import axiosInstance from "../../../helpers/axios_instance";
import {createTempoDownloadLink, groupByCurrency} from "./utils";
import ExportPdfButton from "./ExportPdfButton";
import {useBillingFilters} from "./hooks/useBillingFilters";


interface Props {
    table: any;
}

const DownloadBillingPDF: React.FC<Props> = ({ table }) => {
    const { currencies, companyProfile, financialAccounts } = useSelector((state: any) => state.InitialData);
    const [selectedFinancialAccount, setSelectedFinancialAccount] = useState<FinancialAccount | null>(null)
    const commonPDFStyles = usePDFStyles()

    const {filters} = useBillingFilters();

    useEffect(() => {
        setSelectedFinancialAccount(
            financialAccounts?.find((item: FinancialAccount) => item.id === filters?.financial_account)
        )
    }, [filters?.financial_account])

    const tableData = useMemo(() => {
        return table?.getRowModel().rows.map((row: any) => row.original)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [table?.getRowModel().rows]);

    const renderAccountSummaryTableBody = useCallback(async () => {
        const accountSummary = await groupByCurrency(tableData);

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
                    {formatNumber(abs(row?.previous_balance))}
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
                    {formatNumber(row?.total_debtor)}
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
                    {formatNumber(row?.total_creditor)}
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
                    {formatNumber(abs(row?.balance))}
                </Text>
            </View>
        ));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableData]);

    const [isGenerating, setIsGenerating] = useState(false);

    const generateAndDownloadPDF = async () => {
        // Add a loading cursor to the body
        document.body.style.cursor = 'progress';
        setIsGenerating(true);
        const generate = async () => {
            try {
                const accountSummaryRows = await renderAccountSummaryTableBody();
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
                    tableData={table?.getRowModel().rows.map((row: any) => row.original)}
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


                createTempoDownloadLink(blob,selectedFinancialAccount ? `${selectedFinancialAccount.full_name}.pdf` : 'all-transactions.pdf' )

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
        <ExportPdfButton isGenerating={isGenerating}
                         disabled={isGenerating || !selectedFinancialAccount}
                         onClick={generateAndDownloadPDF} />
    );
};

export default DownloadBillingPDF;
