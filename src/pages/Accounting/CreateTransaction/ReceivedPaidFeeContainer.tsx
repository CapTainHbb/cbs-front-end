import React, { useMemo } from 'react';
import {Col, FormFeedback, FormGroup, Input, Label, Row} from "reactstrap";
import {t} from "i18next";
import { customFormatNumber, removeNonNumberChars } from '../utils';

interface Props {
    formik: any;
    prefixName: string;
    partyAmount?: string;
}

const ReceivedPaidFeeContainer: React.FC<Props> = ({ formik, prefixName, partyAmount }) => {
    const calculatedPaidRate = useMemo(() => {
        const rate = Number(removeNonNumberChars(formik.values?.[`${prefixName}PaidFeeRate`]));
        const amount = Number(removeNonNumberChars(partyAmount));
        return customFormatNumber((amount * rate * 0.01));
    }, [partyAmount, formik]);

    const calculatedReceivedRate = useMemo(() => {
        const rate = Number(removeNonNumberChars(formik.values?.[`${prefixName}ReceivedFeeRate`]));
        const amount = Number(removeNonNumberChars(partyAmount));
        return customFormatNumber(amount * rate * 0.01);
    }, [partyAmount, formik]);

    const calculatedFinalAmount = useMemo(() => {
        const amount = Number(removeNonNumberChars(partyAmount));
        const receivedFee = Number(removeNonNumberChars(formik.values?.[`${prefixName}ReceivedFeeAmount`]));
        const paidFee = Number(removeNonNumberChars(formik.values?.[`${prefixName}PaidFeeAmount`]));
        const receivedTotal = Number(removeNonNumberChars(calculatedReceivedRate)) + receivedFee;
        const paidTotal = Number(removeNonNumberChars(calculatedPaidRate)) + paidFee;

        const isAdd =
            (prefixName === 'debtor') ||
            (prefixName === 'base' && formik.values?.isBuy) ||
            (prefixName === 'against' && !formik.values?.isBuy);
        const result = isAdd ? amount + receivedTotal - paidTotal : amount - receivedTotal + paidTotal;
        return customFormatNumber(result)
    }, [partyAmount, formik.values, calculatedReceivedRate, calculatedPaidRate]);

    const finalAmountStyle = useMemo(() => {
        if(prefixName === 'creditor') {
            return 'text-success'
        } else if(prefixName === 'debtor') {
            return 'text-danger';
        } else if(prefixName === 'base' && formik.values?.isBuy) {
            return 'text-danger'
        } else if(prefixName === 'base' && !formik.values?.isBuy) {
            return 'text-success'
        } else if(prefixName === 'against' && formik.values?.isBuy) {
            return 'text-success'
        } else if(prefixName === 'against' && !formik.values?.isBuy) {
            return 'text-danger'
        }
    }, [prefixName, formik.values])
    return (
        <Col >
            <Row >
                <Col md={6} className='border border-1 border-subtle-info' >
                    <Row className={'align-items-center'}>
                        <Col md={12}>
                            <Row>
                                <FormGroup>
                                    <Label className={'fs-11 rounded text-center  bg-success-subtle text-success'} >{t("Received Fee")}</Label>
                                </FormGroup>
                            </Row>
                            <Row>
                                <Col md={7}>
                                    <FormGroup className='align-items-center' row>
                                        <Col md={2}>
                                            <Label htmlFor="rate">{t("Rate")}</Label>
                                        </Col>
                                        <Col>
                                            <Input
                                                id={`${prefixName}-received-fee-rate`}
                                                name={"debtorReceivedFeeRate"}
                                                type="text"
                                                value={formik.values?.[`${prefixName}ReceivedFeeRate`]}
                                                onChange={(e: any) => formik.handleRateNumberInputChange(`${prefixName}ReceivedFeeRate`, e.target.value)}
                                                onBlur={formik.handleBlur}
                                                placeholder={t("Enter Rate")}
                                                invalid={
                                                    !!(formik.touched?.[`${prefixName}ReceivedFeeRate`] && formik.errors?.[`${prefixName}ReceivedFeeRate`])
                                                }
                                                disabled={formik.derivedState.areInputsDisabled}
                                            />
                                            {formik.touched?.[`${prefixName}ReceivedFeeRate`] && formik.errors?.[`${prefixName}ReceivedFeeRate`] ? (
                                                <FormFeedback type="invalid">{formik.errors?.[`${prefixName}ReceivedFeeRate`]}</FormFeedback>
                                            ) : null}
                                        </Col>
                                        <Col>
                                            <Label>{calculatedReceivedRate}</Label>
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col md={5}>
                                    <FormGroup row className='align-items-center'>
                                        <Col md={3}>
                                            <Label htmlFor="amount">{t("Amount")}</Label>
                                        </Col>
                                        <Col>
                                            <Input
                                                id={`${prefixName}-received-fee-amount`}
                                                name={`${prefixName}ReceivedFeeAmount`}
                                                type="text"
                                                value={formik.values?.[`${prefixName}ReceivedFeeAmount`]}
                                                onChange={(e: any) => formik.handleNumberInputChange(`${prefixName}ReceivedFeeAmount`, e.target.value)}
                                                onBlur={formik.handleBlur}
                                                placeholder={t("Enter Amount")}
                                                invalid={
                                                    !!(formik.touched?.[`${prefixName}ReceivedFeeAmount`] && formik.errors?.[`${prefixName}ReceivedFeeAmount`])
                                                }
                                                disabled={formik.derivedState.areInputsDisabled}
                                            />
                                            {formik.touched?.[`${prefixName}ReceivedFeeAmount`] && formik.errors?.[`${prefixName}ReceivedFeeAmount`] ? (
                                                <FormFeedback type="invalid">{formik.errors?.[`${prefixName}ReceivedFeeAmount`]}</FormFeedback>
                                            ) : null}
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col md={6} className='border border-1 border-subtle-info'>
                    <Row className={'align-items-center'}>
                        <Col md={12}>
                            <Row>
                                <FormGroup>
                                    <Label className={'fs-11 rounded bg-danger-subtle text-danger'} >{t("Paid Fee")}</Label>
                                </FormGroup>
                            </Row>
                            <Row>
                                <Col md={7}>
                                    <FormGroup row className='align-items-center'>
                                        <Col md={2}>
                                            <Label htmlFor="rate">{t("Rate")}</Label>
                                        </Col>
                                        <Col>
                                            <Input
                                                id={`${prefixName}-paid-fee-rate`}
                                                name={"debtorPaidFeeRate"}
                                                type="text"
                                                value={formik.values?.[`${prefixName}PaidFeeRate`]}
                                                onChange={(e: any) => formik.handleRateNumberInputChange(`${prefixName}PaidFeeRate`, e.target.value)}
                                                onBlur={formik.handleBlur}
                                                placeholder={t("Enter Rate")}
                                                invalid={
                                                    !!(formik.touched?.[`${prefixName}PaidFeeRate`] && formik.errors?.[`${prefixName}PaidFeeRate`])
                                                }
                                                disabled={formik.derivedState.areInputsDisabled}
                                            />
                                            {formik.touched?.[`${prefixName}PaidFeeRate`] && formik.errors?.[`${prefixName}PaidFeeRate`] ? (
                                                <FormFeedback type="invalid">{formik.errors?.[`${prefixName}PaidFeeRate`]}</FormFeedback>
                                            ) : null}
                                        </Col>
                                        <Col>
                                            <Label>{calculatedPaidRate}</Label>
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col md={5}>
                                    <FormGroup row className='align-items-center'>
                                        <Col md={3}>
                                            <Label htmlFor="amount">{t("Amount")}</Label>
                                        </Col>
                                        <Col>
                                            <Input
                                                id={`${prefixName}-paid-fee-amount`}
                                                name={`${prefixName}PaidFeeAmount`}
                                                type="text"
                                                value={formik.values?.[`${prefixName}PaidFeeAmount`]}
                                                onChange={(e: any) => formik.handleNumberInputChange(`${prefixName}PaidFeeAmount`, e.target.value)}
                                                onBlur={formik.handleBlur}
                                                placeholder={t("Enter Amount")}
                                                invalid={
                                                    !!(formik.touched?.[`${prefixName}PaidFeeAmount`] && formik.errors?.[`${prefixName}PaidFeeAmount`])
                                                }
                                                disabled={formik.derivedState.areInputsDisabled}
                                            />
                                            {formik.touched?.[`${prefixName}PaidFeeAmount`] && formik.errors?.[`${prefixName}PaidFeeAmount`] ? (
                                                <FormFeedback type="invalid">{formik.errors?.[`${prefixName}PaidFeeAmount`]}</FormFeedback>
                                            ) : null}
                                        </Col>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col md={2}>
                    <Label className={finalAmountStyle}>{t("Final Amount")}</Label>
                </Col>
                <Col>
                    <Label className={finalAmountStyle}>{calculatedFinalAmount}</Label>
                </Col>
            </Row>
        </Col>
    );
};

export default ReceivedPaidFeeContainer;