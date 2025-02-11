import React, {useMemo} from 'react';
import {useSelector} from "react-redux";
import Select from "react-select";
import {Currency} from "../utils";
import CurrencyOption from "./CurrencyOption";
import {t} from "i18next";


interface Props {
    currency: Currency | undefined,
    onCurrencyChange: any;
}

const SelectCurrency: React.FC<Props> = ({ currency, onCurrencyChange }) => {
    const currencies = useSelector((state: any) => state.InitialData.currencies)

    const options = useMemo(() => {
        let result = currencies?.map((item: Currency) => ({
            label: <CurrencyOption currency={item} />,
            value: item,
            searchText: `${item.name} ${item.alternative_name}` // Custom property for searching
        }))
        result.push({ value: 'clear', label: '', searchText: t('Clear currency') })
        return result;
    }, [currencies])

    const filterOption = (option: any, inputValue: string) => {
        return option.data.searchText.toLowerCase().includes(inputValue.toLowerCase());
    };

    return (
        <Select
            options={options}
            onChange={(selectedOption: any) => {
                onCurrencyChange?.(selectedOption?.value)
            }}
            value={options?.find((option: any) => option?.value?.id === currency?.id)}
            filterOption={filterOption}
            isClearable
        />
    );
};

export default SelectCurrency;