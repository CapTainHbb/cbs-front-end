import React from 'react';

interface Props {
    currencyName?: string;
}

const CurrencyNameAndFlag : React.FC<Props> = ({ currencyName }) => {
    return (
        <div className="d-flex justify-items-center gap-1 items-center">
            <p>{currencyName && (currencyName)}</p>
            <img style={{ width: '25px', height: '25px' }}
            src={`/flags/${currencyName}.svg`}
            alt={currencyName} />
        </div>
    );
};

export default CurrencyNameAndFlag;