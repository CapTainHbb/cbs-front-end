import React, { useMemo } from 'react';
import {Col, FormFeedback, FormGroup, Input, Label, Row} from "reactstrap";
import {t} from "i18next";
import { removeNonNumberChars } from '../utils';
import {formatNumber} from "../../Reports/utils";

interface Props {
    formik: any;
    prefixName: string;
    partyAmount?: string;
}

const ReceivedPaidFeeContainer: React.FC<Props> = ({ formik, prefixName, partyAmount }) => {
    const calculatedPaidRate = useMemo(() => {
        const rate = Number(removeNonNumberChars(formik.values?.[`${prefixName}PaidFeeRate`]));
        const amount = Number(removeNonNumberChars(partyAmount));
        return formatNumber((amount * rate * 0.01).toFixed(2));
    }, [partyAmount, formik]);

    const calculatedReceivedRate = useMemo(() => {
        const rate = Number(removeNonNumberChars(formik.values?.[`${prefixName}ReceivedFeeRate`]));
        const amount = Number(removeNonNumberChars(partyAmount));
        return formatNumber((amount * rate * 0.01).toFixed(2));
    }, [partyAmount, formik]);
    
    return (
        <Col>
            <Row>
                <Col md={6} className='border border-1 border-subtle-info'>
                    <Row>
                        <Col md={2}>
                            <Row>
                                <FormGroup>
                                    <span className={'badge rounded-pill bg-success-subtle text-success'} >{t("Received Fee")}</span>
                                </FormGroup>
                            </Row>
                        </Col>
                        <Col md={10}>
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
                                                onChange={(e: any) => formik.handleNumberInputChange(`${prefixName}ReceivedFeeRate`, e.target.value)}
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
                                            <Label>{formatNumber(calculatedReceivedRate)}</Label>
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col md={5}>
                                    <FormGroup row className='align-items-center'>
                                        <Col md={2}>
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
                    <Row>
                        <Col md={2}>
                            <Row>
                                <FormGroup>
                                    <span className={'badge rounded-pill bg-danger-subtle text-danger'} >{t("Received Fee")}</span>
                                </FormGroup>
                            </Row>
                        </Col>
                        <Col md={10}>
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
                                                onChange={(e: any) => formik.handleNumberInputChange(`${prefixName}PaidFeeRate`, e.target.value)}
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
                                            <Label>{formatNumber(calculatedPaidRate)}</Label>
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col md={5}>
                                    <FormGroup row className='align-items-center'>
                                        <Col md={2}>
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
        </Col>
    );
};

export default ReceivedPaidFeeContainer;