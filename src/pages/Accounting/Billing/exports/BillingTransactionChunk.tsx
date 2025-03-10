import React from 'react';
import {PartyForExport} from "../utils";
import {Text, View} from "@react-pdf/renderer";
import {t} from "i18next";
import {customFormatNumber} from "../../utils";
import {abs} from "mathjs";
import {usePDFStyles} from "../hooks/usePdfStyles";

interface Props {
    dataChunk: PartyForExport[];
}

const BillingTransactionChunk: React.FC<Props> = ({ dataChunk }) => {
    const commonPDFStyles = usePDFStyles()

    return (
        <View style={commonPDFStyles.tableBody}>
            {dataChunk?.map((party: PartyForExport, index: number) => (
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
    );
};

export default BillingTransactionChunk;