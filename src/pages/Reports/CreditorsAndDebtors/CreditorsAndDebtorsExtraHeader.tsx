import React from 'react';
import {Currency} from "../utils";
import {Col, Label, Row} from "reactstrap";
import SelectCurrency from "../SelectCurrency/SelectCurrency";
import SelectPartyType, { PartyType } from '../SelectPartyType';
import {t} from "i18next";


interface Props {
    currency: Currency;
    setCurrency: any;
    partyType: PartyType;
    setPartyType: any;
}


const CreditorsAndDebtorsExtraHeader: React.FC<Props> = ({
                                                             currency, setCurrency, partyType, setPartyType
                                                         }) => {
    return (
        <Row className="d-flex w-100 h-100 justify-content-evenly align-items-center">
            <Col lg={3}>
                <Label htmlFor="choices-single-default" className="form-label text-muted">{t("Currency Type")}</Label>
                <SelectCurrency
                    currencyId={currency?.id}
                    onCurrencyChange={(item: Currency) => setCurrency(item)}
                />
            </Col>
            <Col lg={3}>
                <Label htmlFor="choices-single-default" className="form-label text-muted">{t("Report Type")}</Label>
                <SelectPartyType 
                    partyType={partyType}
                    onPartyTypeChange={setPartyType}
                />
            </Col>
        </Row>
    );
};

export default CreditorsAndDebtorsExtraHeader;