import React from 'react';
import {abs} from "mathjs";
import { customFormatNumber } from 'pages/Accounting/utils';

interface Props {
    amount: number;
}

const BalanceAmount: React.FC<Props> = ({ amount }) => {
    if(isNaN(amount) || amount === null || amount === 0) {
        return <p>0</p>
    }
    return (
        <p
            className={'fw-medium'}
           style={{
               color: amount > 0 ? '#008e00' : '#ec0000'
           }}>
            {customFormatNumber(abs(amount))}
        </p>
    );
};

export default BalanceAmount;