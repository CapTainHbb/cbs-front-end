import React, {useCallback, useEffect} from 'react'
import {
    Container,
    Form,
    Modal,
    ModalBody,
    ModalHeader,
} from 'reactstrap';
import {t} from "i18next";
import TransactionDetails from "../TransactionDetails";
import PartyContainer from "../PartyContainer";
import TransferAmountAndCurrency from "./TransferAmountAndCurrency";
import {ToastContainer} from "react-toastify";
import {defaultDirectCurrencyTransferFormData, DirectCurrencyTransferTransaction} from "./types";
import TransactionFooter from "../TransactionFooter";
import TransactionMetaData from '../TransactionMetaData';
import {useTransactionFormik} from "./hooks/useTransactionFormik";
import {formatNumber} from "../../../Reports/utils";
import * as Yup from "yup";
import {removeNonNumberChars} from "../../utils";
import {getFormattedDateTime} from "../../../../helpers/date";

interface Props {
    isOpen: boolean;
    toggle: any;
    activeTransactionData?: DirectCurrencyTransferTransaction;
}

const CreateDirectCurrencyTransfer: React.FC<Props> = ({ isOpen, toggle, activeTransactionData }) => {

    const getSpecificFormFieldsInitial = useCallback(() => {
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
    const getLockableFormFieldsAfterSubmission = useCallback((inputFormik: any) => {
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
        getLockableFormFieldsAfterSubmission,
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
                        <TransferAmountAndCurrency formik={formik} />
                        <PartyContainer formik={formik}
                                        party={'creditor'}
                                        headerTitle={t("Creditor")} />

                        <PartyContainer formik={formik}
                                        party={'debtor'}
                                        headerTitle={t("Debtor")} />
                        <TransactionDetails formik={formik} />
                        <TransactionFooter formik={formik}/>
                    </Container>
                </Form>
            </ModalBody>
            <ToastContainer autoClose={2000} closeButton={false} limit={1} />
        </Modal>
    );
};

export default CreateDirectCurrencyTransfer
