import React from 'react';
import {Col, FormFeedback, FormGroup, Input, Label, Row} from "reactstrap";
import {t} from "i18next";
import SelectCurrency from "../../../Reports/SelectCurrency/SelectCurrency";
import {Currency} from "../../../Reports/utils";

interface Props {
    formik: any;
    handleNumberInputChange: any;
}

const TransferAmountAndCurrency: React.FC<Props> = ({ formik, handleNumberInputChange }) => {
    return (
        <Row>
            <Col md={6}>
                <FormGroup>
                    <Label htmlFor="amount">{t("Transfer Amount")}</Label>
                    <Input
                        id="amount"
                        name="amount"
                        type="text"
                        value={formik.values.amount}
                        onChange={(e: any) => handleNumberInputChange('amount', e)}
                        onBlur={formik.handleBlur}
                        placeholder={t("Enter Amount")}
                        invalid={
                            !!(formik.touched.amount && formik.errors.amount)
                        }
                    />
                    {formik.touched.amount && formik.errors.amount ? (
                        <FormFeedback type="invalid">{formik.errors.amount}</FormFeedback>
                    ) : null}
                </FormGroup>
            </Col>
            <Col md={6}>
                <FormGroup>
                    <Label htmlFor="currency">{t("Currency Type")}</Label>
                    <SelectCurrency currencyId={formik.values.currency}
                                    onCurrencyChange={(currency: Currency) => formik.setFieldValue('currency', currency?.id)}
                    />
                    {formik.touched.currency && formik.errors.currency &&
                        <div className="text-danger">{formik.errors.currency}</div>}
                </FormGroup>
            </Col>
        </Row>
    );
};

export default TransferAmountAndCurrency;