import {Font,  StyleSheet, } from "@react-pdf/renderer";
import {useTranslation} from "react-i18next";
import {useMemo} from "react";

Font.register({
    family: 'Shabnam',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/shabnam-font/5.0.1/Shabnam.ttf', // URL or local path
});

export const usePDFStyles = () => {
    const { i18n } = useTranslation();
    const isRtl = i18n.language;

    return useMemo(() => {
        return StyleSheet.create({
            page: {
                backgroundColor: '#ffffff',
                fontFamily: 'Shabnam',
                flexDirection: 'column',
            },
            headerContainer: {
                fontSize: 15,
                textAlign: 'center',
                alignContent: 'center',
                flexDirection: 'column',
                width: '100%',
                height: '200',
                backgroundColor: '#f3f3f3',
            },
            header: {
                flex: 1,
                flexDirection: 'column',
                paddingHorizontal: 20,
                paddingTop: 20,
                justifyContent: 'space-between',
            },
            headerFirstLineContainer: {
                flexDirection: isRtl? 'row-reverse':'row',
                justifyContent: 'space-between',
                fontSize: 8,
            },
            headerLineText: {
                marginTop: 10,
                marginBottom: 5,
                color: 'black',
                fontWeight: 'extrabold',
                fontSize: 18,
                alignSelf: 'center',
            },
            headerLine: {
                flexDirection: isRtl? 'row-reverse': 'row',
                justifyContent: 'space-between',
                height: '50',
            },
            headerSideContent: {
                width: 200,
                flexDirection: 'column',
                fontSize: 8,
            },
            companyLogoContainer: {
                width: '80px',
                height: '80px',
            },
            image: {
                width: 'auto',
                height: 'auto',
                maxWidth: '100%',  // Ensures it scales down within the parent container
                maxHeight: '100%', // Maintains aspect ratio within the parent container
                alignSelf: 'center',
                objectFit: 'contain', // Ensures the image fits within its container without being cropped
            },
            companyName: {
                color: '#405189',
                fontSize: 14,
                alignSelf: 'center',
            },
            verticalLine: {
                width: 1,               // Line width
                height: '80%',          // Line height
                backgroundColor: '#405189', // Line color
                marginHorizontal: 10,   // Space around the line
            },
            horizontalLine: {
                height: 10,
                width: '100%',
                backgroundColor: '#405189',
                paddingVertical: 1,
                marginVertical: 2,
            },

            tableHeader: {
                flexDirection: isRtl? 'row-reverse': 'row',
                alignItems: 'center',
                color: 'black',
                backgroundColor: 'white',
                fontSize: 10,
                borderRadius: 2,
            },
            tableBody: {
                marginTop: 1,
                fontSize: 8,
            },
            tableRow: {
                flexDirection: isRtl? 'row-reverse': 'row',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: '#ddd',
                borderLeftWidth: 1, // Separate the first column with left border
                borderLeftColor: '#ddd', // Same color for a unified table look
            },
            tableHeaderCell: {
                flexDirection: isRtl ? 'row-reverse' : 'row',
                textAlign: 'center',
                paddingVertical: 1,
                backgroundColor: '#F3F3F3',
                border: '2px solid #d4d3d3',  // Corrected border property
            },
            tableBodyCell: {
                flexDirection: isRtl? 'row-reverse': 'row',
                alignItems: 'center',
                paddingVertical: 2,
                paddingHorizontal: 5,  // Adjust padding for consistency
                borderRightWidth: 1,  // Border on the right side for separation
                borderRightColor: '#ddd',  // Same as header border to make it cohesive
                textAlign: 'center',
            },
            flagImg: {
                width: 20,
                height: 20,
            },
            smallerColumn: {
                width: '55', // adjust the width as needed
            },
            regularColumn: {
                width: '95', // regular width for other columns
            },
            fullWidth: {
                width: '100%',
            },
            halfWidth: {
                width: '50%',
            },
            widthLarge: {
                width: 250,
            },
            debtorColumn: {
                color: '#c60000',
            },
            creditorColumn: {
                color: '#006800',
            },
            zeroValue: {
                color: 'black'
            },
            footer: {
                position: 'absolute',
                bottom: 10,
                left: 0,
                right: 0,
                fontSize: 10,
                textAlign: 'center',
                color: '#888',
            },
            labelValueContainer: {
                justifyContent: 'space-evenly',
                padding: 1,
                width: 200
            },
            labelValueContainerLong: {
                justifyContent: 'space-evenly',
                padding: 1,
                width: 400,
            },
            value: {
                backgroundColor: "#F3F3F3",
                minWidth: 100,
                textAlign: 'center',
                display: 'flex', // Enable flexbox
                alignItems: 'center', // Center items vertically
                justifyContent: 'center', // Center items horizontally
                flexDirection: 'row',
            },
            valueWhite: {
                minWidth: 100,
                textAlign: 'center',
                display: 'flex', // Enable flexbox
                alignItems: 'center', // Center items vertically
                justifyContent: 'center', // Center items horizontally
                flexDirection: 'row',
                backgroundColor: "#FFFFFF", // Override backgroundColor
                borderRadius: 2,
            },
            textGray: {
                color: "#787f89",
            },
            textSmall: {
                fontSize: 10,
            },
            flexRow: {
                flex: 1,
                flexDirection: isRtl? 'row-reverse': 'row',
            },
            transactionBody: {
                flex: 1,
                flexDirection: 'column',
                alignItems: isRtl? 'flex-end': 'flex-start',
                paddingHorizontal: 32,
                paddingVertical: 16,
            },
            transactionInfoItemContainer: {
                flexDirection: 'column',
                alignItems: isRtl? 'flex-end': 'flex-start',
                padding: 4,
                width: 400,
                height: 80,
            },
            transactionInfoItemLabel: {
                color: "black",
                fontSize: 14,
                fontWeight: 'extrabold',
                paddingBottom: 8,
            },
            mt40: {
                marginTop: 40,
            },
            mt60: {
                marginTop: 60,
            },
            horizontalItemSeparator: {
                height: 6,
                width: 400,
                backgroundColor: "#F3F3F3",
            },
            totalAmount: {
                color: "#405189"
            }
        });
    }, [isRtl]);
}


