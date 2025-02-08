import React, { useMemo } from 'react'
import Select from "react-select";
import {t} from "i18next";

export interface PartyType {
    id: number;
    name: string;
}

export const partyTypeOptions: PartyType[] = [
    {
        id: 1,
        name: "debtor",
    },
    {
        id: 2,
        name: "creditor",
    },
]

export interface Props {
    partyType: PartyType;
    onPartyTypeChange: any;

}

const SelectPartyType: React.FC<Props> = ({ partyType,  onPartyTypeChange}) => {
  
    const options = useMemo(() => {
        return partyTypeOptions.map((item: PartyType) => ({
          label: t(item.name),
          value: item  
        }))
    }, [])

    return (
    <Select
        value={options.filter((option: any) => option?.value?.id === partyType.id)}
        onChange={(selectedSingle: any) => {
            onPartyTypeChange(selectedSingle.value);
        }}
        options={options}
    />
  )
}

export default SelectPartyType
