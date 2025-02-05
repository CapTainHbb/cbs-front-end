import React from 'react';
import { formatNumber } from './utils';

interface Props {
    party_type: string;
    type: "debtor" | "creditor";
    amount?: number;
}

const CreditorDebtorAmount : React.FC<Props> = ({ party_type, type, amount }) => {

    if((party_type && party_type !== type) || !amount) {
        return <h1 className='py-1 rounded-lg'>
            {0}
        </h1>
    }

    return (
        <>
            {
                amount > 0?
                    <h1 className={`py-1 ${type === "debtor"? 'text-debtor-amount': 'text-creditor-amount'}`}>
                        {formatNumber(amount)}
                    </h1>:
                    formatNumber(amount)
            }
        </>
    );
};

export default CreditorDebtorAmount;