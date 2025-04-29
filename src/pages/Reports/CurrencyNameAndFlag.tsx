import React, {useMemo} from 'react';
import {useSelector} from "react-redux";
import {Currency} from "./utils";

interface Props {
    currencyId?: number;
}

const CurrencyNameAndFlag : React.FC<Props> = ({ currencyId }) => {
    const currencies = useSelector((state: any) => state.InitialData.currencies);
    const currencyName = useMemo(() => {
        return currencies?.find((cur: Currency) => cur.id === currencyId)?.name
    }, [currencyId, currencies]);
    return (
        <div style={{overflowX: "hidden"}}
            className="d-flex justify-items-center gap-1 items-center">
            <p>{currencyName && (currencyName)}</p>
            <img style={{ width: '25px', height: '25px' }}
            src={`/flags/${currencyName}.svg`}
            alt={currencyName} />
        </div>
    );
};

export default CurrencyNameAndFlag;