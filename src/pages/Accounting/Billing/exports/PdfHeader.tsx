import React from 'react';
import {Image, Text, View} from "@react-pdf/renderer";
import {t} from "i18next";
import {usePDFStyles} from "../hooks/usePdfStyles";
import {getFormattedToday} from "../../../../helpers/date";
import {CompanyProfile} from "../../../CompanyProfile/types";



interface Props {
    companyImage?: Blob | null;
    companyProfile?: CompanyProfile;
    title: string;
    referenceNumber: string;
}

const PdfHeader: React.FC<Props> = ({ companyImage, companyProfile, title, referenceNumber }) => {
    const commonPDFStyles = usePDFStyles()

    return (
        <View style={commonPDFStyles.headerContainer}>
            <View style={commonPDFStyles.header}>
                <View style={commonPDFStyles.headerFirstLineContainer}>
                    <View style={commonPDFStyles.companyLogoContainer}>
                        {companyImage && (<Image style={commonPDFStyles.image} src={companyImage} />)}
                    </View>
                    <View style={commonPDFStyles.headerSideContent}>
                        <View style={[commonPDFStyles.labelValueContainer, commonPDFStyles.flexRow]}>
                            <View style={[commonPDFStyles.flexRow]}>
                                <Text>{t("Reference Number")}</Text>
                            </View>
                            <View style={commonPDFStyles.valueWhite}>
                                <Text>{referenceNumber}</Text>
                            </View>
                        </View>
                        <View style={[commonPDFStyles.labelValueContainer, commonPDFStyles.flexRow]}>
                            <View style={[commonPDFStyles.flexRow]}>
                                <Text>{t("Report Generation Date")}</Text>
                            </View>
                            <View style={commonPDFStyles.valueWhite}>
                                <Text>{getFormattedToday()}</Text>
                            </View>
                        </View>
                        <View style={[commonPDFStyles.labelValueContainer, commonPDFStyles.flexRow]}>
                            <View style={[commonPDFStyles.flexRow]}>
                                <Text>{t("Phone Number")}</Text>
                            </View>
                            <View style={commonPDFStyles.valueWhite}>
                                <Text>{companyProfile?.phone}</Text>
                            </View>
                        </View>
                        <View style={[commonPDFStyles.labelValueContainer, commonPDFStyles.flexRow]}>
                            <View style={[commonPDFStyles.flexRow]}>
                                <Text>{t("Fax")}</Text>
                            </View>
                            <View style={commonPDFStyles.valueWhite}>
                                <Text>{companyProfile?.fax}</Text>
                            </View>
                        </View>
                        <View style={[commonPDFStyles.labelValueContainer, commonPDFStyles.flexRow]}>
                            <View style={[commonPDFStyles.flexRow]}>
                                <Text>{t("Email")}</Text>
                            </View>
                            <View style={commonPDFStyles.valueWhite}>
                                <Text>{companyProfile?.email}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <Text style={commonPDFStyles.companyName}>{companyProfile?.name}</Text>
                <Text style={commonPDFStyles.headerLineText}>{title}</Text>
            </View>
            <View style={commonPDFStyles.horizontalLine}></View>
        </View>
    );
};

export default PdfHeader;