import React from 'react';
import {Col, FormFeedback, FormGroup, Input, Label, Row} from "reactstrap";

import SelectCurrency from "../../../Reports/SelectCurrency/SelectCurrency";
import {Currency} from "../../../Reports/utils";
import LockInputButton from "../../../../Components/Common/LockInputButton";
import {useTranslation} from "react-i18next";

interface Props {
    formik: any;
    prefixName: "base" | "against";
    onChangeAmountValue: any;
}

const BuyAndSellAmountAndCurrency: React.FC<Props> = ({  formik, prefixName, onChangeAmountValue }) => {
    const {t} = useTranslation();
    return (
        <Row>
            <Col md={6}>
                <FormGroup>
                    <Label>
                        {t("Amount")}
                    </Label>
                    <Input
                        type={'text'}
                        name={`${prefixName}Amount`}
                        value={formik.values?.[`${prefixName}Amount`]}
                        onChange={onChangeAmountValue}
                        onBlur={formik.handleBlur}
                        placeholder={t("Enter Amount")}
                        invalid={
                            !!(formik.touched?.[`${prefixName}Amount`] && formik.errors?.[`${prefixName}Amount`])
                        }
                        disabled={formik.derivedState.areInputsDisabled}
                    />
                    {formik.touched?.[`${prefixName}Amount`] && formik.errors?.[`${prefixName}Amount`] ? (
                        <FormFeedback type="invalid">{formik.errors?.[`${prefixName}Amount`]}</FormFeedback>
                    ) : null}
                </FormGroup>
            </Col>
            <Col md={6}>
                <FormGroup>
                    <Label htmlFor="currency">{t("Currency Type")}</Label>
                    <Row className='align-items-center'>
                        <Col md={10}>
                            <SelectCurrency currencyId={formik.values?.[`${prefixName}Currency`]}
                                            onCurrencyChange={(currency: Currency) => formik.setFieldValue(`${prefixName}Currency`, currency?.id)}
                                            disabled={formik.derivedState.areInputsDisabled}
                            />
                        </Col>
                        <Col md={2}>
                            {prefixName === "base" &&
                                <LockInputButton isLocked={formik.values.isBaseCurrencyLocked}
                                                 onClick={formik.toggleBaseCurrencyLock} />
                            }
                            {prefixName === "against" &&
                                <LockInputButton isLocked={formik.values.isAgainstCurrencyLocked}
                                                 onClick={formik.toggleAgainstCurrencyLock} />
                            }
                        </Col>
                    </Row>
                    {formik.touched?.[`${prefixName}Currency`] && formik.errors?.[`${prefixName}Currency`] &&
                        <div className="text-danger">{formik.errors?.[`${prefixName}Currency`]}</div>}
                </FormGroup>
            </Col>
        </Row>
    );
};

export default BuyAndSellAmountAndCurrency;