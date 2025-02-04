import React from 'react';

interface Props {
    currencyName?: string;
}

const CurrencyNameAndFlag : React.FC<Props> = ({ currencyName }) => {
    return (
        <div className="flex flex-row justify-evenly items-center" dir={'ltr'}>
            <img src={`/flags/svgs/${currencyName}.svg`} alt="" className="flag-image"/>
            <p>{currencyName && (currencyName)}</p>
        </div>
    );
};

export default CurrencyNameAndFlag;