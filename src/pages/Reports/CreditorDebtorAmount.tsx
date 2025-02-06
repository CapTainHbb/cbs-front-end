import React from 'react';
import { formatNumber } from './utils';
import {abs} from "mathjs";

interface Props {
    party_type: string;
    type: "debtor" | "creditor";
    amount?: number;
}

const CreditorDebtorAmount : React.FC<Props> = ({ party_type, type, amount }) => {

    if((party_type && party_type !== type) || !amount) {
        return <p className='py-1 rounded-lg'>
            {0}
        </p>
    }

    return (
        <p
            style={{
                color: type==='creditor' && amount > 0 ? '#006800' : '#c60000'
            }}>
            {formatNumber(abs(amount))}
        </p>
    );
};

export default CreditorDebtorAmount;