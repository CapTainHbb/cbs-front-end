import React from 'react';
import {Badge, Col, FormFeedback, FormGroup, Input, Label, Row} from "reactstrap";
import {t} from "i18next";
import SelectFinancialAccount from "../SelectFinancialAccount";
import {FinancialAccount} from "../types";
import FinancialAccountViewDetail from "../../ManageFinancialAccounts/FinancialAccountViewDetail";

interface Props {
    formik: any;
    party: 'creditor' | 'debtor';
    headerTitle: string;
    handleNumberInputChange: any;
}

const PartyContainer: React.FC<Props> = ({ formik, party, headerTitle, handleNumberInputChange }) => {
    return (
        <Row className={`mb-1 border-opacity-50 border border-1 ${party === 'debtor'? 'border-danger': 'border-success'}`}>
            <Row>
                <Col md={6}>
                    <Badge className={'px-5 fs-6 mb-2'} color={party === 'debtor'? "danger": 'success'}>{headerTitle}</Badge>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <FormGroup>
                        <Label htmlFor={`${party}FinancialAccount`}>{t("Financial Account")}</Label>
                        <SelectFinancialAccount onSelectFinancialAccount={(acc: FinancialAccount) => formik.setFieldValue(`${party}FinancialAccount`, acc?.id)}
                                                selectedFinancialAccountId={formik.values?.[`${party}FinancialAccount`]}
                                                disabled={formik.derivedState.areInputsDisabled}
                        />
                        {formik.touched?.[`${party}FinancialAccount`] && formik.errors?.[`${party}FinancialAccount`]
                            && <div className={'text-danger'}>{formik.errors?.[`${party}FinancialAccount`]}</div>}
                    </FormGroup>
                </Col>
            </Row>
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
                                    id={`${party}-received-fee-rate`}
                                    name={"debtorReceivedFeeRate"}
                                    type="text"
                                    value={formik.values?.[`${party}ReceivedFeeRate`]}
                                    onChange={(e: any) => handleNumberInputChange(`${party}ReceivedFeeRate`, e)}
                                    onBlur={formik.handleBlur}
                                    placeholder={t("Enter Rate")}
                                    invalid={
                                        !!(formik.touched?.[`${party}ReceivedFeeRate`] && formik.errors?.[`${party}ReceivedFeeRate`])
                                    }
                                    disabled={formik.derivedState.areInputsDisabled}
                                />
                                {formik.touched?.[`${party}ReceivedFeeRate`] && formik.errors?.[`${party}ReceivedFeeRate`] ? (
                                    <FormFeedback type="invalid">{formik.errors?.[`${party}ReceivedFeeRate`]}</FormFeedback>
                                ) : null}
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label htmlFor="amount">{t("Amount")}</Label>
                                <Input
                                    id={`${party}-received-fee-amount`}
                                    name={`${party}ReceivedFeeAmount`}
                                    type="text"
                                    value={formik.values?.[`${party}ReceivedFeeAmount`]}
                                    onChange={(e: any) => handleNumberInputChange(`${party}ReceivedFeeAmount`, e)}
                                    onBlur={formik.handleBlur}
                                    placeholder={t("Enter Amount")}
                                    invalid={
                                        !!(formik.touched?.[`${party}ReceivedFeeAmount`] && formik.errors?.[`${party}ReceivedFeeAmount`])
                                    }
                                    disabled={formik.derivedState.areInputsDisabled}
                                />
                                {formik.touched?.[`${party}ReceivedFeeAmount`] && formik.errors?.[`${party}ReceivedFeeAmount`] ? (
                                    <FormFeedback type="invalid">{formik.errors?.[`${party}ReceivedFeeAmount`]}</FormFeedback>
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
                                    id={`${party}-paid-fee-rate`}
                                    name={`${party}PaidFeeRate`}
                                    type="text"
                                    value={formik.values?.[`${party}PaidFeeRate`]}
                                    onChange={(e: any) => handleNumberInputChange(`${party}PaidFeeRate`, e)}
                                    onBlur={formik.handleBlur}
                                    placeholder={t("Enter Rate")}
                                    invalid={
                                        !!(formik.touched?.[`${party}PaidFeeRate`] && formik.errors?.[`${party}PaidFeeRate`])
                                    }
                                    disabled={formik.derivedState.areInputsDisabled}
                                />
                                {formik.touched?.[`${party}PaidFeeRate`] && formik.errors?.[`${party}PaidFeeRate`] ? (
                                    <FormFeedback type="invalid">{formik.errors?.[`${party}PaidFeeRate`]}</FormFeedback>
                                ) : null}
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label htmlFor="amount">{t("Amount")}</Label>
                                <Input
                                    id={`${party}-paid-fee-amount`}
                                    name="debtorPaidFeeAmount"
                                    type="text"
                                    value={formik.values?.[`${party}PaidFeeAmount`]}
                                    onChange={(e: any) => handleNumberInputChange(`${party}PaidFeeAmount`, e)}
                                    onBlur={formik.handleBlur}
                                    placeholder={t("Enter Amount")}
                                    invalid={
                                        !!(formik.touched?.[`${party}PaidFeeAmount`] && formik.errors?.[`${party}PaidFeeAmount`])
                                    }
                                    disabled={formik.derivedState.areInputsDisabled}
                                />
                                {formik.touched?.[`${party}PaidFeeAmount`] && formik.errors?.[`${party}PaidFeeAmount`] ? (
                                    <FormFeedback type="invalid">{formik.errors?.[`${party}PaidFeeAmount`]}</FormFeedback>
                                ) : null}
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
                <Col md={4}>
                    <FinancialAccountViewDetail financialAccountId={formik.values?.[`${party}FinancialAccount`]} />
                </Col>
            </Row>
        </Row>
    );
};

export default PartyContainer;