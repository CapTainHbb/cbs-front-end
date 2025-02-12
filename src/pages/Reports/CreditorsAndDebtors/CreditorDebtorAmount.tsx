import React from 'react';
import { formatNumber } from '../utils';
import {abs} from "mathjs";

interface Props {
    party_type: string;
    type: "debtor" | "creditor";
    amount?: number;
}

const CreditorDebtorAmount : React.FC<Props> = ({ party_type, type, amount }) => {

    if((party_type && party_type !== type) || !amount) {
        return <p className='fw-medium'>
            {0}
        </p>
    }

    return (
        <p
            className={'fw-medium'}
            style={{
                color: type==='creditor' && amount > 0 ? '#008e00' : '#ec0000'
            }}>
            {formatNumber(abs(amount))}
        </p>
    );
};

export default CreditorDebtorAmount;