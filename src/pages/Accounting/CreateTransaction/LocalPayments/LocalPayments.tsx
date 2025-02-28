import React, {useCallback, useEffect} from 'react';
import {LocalPaymentsFormDataType, PaymentDataType, defaultLocalPaymentsFormData} from "./types";
import {Col, Container, Form, FormGroup, Label, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {t} from "i18next";
import TransactionMetaData from "../TransactionMetaData";
import PartyContainer from "../PartyContainer";
import SelectFinancialAccount from "../../SelectFinancialAccount";
import {defaultInterestCostProps, FinancialAccount} from "../../types";
import ReceivedPaidFeeContainer from "../ReceivedPaidFeeContainer";
import FinancialAccountViewDetail from "../../../ManageFinancialAccounts/FinancialAccountViewDetail";
import TransactionDetails from "../TransactionDetails";
import TransactionFooter from "../TransactionFooter";
import * as Yup from "yup";
import {customFormatNumber, formatRateNumber, removeNonNumberChars} from "../../utils";
import {useTransactionFormik} from "../hooks/useTransactionFormik";
import TotalAmount from "./TotalAmount";
import PaymentsContainer from './PaymentsContainer';
import Payments from './Payments';
import { useSelector } from 'react-redux';
import {createLocalizedDate, getUTCFormattedDateTime, getUTCFormattedTodayDateTime} from 'helpers/date';

const initialResetForm = {
    totalAmount: "0",
    creditorFinancialAccount: null,
    creditorReceivedFeeRate: "0",
    creditorReceivedFeeAmount: "0",
    creditorPaidFeeRate: "0",
    creditorPaidFeeAmount: "0",
    debtorFinancialAccount: null,
    debtorReceivedFeeRate: "0",
    debtorReceivedFeeAmount: "0",
    debtorPaidFeeRate: "0",
    debtorPaidFeeAmount: "0",
    payments: [],
}

interface Props {
    isOpen: boolean;
    toggle: any;
    activeTransactionData?: LocalPaymentsFormDataType;
}

const LocalPayments: React.FC<Props> = ({ isOpen, toggle, activeTransactionData }) => {
    const localCurrency = useSelector((state: any) => state.InitialData.localCurrency);
    const getSpecificFormFieldsInitial = useCallback(() => {
        if (activeTransactionData?.transaction_type !== 'local-payments') {
            return structuredClone(initialResetForm);
        }


        let payments = activeTransactionData.payments.map((payment: PaymentDataType) => {
            return {
                amount: payment.amount,
                bank_account: payment.bank_account,
                payment_transaction_id: payment.payment_transaction_id,
                dateTime: createLocalizedDate(payment.date, payment.time),
            }
        });

        return {
            totalAmount: (activeTransactionData && customFormatNumber(activeTransactionData?.total_amount)) || "0",
            creditorFinancialAccount: activeTransactionData?.creditor_financial_account|| null,
            creditorReceivedFeeRate: formatRateNumber(activeTransactionData?.creditor_interest.rate) || "0",
            creditorReceivedFeeAmount: customFormatNumber(activeTransactionData?.creditor_interest.amount) || "0",
            creditorPaidFeeRate: formatRateNumber(activeTransactionData?.creditor_cost?.rate) || "0",
            creditorPaidFeeAmount: customFormatNumber(activeTransactionData?.creditor_cost?.amount) || "0",
            debtorFinancialAccount: activeTransactionData?.debtor_financial_account || null,
            debtorReceivedFeeRate: formatRateNumber(activeTransactionData?.debtor_interest?.rate) || "0",
            debtorReceivedFeeAmount: customFormatNumber(activeTransactionData?.debtor_interest?.amount) || "0",
            debtorPaidFeeRate: formatRateNumber(activeTransactionData?.debtor_cost?.rate) || "0",
            debtorPaidFeeAmount: customFormatNumber(activeTransactionData?.debtor_cost?.amount) || "0",
            payments: payments,
        }
    }, [activeTransactionData]);
    const getSpecificFormFieldsValidation = useCallback(() => {
        return ({
            totalAmount: Yup.string().required(t('Required')).min(1, t('Amount cannot be empty')).test('not-zero', t('Value cannot be zero'), (value) => Number(removeNonNumberChars(value)) !== 0),
            creditorFinancialAccount: Yup.string().required(t('Required')),
            creditorReceivedFeeRate: Yup.string().required(t("Required")),
            creditorReceivedFeeAmount: Yup.string().required(t("Required")),
            creditorPaidFeeRate: Yup.string().required(t("Required")),
            creditorPaidFeeAmount: Yup.string().required(t("Required")),
            debtorFinancialAccount: Yup.string().required(t('Required')),
            debtorReceivedFeeRate: Yup.string().required(t("Required")),
            debtorReceivedFeeAmount: Yup.string().required(t("Required")),
            debtorPaidFeeRate: Yup.string().required(t("Required")),
            debtorPaidFeeAmount: Yup.string().required(t("Required")),
            payments: Yup.array().of(
                Yup.object({
                    amount: Yup.string().required(t('Required')).min(1, t('Amount cannot be empty')).test('not-zero', t('Value cannot be zero'), (value) => Number(removeNonNumberChars(value)) !== 0),
                    bank_account: Yup.string(),
                    transaction_id: Yup.string(),
                    dateTime: Yup.string(),
                })
            ).min(1, 'At least one payment is required'),
        });
    }, []);
    const getSpecificFormFieldsAfterSubmission = useCallback((createdTransaction: LocalPaymentsFormDataType) => {
        let payments = createdTransaction.payments.map((payment: PaymentDataType) => {
            return {
                amount: payment.amount,
                bank_account: payment.bank_account,
                payment_transaction_id: payment.payment_transaction_id,
                dateTime: createLocalizedDate(payment.date, payment.time),
            }
        });

        return {
            totalAmount: (createdTransaction && customFormatNumber(createdTransaction?.total_amount)) || "0",
            creditorFinancialAccount: createdTransaction?.creditor_financial_account || null,
            creditorReceivedFeeRate: formatRateNumber(createdTransaction?.creditor_interest.rate) || "0",
            creditorReceivedFeeAmount: customFormatNumber(createdTransaction?.creditor_interest.amount) || "0",
            creditorPaidFeeRate: formatRateNumber(createdTransaction?.creditor_cost?.rate) || "0",
            creditorPaidFeeAmount: customFormatNumber(createdTransaction?.creditor_cost?.amount) || "0",
            debtorFinancialAccount: createdTransaction?.debtor_financial_account || null,
            debtorReceivedFeeRate: formatRateNumber(createdTransaction?.debtor_interest?.rate) || "0",
            debtorReceivedFeeAmount: customFormatNumber(createdTransaction?.debtor_interest?.amount) || "0",
            debtorPaidFeeRate: formatRateNumber(createdTransaction?.debtor_cost?.rate) || "0",
            debtorPaidFeeAmount: customFormatNumber(createdTransaction?.debtor_cost?.amount) || "0",
            payments: payments,
        }
    }, []);
    const getSpecificFormFieldsAfterResetForm = useCallback((inputFormik: any) => {
        return structuredClone(initialResetForm)
    }, []);

    const getSpecificTransactionDataForSubmission = useCallback((inputFormik: any) => {
        let data = {
            ...structuredClone(defaultLocalPaymentsFormData),
            debtor_interest: structuredClone(defaultInterestCostProps),
            debtor_cost: structuredClone(defaultInterestCostProps),
            creditor_financial_account: undefined,
            creditor_interest: structuredClone(defaultInterestCostProps),
            creditor_cost: structuredClone(defaultInterestCostProps),
        };

        const totalAmount = Number(removeNonNumberChars(inputFormik.values.totalAmount));
        
        data.currency = localCurrency?.id

        data.total_amount = totalAmount;
        data.debtor_financial_account = inputFormik.values.debtorFinancialAccount;
        data.debtor_interest.amount = Number(removeNonNumberChars(inputFormik.values.debtorReceivedFeeAmount));
        data.debtor_interest.rate = Number(removeNonNumberChars(inputFormik.values.debtorReceivedFeeRate));
        data.debtor_cost.amount = Number(removeNonNumberChars(inputFormik.values.debtorPaidFeeAmount));
        data.debtor_cost.rate = Number(removeNonNumberChars(inputFormik.values.debtorPaidFeeRate));
        
        data.creditor_financial_account = inputFormik.values.creditorFinancialAccount;
        data.creditor_interest.amount = Number(removeNonNumberChars(inputFormik.values.creditorReceivedFeeAmount));
        data.creditor_interest.rate = Number(removeNonNumberChars(inputFormik.values.creditorReceivedFeeRate));
        data.creditor_cost.amount = Number(removeNonNumberChars(inputFormik.values.creditorPaidFeeAmount));
        data.creditor_cost.rate = Number(removeNonNumberChars(inputFormik.values.creditorPaidFeeRate));

        data.payments = inputFormik.values.payments.map((item: PaymentDataType) => {
            return {
                bank_account: item.bank_account,
                payment_transaction_id: item.payment_transaction_id,
                amount: Number(removeNonNumberChars(item.amount)),
                date: item.dateTime? getUTCFormattedDateTime(item.dateTime).date: getUTCFormattedTodayDateTime().date,
                time: item.dateTime? getUTCFormattedDateTime(item.dateTime).time: getUTCFormattedTodayDateTime().time,
            }
        });
        return data;
    },[localCurrency])

    const {formik} = useTransactionFormik({
        endPointApi: '/transactions/local-payments',
        activeTransactionData,
        isParentModalOpen: isOpen,
        getSpecificFormFieldsInitial,
        getSpecificFormFieldsValidation,
        getSpecificFormFieldsAfterSubmission,
        getSpecificFormFieldsAfterResetForm,
        getSpecificTransactionDataForSubmission
    });

    formik.toggleCreditorFinancialAccountLock = useCallback((e: any) => {
        formik.setFieldValue('isCreditorFinancialAccountLocked', !formik.values.isCreditorFinancialAccountLocked);
    }, [formik.values.isCreditorFinancialAccountLocked]);
    formik.toggleDebtorFinancialAccountLock = useCallback((e: any) => {
        formik.setFieldValue('isDebtorFinancialAccountLocked', !formik.values.isDebtorFinancialAccountLocked);
    }, [formik.values.isDebtorFinancialAccountLocked]);

    useEffect(() => {
        if(isOpen) return;
        formik.flushFormValues();
    }, [isOpen])


    return (
        <Modal isOpen={isOpen} toggle={toggle} backdrop={"static"} className={'modal-xl'}>
            <ModalHeader className="bg-primary-subtle p-2" toggle={toggle}>
                <h5 className="modal-title">{t("Local Payments")}</h5>
            </ModalHeader>
            <ModalBody>
                <Form className={'form-container active'} onSubmit={formik.handleSubmit}>
                    <Container fluid>
                        {!formik.values.isCreate && <TransactionMetaData formik={formik} />}
                        <TotalAmount
                            formik={formik}
                        />

                        <PartyContainer 
                                        party={'creditor'}
                                        headerTitle={t("Creditor")}>
                            <Row>    
                                <Col md={8}>
                                    <Row>
                                        <FormGroup row className='align-items-center'>
                                            {/* Label */}
                                            <Label for={`creditorFinancialAccount`} md={2}>{t("Financial Account")}</Label>

                                            {/* SelectFinancialAccount */}
                                            <Col md={9}>
                                                <SelectFinancialAccount
                                                    onSelectFinancialAccount={(acc: FinancialAccount) => formik.setFieldValue(`creditorFinancialAccount`, acc?.id)}
                                                    selectedFinancialAccountId={formik.values?.creditorFinancialAccount}
                                                    disabled={formik.derivedState.areInputsDisabled}
                                                />
                                            </Col>
                                            {/* Error Message */}
                                            <Col md={3}>
                                                {formik.touched?.creditorFinancialAccount && formik.errors?.creditorFinancialAccount && (
                                                    <div className={'text-danger'}>{formik.errors?.creditorFinancialAccount}</div>
                                                )}
                                            </Col>
                                        </FormGroup>
                                        <ReceivedPaidFeeContainer 
                                            partyAmount={formik.values.totalAmount}
                                            formik={formik} 
                                            prefixName={'creditor'} />
                                    </Row>
                                </Col>
                                <Col md={4}>
                                    <FinancialAccountViewDetail
                                        financialAccountId={formik.values?.creditorFinancialAccount}
                                        forceUpdate={formik.values.forceUpdateFinancialAccountsBalance}
                                    />
                                </Col>
                            </Row>
                        </PartyContainer>


                        <PartyContainer 
                                        party={'debtor'}
                                        headerTitle={t("Debtor")}>
                            <Row>
                                <Col md={8}>
                                    <Row>
                                        <FormGroup row className='align-items-center'>
                                            {/* Label */}
                                            <Label for={`debtorFinancialAccount`} md={2}>{t("Financial Account")}</Label>

                                            {/* SelectFinancialAccount */}
                                            <Col md={9}>
                                                <SelectFinancialAccount
                                                    onSelectFinancialAccount={(acc: FinancialAccount) => formik.setFieldValue(`debtorFinancialAccount`, acc?.id)}
                                                    selectedFinancialAccountId={formik.values?.debtorFinancialAccount}
                                                    disabled={formik.derivedState.areInputsDisabled}
                                                />
                                            </Col>

                                            {/* Error Message */}
                                            <Col md={3}>
                                                {formik.touched?.[`debtorFinancialAccount`] && formik.errors?.debtorFinancialAccount && (
                                                    <div className={'text-danger'}>{formik.errors?.debtorFinancialAccount}</div>
                                                )}
                                            </Col>
                                        </FormGroup>
                                    </Row>
                                    <ReceivedPaidFeeContainer 
                                            partyAmount={formik.values.totalAmount}
                                            formik={formik} 
                                            prefixName={'debtor'} 
                                        />  
                                </Col>
                                <Col md={4}>
                                    <FinancialAccountViewDetail
                                        financialAccountId={formik.values?.debtorFinancialAccount}
                                        forceUpdate={formik.values.forceUpdateFinancialAccountsBalance}
                                    />
                                </Col>
                            </Row>
                        </PartyContainer>

                        <PaymentsContainer>
                            <Payments formik={formik} />
                        </PaymentsContainer>
                        
                        <TransactionDetails formik={formik} />
                        <TransactionFooter formik={formik}/>
                    </Container>
                </Form>
            </ModalBody>
        </Modal>
    );
};

export default LocalPayments;