import React, {useMemo} from 'react';
import Select from 'react-select';
import {TransactionType} from "./types";

interface Props {
    transactionType?: string;
    onTransactionTypeChange: any;
}

const SelectTransactionType: React.FC<Props> = ({ transactionType, onTransactionTypeChange }) => {

    const options: TransactionType[] = useMemo(() => {
        return [
            {
                label: "DirectCurrencyTransfer",
                value: "direct-currency-transfer",
            },
            {
                label: "BuyAndSellCash",
                value: "buy-and-sell-cash",
            },
            {
                label: "LocalPayments",
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