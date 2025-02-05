import React from 'react';
import {Currency} from "../utils";

interface Props {
    currency: Currency;
}

const CurrencyOption: React.FC<Props> = ({ currency }) => {
    return (
        <div className={'d-flex align-items-center justify-content-between gap-2'}>
            <img alt={currency.name} style={{ width: '25px', height: '25px' }} src={`/flags/${currency.name}.svg`}/>
            <p className={'mb-0'}>{currency.name}</p>
            <p className={'mb-0'} >{currency.alternative_name}</p>
        </div>
    );
};

export default CurrencyOption;