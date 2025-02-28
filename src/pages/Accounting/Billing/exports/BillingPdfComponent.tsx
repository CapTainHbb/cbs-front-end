import React, {useMemo} from 'react';
import {Document, Page, Text, View} from '@react-pdf/renderer';

import  {t} from "i18next";
import {columnsForExport, getRowsForExport, PartyForExport} from "../utils";
import {FinancialAccount, Party} from "../../types";
import {usePDFStyles} from "../hooks/usePdfStyles";
import {CompanyProfile} from "../../../CompanyProfile/types";
import {Currency} from "../../../Reports/utils";
import {abs} from "mathjs";
import PdfHeader from "./PdfHeader";
import { customFormatNumber } from 'pages/Accounting/utils';


interface Props {
    tableData: Party[];
    filters?: any;
    accountSummaryRows?: any;
    accountSummaryColumns?: any;
    companyImage?: any;
    companyProfile?: CompanyProfile;
    selectedFinancialAccount: FinancialAccount | null;
    currencies: any;
    referenceNumber: string;
}

const BillingPDFComponent: React.FC<Props> = ({ tableData,
                                                  filters, currencies, companyProfile, companyImage, selectedFinancialAccount,
                                                  accountSummaryColumns, accountSummaryRows, referenceNumber}) => {
    const commonPDFStyles = usePDFStyles()
    const transactionRowsForPDF = useMemo(() => {
        return getRowsForExport(tableData, currencies);
    }, [tableData, currencies]);

    return (
        <Document>
            {/* First Page */}
            <Page style={commonPDFStyles.page}>
                <PdfHeader referenceNumber={referenceNumber} companyProfile={companyProfile} companyImage={companyImage}  title={t("Customer Statement")} />
                <View style={commonPDFStyles.headerLine}>
                    <View style={commonPDFStyles.headerSideContent}>
                        <View style={[commonPDFStyles.labelValueContainer, commonPDFStyles.flexRow]}>
                            <View style={[commonPDFStyles.flexRow]}>
                                <Text>{t("Account Name")}</Text>
                            </View>
                            <View style={commonPDFStyles.value}>
                                <Text>{selectedFinancialAccount?.name}</Text>
                            </View>
                        </View>
                        <View style={[commonPDFStyles.labelValueContainer, commonPDFStyles.flexRow]}>
                            <View style={[commonPDFStyles.flexRow]}>
                                <Text>{t("Account Number")}</Text>
                            </View>
                            <View style={commonPDFStyles.value}>
                                <Text>{selectedFinancialAccount?.full_code}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={commonPDFStyles.headerSideContent}>
                        <View style={[commonPDFStyles.labelValueContainer, commonPDFStyles.flexRow]}>
                            <View style={[commonPDFStyles.flexRow]}>
                                <Text>{t("Currency Type")}</Text>
                            </View>
                            <View style={commonPDFStyles.value}>
                                <Text>{filters?.currency?
                                    currencies.find((cur: Currency) => cur.id === filters?.currency)?.name:
                                    t("All Currencies")}
                                </Text>
                            </View>
                        </View>
                        <View style={[commonPDFStyles.labelValueContainer, commonPDFStyles.flexRow]}>
                            <View style={[commonPDFStyles.flexRow]}>
                                <Text>{t("Transaction Type")}</Text>
                            </View>
                            <View style={commonPDFStyles.value}>
                                <Text>{filters?.transaction_type? t(filters.transaction_type): t("All Transaction Types")}</Text>
                            </View>
                        </View>
                        <View style={[commonPDFStyles.labelValueContainer, commonPDFStyles.flexRow]}>
                            <View style={[commonPDFStyles.flexRow]}>
                                <Text>{t("Date Range")}</Text>
                            </View>
                            <View style={[commonPDFStyles.value, commonPDFStyles.flexRow]}>
                                <Text>{filters?.date_from?
                                    filters.date_from: t("-")}
                                </Text>
                                <Text>
                                    {" " + t("To") + " "}
                                </Text>
                                <Text>
                                    {filters?.date_to? filters.date_to: t("-")}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Table Header */}
                <View style={commonPDFStyles.tableHeader}>
                    {columnsForExport.map((column, index) => (
                        <Text
                            key={index}
                            style={[
                                commonPDFStyles.tableHeaderCell,
                                (index === 1 || index === 4 || index === 2 || index === 3) ? commonPDFStyles.smallerColumn : commonPDFStyles.regularColumn
                            ]}
                        >
                            {column}
                        </Text>
                    ))}
                </View>

                {/* Table Body */}
                <View style={commonPDFStyles.tableBody}>
                    {transactionRowsForPDF?.map((party: PartyForExport, index: number) => (
                        <View key={index} style={commonPDFStyles.tableRow}>
                            <Text
                                style={[commonPDFStyles.tableBodyCell, commonPDFStyles.regularColumn]}>{t(party.transaction_type)}</Text>
                            <Text style={[commonPDFStyles.tableBodyCell, commonPDFStyles.smallerColumn]}>{party.transaction}</Text>
                            <Text style={[commonPDFStyles.tableBodyCell, commonPDFStyles.smallerColumn]}>{party.date}</Text>
                            <Text style={[commonPDFStyles.tableBodyCell, commonPDFStyles.smallerColumn]}>{party.time}</Text>
                            <Text style={[commonPDFStyles.tableBodyCell, commonPDFStyles.smallerColumn]}>
                                {party.currency}
                            </Text>
                            <Text
                                style={[
                                    commonPDFStyles.tableBodyCell,
                                    commonPDFStyles.regularColumn,
                                    Number(party.debtor_amount) > 0 ? commonPDFStyles.debtorColumn : commonPDFStyles.zeroValue,
                                ]}
                            >
                                {customFormatNumber(party.debtor_amount)}
                            </Text>
                            <Text
                                style={[
                                    commonPDFStyles.tableBodyCell,
                                    commonPDFStyles.regularColumn,
                                    Number(party.creditor_amount) > 0 ? commonPDFStyles.creditorColumn : commonPDFStyles.zeroValue,
                                ]}
                            >
                                {customFormatNumber(party.creditor_amount)}
                            </Text>
                            <Text
                                style={[
                                    commonPDFStyles.tableBodyCell,
                                    commonPDFStyles.regularColumn,
                                    Number(party.balance) > 0
                                        ? commonPDFStyles.creditorColumn
                                        : party.balance === 0
                                            ? commonPDFStyles.zeroValue
                                            : commonPDFStyles.debtorColumn,
                                ]}
                            >
                                {customFormatNumber(abs(Number(party.balance)))}
                            </Text>
                        </View>
                    ))}
                </View>

                <Text
                    style={commonPDFStyles.footer}
                    render={({pageNumber, totalPages}) => `${t("Page")} ${pageNumber} ${t("Of")} ${totalPages}`}
                />
            </Page>

            {/* Second Page for the Account Summary */}
            <Page style={commonPDFStyles.page}>
                <Text style={commonPDFStyles.headerLineText}>{t("Account Summary")}</Text>
                <View style={commonPDFStyles.tableHeader}>
                    {accountSummaryColumns.map((column: string, index: number) => (
                        <Text
                            key={index}
                            style={[
                                commonPDFStyles.tableHeaderCell,
                                commonPDFStyles.fullWidth
                            ]}
                        >
                            {column}
                        </Text>
                    ))}
                </View>
                <View style={commonPDFStyles.tableBody}>
                    {accountSummaryRows}
                </View>

                <Text
                    style={commonPDFStyles.footer}
                    render={({pageNumber, totalPages}) => `${t("Page")} ${pageNumber} ${t("Of")} ${totalPages}`}
                />
            </Page>
        </Document>
    );
}

export default  BillingPDFComponent;