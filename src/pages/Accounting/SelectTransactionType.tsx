import React, {useMemo} from 'react';
import Select from 'react-select';
import {t} from "i18next";

interface Props {
    transactionType?: string;
    onTransactionTypeChange: any;
}

const SelectTransactionType: React.FC<Props> = ({ transactionType, onTransactionTypeChange }) => {

    const options: any[] = useMemo(() => {
        return [
            {
                label: t("Direct Currency Transfer"),
                value: "direct-currency-transfer",
            },
            {
                label: t("Buy and Sell Cash"),
                value: "buy-and-sell-cash",
            },
            {
                label: t("Local Payments"),
                value: "local-payments",
            }
        ]
    }, [])

    return (
        <Select
            options={options}
            onChange={(item: any) => onTransactionTypeChange(item?.value)}
            value={options?.find((item: any) => item?.value === transactionType)}
            isClearable
        />
    );
};

export default SelectTransactionType;