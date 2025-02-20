import React, {useCallback, useEffect} from 'react'
import {
    Col,
    Container,
    Form, FormGroup, Label,
    Modal,
    ModalBody,
    ModalHeader, Row,
} from 'reactstrap';
import {t} from "i18next";
import TransactionDetails from "../TransactionDetails";
import PartyContainer from "../PartyContainer";
import TransferAmountAndCurrency from "./TransferAmountAndCurrency";
import {defaultDirectCurrencyTransferFormData, DirectCurrencyTransferTransactionFormDataType} from "./types";
import TransactionFooter from "../TransactionFooter";
import TransactionMetaData from '../TransactionMetaData';
import {useTransactionFormik} from "../hooks/useTransactionFormik";
import {formatNumber} from "../../../Reports/utils";
import * as Yup from "yup";
import {removeNonNumberChars} from "../../utils";
import {getFormattedDateTime} from "../../../../helpers/date";
import SelectFinancialAccount from "../../SelectFinancialAccount";
import {FinancialAccount} from "../../types";
import LockInputButton from "../../../../Components/Common/LockInputButton";
import ReceivedPaidFeeContainer from "../ReceivedPaidFeeContainer";
import FinancialAccountViewDetail from "../../../ManageFinancialAccounts/FinancialAccountViewDetail";

const initialRestForm = {
    amount: "0",
    currency: null,
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
}

interface Props {
    isOpen: boolean;
    toggle: any;
    activeTransactionData?: DirectCurrencyTransferTransactionFormDataType;
}

