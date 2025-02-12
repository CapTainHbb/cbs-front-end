import React, {useMemo} from 'react';
import {useSelector} from "react-redux";
import Select from "react-select";
import {AccountGroup} from "../Accounting/types";

interface Props {
    accountGroupId: number | undefined,
    onChangeAccountGroup: any;
}


const SelectAccountGroup: React.FC<Props> = ({ accountGroupId, onChangeAccountGroup  }) => {
    const accountGroups = useSelector((state: any) => state.InitialData.accountGroups)
    const options = useMemo(() => {
        return accountGroups?.map((item: AccountGroup) => ({
            label: item.full_name,
            value: item,
        }))
    }, [accountGroups])

    return (
        <Select
            options={options}
            onChange={(selectedOption: any) => {
                onChangeAccountGroup?.(selectedOption?.value)
            }}
            value={options?.find((option: any) => option?.value?.id === accountGroupId)}
            isClearable
        />
    );
};

export default SelectAccountGroup;