import React from 'react';
import {Button, Col, FormFeedback, FormGroup, Input, Label, Row} from "reactstrap";
import {t} from "i18next";
import SelectCurrency from "../../../Reports/SelectCurrency/SelectCurrency";
import {Currency} from "../../../Reports/utils";
import LockInputButton from 'Components/Common/LockInputButton';
import CurrencyNameAndFlag from "../../../Reports/CurrencyNameAndFlag";
import {useSelector} from "react-redux";

interface Props {
    formik: any;
}

const TransferAmountAndCurrency: React.FC<Props> = ({ formik }) => {
    const localCurrency = useSelector((state: any) => state.InitialData.localCurrency)
    return (
        <Row>
            <Col>
                <FormGroup className='align-items-center' row>
                    <Label htmlFor="amount">{t("Transfer Amount")}</Label>
                    <Col>
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
                        {formik.touched.totalAmount && formik.errors.totalAmount ? (
                            <FormFeedback type="invalid">{formik.errors.totalAmount}</FormFeedback>
                        ) : null}
                    </Col>
                    <Col>
                        <CurrencyNameAndFlag currencyId={localCurrency?.id} />
                    </Col>
                </FormGroup>
            </Col>
        </Row>
    );
};

export default TransferAmountAndCurrency;