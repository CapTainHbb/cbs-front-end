import React, {useMemo} from 'react';
import i18n from "i18next";
import {Currency} from "../../../pages/Reports/utils";
import num2words from "./utils";
import {Col, Label, Row} from "reactstrap";
import {useSelector} from "react-redux";

interface Props {
    value: number;
    currencyId?: Currency;
}

const NumberToWords : React.FC<Props> = ({ value, currencyId }) => {
    const currencies = useSelector((state: any) => state.InitialData.currencies);
    const currency = useMemo(() => {
        return currencies?.find((cur: Currency) => cur.id === currencyId);
    }, [currencyId])

    return (
        <Row className="align-items-center align-content-center"
             data-tooltip-id="tooltip"
             data-tooltip-content={num2words(value,  i18n.language)}>
            <Col md={10} className={'align-items-center'}>
                <Label className="text-primary">{num2words(value,  i18n.language)}</Label>
            </Col>
            <Col className={'align-items-center'}>
                {currency && <Label className="outline-2 p-1" >
                    {currency?.alternative_name}
                </Label>}
            </Col>
        </Row>
    );
};

export default NumberToWords;