const DirectCurrencyTransfer: React.FC<Props> = ({ isOpen, toggle, activeTransactionData }) => {
    const getSpecificFormFieldsInitial = useCallback(() => {
        if(activeTransactionData?.transaction_type !== 'direct-currency-transfer') {
            return structuredClone(initialRestForm);
        }

        return {
            amount: (activeTransactionData && formatNumber(activeTransactionData?.amount)) || "0",
            currency: activeTransactionData?.creditor_party?.currency || null,
            creditorFinancialAccount: activeTransactionData?.creditor_party?.financial_account || null,
            creditorReceivedFeeRate: formatNumber(activeTransactionData?.creditor_party?.interest.rate) || "0",
            creditorReceivedFeeAmount: formatNumber(activeTransactionData?.creditor_party?.interest.amount) || "0",
            creditorPaidFeeRate: formatNumber(activeTransactionData?.creditor_party?.cost?.rate) || "0",
            creditorPaidFeeAmount: formatNumber(activeTransactionData?.creditor_party?.cost?.amount) || "0",
            debtorFinancialAccount: activeTransactionData?.debtor_party?.financial_account || null,
            debtorReceivedFeeRate: formatNumber(activeTransactionData?.debtor_party?.interest?.rate) || "0",
            debtorReceivedFeeAmount: formatNumber(activeTransactionData?.debtor_party?.interest?.amount) || "0",
            debtorPaidFeeRate: formatNumber(activeTransactionData?.debtor_party?.cost?.rate) || "0",
            debtorPaidFeeAmount: formatNumber(activeTransactionData?.debtor_party?.cost?.amount) || "0",
        }
    }, [activeTransactionData]);
    const getLockableFormFieldsInitial = useCallback(() => {
        return {
            isCurrencyLocked: false,
            isCreditorFinancialAccountLocked: false,
            isDebtorFinancialAccountLocked: false,
        }
    }, []);
    const getSpecificFormFieldsValidation = useCallback(() => {
        return ({
            amount: Yup.string().required(t('Required')).min(1, t('Amount cannot be empty')),
            currency: Yup.string().required(t('Required')),
            creditorFinancialAccount: Yup.string().required(t('Required')),
            creditorReceivedFeeRate: Yup.string().required(t("Required")),
            creditorReceivedFeeAmount: Yup.string().required(t("Required")),
            creditorPaidFeeRate: Yup.string().required(t("Required")),
            creditorPaidFeeAmount: Yup.string().required(t("Required")),
            debtorFinancialAccount: Yup.string().required(t('Required')),
            debtorReceivedFeeRate: Yup.string().required(t("Required")),
            debtorReceivedFeeAmount: Yup.string().required(t("Required")),
            debtorPaidFeeRate: Yup.string().required(t("Required")),
            debtorPaidFeeAmount: Yup.string().required(t("Required"))
        });
    }, []);
    const getSpecificFormFieldsAfterSubmission = useCallback((createdTransaction: any) => {
        return {
            amount: (createdTransaction && formatNumber(createdTransaction?.amount)) || "0",
            currency: createdTransaction?.creditor_party?.currency || null,
            creditorFinancialAccount: createdTransaction?.creditor_party?.financial_account || null,
            creditorReceivedFeeRate: formatNumber(createdTransaction?.creditor_party?.interest.rate) || "0",
            creditorReceivedFeeAmount: formatNumber(createdTransaction?.creditor_party?.interest.amount) || "0",
            creditorPaidFeeRate: formatNumber(createdTransaction?.creditor_party?.cost?.rate) || "0",
            creditorPaidFeeAmount: formatNumber(createdTransaction?.creditor_party?.cost?.amount) || "0",
            debtorFinancialAccount: createdTransaction?.debtor_party?.financial_account || null,
            debtorReceivedFeeRate: formatNumber(createdTransaction?.debtor_party?.interest?.rate) || "0",
            debtorReceivedFeeAmount: formatNumber(createdTransaction?.debtor_party?.interest?.amount) || "0",
            debtorPaidFeeRate: formatNumber(createdTransaction?.debtor_party?.cost?.rate) || "0",
            debtorPaidFeeAmount: formatNumber(createdTransaction?.debtor_party?.cost?.amount) || "0",
        }
    }, []);
    const getSpecificFormFieldsAfterResetForm = useCallback((inputFormik: any) => {
        return {
            amount: "0",
            currency: inputFormik.values.isCurrencyLocked? inputFormik.values.currency: null,
            creditorFinancialAccount:inputFormik.values.isCreditorFinancialAccountLocked? inputFormik.values.creditorFinancialAccount: null,
            creditorReceivedFeeRate: "0",
            creditorReceivedFeeAmount: "0",
            creditorPaidFeeRate: "0",
            creditorPaidFeeAmount: "0",
            debtorFinancialAccount: inputFormik.values.isDebtorFinancialAccountLocked? inputFormik.values.debtorFinancialAccount: null,
            debtorReceivedFeeRate: "0",
            debtorReceivedFeeAmount: "0",
            debtorPaidFeeRate: "0",
            debtorPaidFeeAmount: "0",
        }
    }, []);
    const getLockableFormFieldsAfterResetForm = useCallback((inputFormik: any) => {
        return {
            isCurrencyLocked: inputFormik.values.isCurrencyLocked,
            isCreditorFinancialAccountLocked: inputFormik.values.isCreditorFinancialAccountLocked,
            isDebtorFinancialAccountLocked: inputFormik.values.isDebtorFinancialAccountLocked,
        };
    }, []);
    const getSpecificTransactionDataForSubmission = useCallback((inputFormik: any) => {
        let data = {
            ...structuredClone(defaultDirectCurrencyTransferFormData),
            debtor_party: structuredClone(defaultDirectCurrencyTransferFormData.debtor_party),
            creditor_party: structuredClone(defaultDirectCurrencyTransferFormData.creditor_party)
        };

        const date = getFormattedDateTime(inputFormik.values.dateTime).date;
        const time = getFormattedDateTime(inputFormik.values.dateTime).time;
        const amount = Number(removeNonNumberChars(inputFormik.values.amount));
        data.amount = amount;
        data.debtor_party.financial_account = inputFormik.values.debtorFinancialAccount;
        data.debtor_party.amount = amount;
        data.debtor_party.currency = inputFormik.values.currency;
        data.debtor_party.date = date;
        data.debtor_party.time = time;
        data.debtor_party.cost.amount = Number(removeNonNumberChars(inputFormik.values.debtorPaidFeeAmount));
        data.debtor_party.cost.rate = Number(removeNonNumberChars(inputFormik.values.debtorPaidFeeRate));
        data.debtor_party.interest.amount = Number(removeNonNumberChars(inputFormik.values.debtorReceivedFeeAmount));
        data.debtor_party.interest.rate = Number(removeNonNumberChars(inputFormik.values.debtorReceivedFeeRate));
        data.debtor_party.description = inputFormik.values.description;
        data.debtor_party.user_specified_id = inputFormik.values.userSpecifiedId;

        data.creditor_party.financial_account = inputFormik.values.creditorFinancialAccount;
        data.creditor_party.amount = amount;
        data.creditor_party.currency = inputFormik.values.currency;
        data.creditor_party.date = date;
        data.creditor_party.time = time;
        data.creditor_party.cost.amount = Number(removeNonNumberChars(inputFormik.values.creditorPaidFeeAmount));
        data.creditor_party.cost.rate = Number(removeNonNumberChars(inputFormik.values.creditorPaidFeeRate));
        data.creditor_party.interest.amount = Number(removeNonNumberChars(inputFormik.values.creditorReceivedFeeAmount));
        data.creditor_party.interest.rate = Number(removeNonNumberChars(inputFormik.values.creditorReceivedFeeRate));
        data.creditor_party.description = inputFormik.values.description;
        data.creditor_party.user_specified_id = inputFormik.values.userSpecifiedId;

        return data;
    },[])

    const {formik} = useTransactionFormik({
        endPointApi: '/transactions/direct-currency-transfer',
        activeTransactionData,
        isParentModalOpen: isOpen,
        getLockableFormFieldsInitial,
        getSpecificFormFieldsInitial,
        getSpecificFormFieldsValidation,
        getSpecificFormFieldsAfterSubmission,
        getSpecificFormFieldsAfterResetForm,
        getLockableFormFieldsAfterResetForm,
        getSpecificTransactionDataForSubmission
    });

    formik.toggleCurrencyLock = useCallback((e: any) => {
        formik.setFieldValue('isCurrencyLocked', !formik.values.isCurrencyLocked);
    }, [formik.values.isCurrencyLocked]);
    formik.toggleCreditorFinancialAccountLock = useCallback((e: any) => {
        formik.setFieldValue('isCreditorFinancialAccountLocked', !formik.values.isCreditorFinancialAccountLocked);
    }, [formik.values.isCreditorFinancialAccountLocked]);
    formik.toggleDebtorFinancialAccountLock = useCallback((e: any) => {
        formik.setFieldValue('isDebtorFinancialAccountLocked', !formik.values.isDebtorFinancialAccountLocked);
    }, [formik.values.isDebtorFinancialAccountLocked]);

    useEffect(() => {
        if(isOpen) return;
        formik.resetFormValues();
    }, [isOpen])

    return (
        <Modal isOpen={isOpen} toggle={toggle} backdrop={"static"} className={'modal-xl'}>
            <ModalHeader className="bg-primary-subtle p-2" toggle={toggle}>
                <h5 className="modal-title">{t("Direct Currency Transfer")}</h5>
            </ModalHeader>
            <ModalBody>
                <Form className={'form-container active'} onSubmit={formik.handleSubmit}>
                    <Container fluid>
                        {!formik.values.isCreate && <TransactionMetaData formik={formik} />}
                        <TransferAmountAndCurrency
                            formik={formik}
                        />

                        <PartyContainer 
                                        party={'creditor'}
                                        headerTitle={t("Creditor")}>
                            <Row>
                                <FormGroup row className='align-items-center'>
                                    {/* Label */}
                                    <Label for={`creditorFinancialAccount`} md={2}>{t("Financial Account")}</Label>

                                    {/* SelectFinancialAccount */}
                                    <Col md={6}>
                                        <SelectFinancialAccount
                                            onSelectFinancialAccount={(acc: FinancialAccount) => formik.setFieldValue(`creditorFinancialAccount`, acc?.id)}
                                            selectedFinancialAccountId={formik.values?.creditorFinancialAccount}
                                            disabled={formik.derivedState.areInputsDisabled}
                                        />
                                    </Col>

                                    {/* Icon */}
                                    <Col md={1}>
                                        <LockInputButton
                                            isLocked={formik.values.isCreditorFinancialAccountLocked}
                                            onClick={formik.toggleCreditorFinancialAccountLock} />
                                    </Col>

                                    {/* Error Message */}
                                    <Col md={3}>
                                        {formik.touched?.creditorFinancialAccount && formik.errors?.creditorFinancialAccount && (
                                            <div className={'text-danger'}>{formik.errors?.creditorFinancialAccount}</div>
                                        )}
                                    </Col>
                                </FormGroup>
                            </Row>
                            <ReceivedPaidFeeContainer formik={formik} prefixName={'creditor'} />
                            <Col md={4}>
                                <FinancialAccountViewDetail
                                    financialAccountId={formik.values?.creditorFinancialAccount}
                                    forceUpdate={formik.values.forceUpdateFinancialAccountsBalance}
                                />
                            </Col>
                        </PartyContainer>


                        <PartyContainer 
                                        party={'debtor'}
                                        headerTitle={t("Debtor")}>
                            <Row>
                                <FormGroup row className='align-items-center'>
                                    {/* Label */}
                                    <Label for={`debtorFinancialAccount`} md={2}>{t("Financial Account")}</Label>

                                    {/* SelectFinancialAccount */}
                                    <Col md={6}>
                                        <SelectFinancialAccount
                                            onSelectFinancialAccount={(acc: FinancialAccount) => formik.setFieldValue(`debtorFinancialAccount`, acc?.id)}
                                            selectedFinancialAccountId={formik.values?.debtorFinancialAccount}
                                            disabled={formik.derivedState.areInputsDisabled}
                                        />
                                    </Col>

                                    {/* Icon */}
                                    <Col md={1}>
                                        <LockInputButton
                                            isLocked={formik.values.isDebtorFinancialAccountLocked}
                                            onClick={formik.toggleDebtorFinancialAccountLock} />
                                    </Col>

                                    {/* Error Message */}
                                    <Col md={3}>
                                        {formik.touched?.[`debtorFinancialAccount`] && formik.errors?.debtorFinancialAccount && (
                                            <div className={'text-danger'}>{formik.errors?.debtorFinancialAccount}</div>
                                        )}
                                    </Col>
                                </FormGroup>
                            </Row>
                            <ReceivedPaidFeeContainer formik={formik} prefixName={'debtor'} />
                            <Col md={4}>
                                <FinancialAccountViewDetail
                                    financialAccountId={formik.values?.debtorFinancialAccount}
                                    forceUpdate={formik.values.forceUpdateFinancialAccountsBalance}
                                />
                            </Col>
                        </PartyContainer>
                        <TransactionDetails formik={formik} />
                        <TransactionFooter formik={formik}/>
                    </Container>
                </Form>
            </ModalBody>
        </Modal>
    );
};

export default DirectCurrencyTransfer
