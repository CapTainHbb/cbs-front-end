import React from 'react';
import {abs} from "mathjs";
import { customFormatNumber } from 'pages/Accounting/utils';

interface Props {
    party_type: string;
    type: "debtor" | "creditor";
    amount?: number;
}

const CreditorDebtorAmount : React.FC<Props> = ({ party_type, type, amount }) => {

    if((party_type && party_type !== type) || !amount || Number(amount) === 0) {
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
            {customFormatNumber(abs(amount))}
        </p>
    );
};

export default CreditorDebtorAmount;