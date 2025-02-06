import React from 'react';
import {abs} from "mathjs";
import {formatNumber} from "./utils";

interface Props {
    amount: number;
}

const BalanceAmount: React.FC<Props> = ({ amount }) => {
    if(isNaN(amount) || amount === 0) {
        return <p>0</p>
    }
    return (
        <p
           style={{
               color: amount > 0 ? '#006800' : '#c60000'
           }}>
            {formatNumber(abs(amount))}
        </p>
    );
};

export default BalanceAmount;