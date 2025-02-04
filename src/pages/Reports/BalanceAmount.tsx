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
        <h1 className={`py-0.5 select-text ${amount > 0? 'text-creditor-amount': (amount < 0? 'text-debtor-amount': '')}`}
        >
            {formatNumber(abs(amount))}
        </h1>
    );
};

export default BalanceAmount;