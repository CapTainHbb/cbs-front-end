import React from 'react';

interface Props {
    currencyName?: string;
}

const CurrencyNameAndFlag : React.FC<Props> = ({ currencyName }) => {
    return (
        <div className="d-flex justify-items-evenly items-center gap-3" dir={'ltr'}>
            <img style={{ width: '25px', height: '25px' }} 
            src={`/flags/${currencyName}.svg`} 
            alt={currencyName} />
            <p>{currencyName && (currencyName)}</p>
        </div>
    );
};

export default CurrencyNameAndFlag;