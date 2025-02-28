import React, { useEffect, useRef } from 'react';
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
    const amountCompnentRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        const component = amountCompnentRef.current;
        const fieldName = prefixName === 'base'? 'isFocusedOnBaseAmount': 'isFocusedOnAgainstAmount'
        const handleFocus = () => formik.setFieldValue(fieldName, true);
        const handleBlur = () => formik.setFieldValue(fieldName, false);
    
        if (component) {
          component.addEventListener('focus', handleFocus, true);
          component.addEventListener('blur', handleBlur, true);
        }
    
        return () => {
          if (component) {
            component.removeEventListener('focus', handleFocus, true);
            component.removeEventListener('blur', handleBlur, true);
          }
        };
      }, []);
    
    return (
        <Row>
            <Col md={4}>
                <FormGroup row className={'align-items-center'}>
                    <Col md={2}>
                        <Label>
                            {t("Amount")}
                        </Label>
                    </Col>
                    <Col md={10}>
                        <Input
                            innerRef={amountCompnentRef}
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
                    </Col>
                </FormGroup>
            </Col>
            <Col md={5}>
                <FormGroup row className={'align-items-center'}>
                    <Col md={2}>
                        <Label htmlFor="currency">{t("Currency Type")}</Label>
                    </Col>
                    <Col md={10}>
                        <Row className='align-items-center'>
                            <Col md={9}>
                                <SelectCurrency currencyId={formik.values?.[`${prefixName}Currency`]}
                                                onCurrencyChange={(currency: Currency) => formik.setFieldValue(`${prefixName}Currency`, currency?.id)}
                                                disabled={formik.derivedState.areInputsDisabled}
                                />
                            </Col>
                            <Col md={3}>
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
                    </Col>
                </FormGroup>
            </Col>
        </Row>
    );
};

export default BuyAndSellAmountAndCurrency;