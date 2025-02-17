import React, {useMemo} from 'react';
import {useSelector} from "react-redux";
import Select from "react-select";
import {Currency} from "../utils";
import CurrencyOption from "./CurrencyOption";
import {t} from "i18next";


interface Props {
    currencyId: number | undefined,
    onCurrencyChange: any;
    className?: string;
    disabled?: boolean;
}

const SelectCurrency: React.FC<Props> = ({ currencyId, onCurrencyChange, className, disabled }) => {
    const currencies = useSelector((state: any) => state.InitialData.currencies)

    const options = useMemo(() => {
        let result = currencies?.map((item: Currency) => ({
            label: <CurrencyOption currency={item} />,
            value: item,
            searchText: `${item.name} ${item.alternative_name}` // Custom property for searching
        }))
        result?.push({ value: 'clear', label: '', searchText: t('Clear currency') })
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
            className={className}
            value={options?.find((option: any) => option?.value?.id === currencyId) || null}
            filterOption={filterOption}
            isDisabled={disabled}
            isClearable
        />
    );
};

export default SelectCurrency;