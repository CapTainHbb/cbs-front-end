import React, {useMemo} from 'react';
import Select from "react-select";
import {useSelector} from "react-redux";
import {FinancialAccount} from "./types";

interface Props {
    onSelectFinancialAccount: any;
    selectedFinancialAccountId?: number;
}

const SelectFinancialAccount: React.FC<Props> = ({ onSelectFinancialAccount, selectedFinancialAccountId }) => {
    const financialAccounts = useSelector((state: any) => state.InitialData.financialAccounts);
    const options = useMemo(() => {
        return financialAccounts.map((item: FinancialAccount) => ({
            label: item?.full_name,
            value: item,
        }));
    }, [financialAccounts])

    return (
        <Select
            options={options}
            onChange={(item: any) => onSelectFinancialAccount(item?.value)}
            value={options?.find((option: any) => option?.value?.id === selectedFinancialAccountId)}
            isClearable
        />
    );
};

export default SelectFinancialAccount;