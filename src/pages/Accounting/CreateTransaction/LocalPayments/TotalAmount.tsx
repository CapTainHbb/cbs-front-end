import React from 'react';
import {Col, FormFeedback, FormGroup, Input, Label, Row} from "reactstrap";
import {t} from "i18next";
import CurrencyNameAndFlag from "../../../Reports/CurrencyNameAndFlag";
import {useSelector} from "react-redux";
import NumberToWords from "../../../../Components/Common/NumberToWords/NumberToWords";
import {removeNonNumberChars} from "../../utils";

interface Props {
    formik: any;
}

const TransferAmountAndCurrency: React.FC<Props> = ({ formik }) => {
    const localCurrency = useSelector((state: any) => state.InitialData.localCurrency)
    return (
        <Row>
            <Col>
                <FormGroup className='align-items-center' row>
                    <Col md={1}>
                        <Label htmlFor="amount">{t("Transfer Amount")}</Label>
                    </Col>
                    <Col md={3}>
                        <Input
                            id="amount"
                            name="amount"
                            type="text"
                            value={formik.values.totalAmount}
                            onChange={(e: any) => formik.handleNumberInputChange('totalAmount', e.target.value)}
                            onBlur={formik.handleBlur}
                            placeholder={t("Enter Amount")}
                            invalid={
                                !!(formik.touched.totalAmount && formik.errors.totalAmount)
                            }
                            disabled={formik.derivedState.areInputsDisabled}
                        />
                        {(formik.touched.totalAmount && formik.errors.totalAmount) ? (
                            <FormFeedback className={'text-danger'}>{formik.errors.totalAmount}</FormFeedback>
                        ) : null}
                    </Col>
                    <Col md={7}>
                        <NumberToWords value={Number(removeNonNumberChars(formik.values.totalAmount))}
                                       currencyId={localCurrency?.id} />
                    </Col>
                    <Col md={1}>
                        <CurrencyNameAndFlag currencyId={localCurrency?.id} />
                    </Col>
                </FormGroup>
            </Col>
        </Row>
    );
};

export default TransferAmountAndCurrency;