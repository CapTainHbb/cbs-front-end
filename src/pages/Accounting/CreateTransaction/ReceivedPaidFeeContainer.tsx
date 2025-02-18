import React from 'react';
import {Col, FormFeedback, FormGroup, Input, Label, Row} from "reactstrap";
import {t} from "i18next";

interface Props {
    formik: any;
    prefixName: string;
}

const ReceivedPaidFeeContainer: React.FC<Props> = ({ formik, prefixName }) => {
    return (
        <Col>
            <Row>
                <Col md={4}>
                    <Row>
                        <Col>
                            <FormGroup>
                                <span className={'badge rounded-pill bg-success-subtle text-success'} >{t("Received Fee")}</span>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label htmlFor="rate">{t("Rate")}</Label>
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
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label htmlFor="amount">{t("Amount")}</Label>
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
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
                <Col md={4}>
                    <Row>
                        <Col>
                            <FormGroup>
                                <span className={'badge rounded-pill bg-danger-subtle text-danger'} >{t("Paid Fee")}</span>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label htmlFor="rate">{t("Rate")}</Label>
                                <Input
                                    id={`${prefixName}-paid-fee-rate`}
                                    name={`${prefixName}PaidFeeRate`}
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
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label htmlFor="amount">{t("Amount")}</Label>
                                <Input
                                    id={`${prefixName}-paid-fee-amount`}
                                    name="debtorPaidFeeAmount"
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
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
    );
};

export default ReceivedPaidFeeContainer;