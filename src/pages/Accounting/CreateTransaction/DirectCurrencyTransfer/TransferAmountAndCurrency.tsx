import React from 'react';
import {Button, Col, FormFeedback, FormGroup, Input, Label, Row} from "reactstrap";
import {t} from "i18next";
import SelectCurrency from "../../../Reports/SelectCurrency/SelectCurrency";
import {Currency} from "../../../Reports/utils";
import LockInputButton from 'Components/Common/LockInputButton';
import NumberToWords from "../../../../Components/Common/NumberToWords/NumberToWords";
import {removeNonNumberChars} from "../../utils";

interface Props {
    formik: any;
}

const TransferAmountAndCurrency: React.FC<Props> = ({ formik }) => {
    return (
        <Row>
            <Col md={7}>
                <FormGroup className='align-items-center'>
                    <Label htmlFor="amount">{t("Transfer Amount")}</Label>
                    <Input
                        id="amount"
                        name="amount"
                        type="text"
                        value={formik.values.amount}
                        onChange={(e: any) => formik.handleNumberInputChange('amount', e.target.value)}
                        onBlur={formik.handleBlur}
                        placeholder={t("Enter Amount")}
                        invalid={
                            !!(formik.touched.amount && formik.errors.amount)
                        }
                        disabled={formik.derivedState.areInputsDisabled}
                    />
                    {formik.touched.amount && formik.errors.amount ? (
                        <FormFeedback type="invalid">{formik.errors.amount}</FormFeedback>
                    ) : null}
                    <NumberToWords value={Number(removeNonNumberChars(formik.values.amount))}
                                   currencyId={formik.values.currency} />
                </FormGroup>
            </Col>
            <Col md={5}>
                <FormGroup>
                    <Label htmlFor="currency">{t("Currency Type")}</Label>
                    <Row className='align-items-center'>
                        <Col md={10}>
                            <SelectCurrency currencyId={formik.values.currency}
                                            onCurrencyChange={(currency: Currency) => formik.setFieldValue('currency', currency?.id)}
                                            disabled={formik.derivedState.areInputsDisabled}
                            />
                        </Col>
                        <Col md={2}>
                            <LockInputButton isLocked={formik.values.isCurrencyLocked} onClick={formik.toggleCurrencyLock} />
                        </Col>
                    </Row>
                    {formik.touched.currency && formik.errors.currency &&
                        <div className="text-danger">{formik.errors.currency}</div>}
                </FormGroup>
            </Col>
        </Row>
    );
};

export default TransferAmountAndCurrency;