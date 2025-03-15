import React, { useMemo } from 'react';
import {Document, Page, View, Text} from '@react-pdf/renderer';

import {t} from "i18next";
import {CompanyProfile} from "../../../CompanyProfile/types";
import {usePDFStyles} from "../../Billing/hooks/usePdfStyles";
import {Currency, formatNumber} from "../../../Reports/utils";
import PdfHeader from "../../Billing/exports/PdfHeader";
import {FinancialAccount} from "../../types";
import {getFinancialAccountById} from "../../../../helpers/financial_account";
import {getCurrencyById} from "../../../../helpers/currency";

interface Props {
    transaction: any;
    companyProfile?: CompanyProfile;
    companyImage?: Blob | null;
    referenceNumber: string;
    financialAccounts: FinancialAccount[];
    currencies: Currency[];
}

const DirectCurrencyTransferPDFComponent: React.FC<Props> = ({ transaction,
                                                                 companyProfile,
                                                                 companyImage, 
                                                                 referenceNumber,
                                                                 financialAccounts,
                                                             currencies}) => {
    const creditorFinancialAccount = useMemo(() => {
        return getFinancialAccountById(financialAccounts, transaction.creditorFinancialAccount);
    }, [financialAccounts, transaction.creditorFinancialAccount])


    const debtorFinancialAccount = useMemo(() => {
        return getFinancialAccountById(financialAccounts, transaction.debtorFinancialAccount);
    }, [financialAccounts, transaction.debtorFinancialAccount])
    
    const commonPDFStyles = usePDFStyles()
    return (
        <Document>
            <Page style={commonPDFStyles.page}>
                <PdfHeader referenceNumber={referenceNumber} title={t("Direct Currency Transfer Receipt")}
                           companyImage={companyImage} companyProfile={companyProfile} />
                <View style={commonPDFStyles.transactionBody}>
                    <View style={commonPDFStyles.horizontalItemSeparator}></View>
                    <View style={commonPDFStyles.transactionInfoItemContainer}>
                        <Text style={commonPDFStyles.transactionInfoItemLabel}>{t("Creditor")}</Text>
                        <View style={[commonPDFStyles.labelValueContainerLong, commonPDFStyles.flexRow]}>
                            <View style={[commonPDFStyles.flexRow, commonPDFStyles.textSmall]}>
                                <Text>{t("Account Name")}</Text>
                            </View>
                            <View style={[commonPDFStyles.textGray, commonPDFStyles.textSmall]}>
                                <Text>{creditorFinancialAccount?.name}</Text>
                            </View>
                        </View>
                        <View style={[commonPDFStyles.labelValueContainerLong, commonPDFStyles.flexRow]}>
                            <View style={[commonPDFStyles.flexRow, commonPDFStyles.textSmall]}>
                                <Text>{t("Account Number")}</Text>
                            </View>
                            <View style={[commonPDFStyles.textGray, commonPDFStyles.textSmall]}>
                                <Text>{creditorFinancialAccount?.full_code}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={commonPDFStyles.horizontalItemSeparator}></View>
                    <View style={commonPDFStyles.transactionInfoItemContainer}>
                        <Text style={commonPDFStyles.transactionInfoItemLabel}>{t("Debtor")}</Text>
                        <View style={[commonPDFStyles.labelValueContainerLong, commonPDFStyles.flexRow]}>
                            <View style={[commonPDFStyles.flexRow, commonPDFStyles.textSmall]}>
                                <Text>{t("Account Name")}</Text>
                            </View>
                            <View style={[commonPDFStyles.textGray, commonPDFStyles.textSmall]}>
                                <Text>{debtorFinancialAccount?.name}</Text>
                            </View>
                        </View>
                        <View style={[commonPDFStyles.labelValueContainerLong, commonPDFStyles.flexRow]}>
                            <View style={[commonPDFStyles.flexRow, commonPDFStyles.textSmall]}>
                                <Text>{t("Account Number")}</Text>
                            </View>
                            <View style={[commonPDFStyles.textGray, commonPDFStyles.textSmall]}>
                                <Text>{debtorFinancialAccount?.full_code}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={[commonPDFStyles.transactionInfoItemLabel, commonPDFStyles.mt40]}>
                        {t("Transaction Info")}
                    </Text>
                    <View style={commonPDFStyles.tableHeader}>
                        <Text style={[commonPDFStyles.tableHeaderCell, commonPDFStyles.regularColumn, commonPDFStyles.widthLarge]}>
                            {t("Description")}
                        </Text>
                        <Text style={[commonPDFStyles.tableHeaderCell, commonPDFStyles.regularColumn]}>
                            {t("Amount")}
                        </Text>
                        <Text style={[commonPDFStyles.tableHeaderCell, commonPDFStyles.regularColumn]}>
                            {t("Currency Type")}
                        </Text>
                    </View>
                    <View style={commonPDFStyles.tableBody}>
                        <View style={commonPDFStyles.tableRow}>
                            <Text style={[commonPDFStyles.tableBodyCell, commonPDFStyles.regularColumn, commonPDFStyles.widthLarge]}>
                                {transaction.description}
                            </Text>
                            <Text style={[commonPDFStyles.tableBodyCell, commonPDFStyles.regularColumn]}>
                                {formatNumber(transaction.amount)}
                            </Text>
                            <Text style={[commonPDFStyles.tableBodyCell, commonPDFStyles.regularColumn]}>
                                {getCurrencyById(currencies, transaction.currency)?.name}
                            </Text>
                        </View>
                    </View>
                    <View>
                        <View style={[commonPDFStyles.horizontalItemSeparator, commonPDFStyles.mt60]}></View>
                        <View>
                            <Text style={[commonPDFStyles.textGray, commonPDFStyles.textSmall]}>
                                {t("Receipt Creator Signature")}
                            </Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default DirectCurrencyTransferPDFComponent;