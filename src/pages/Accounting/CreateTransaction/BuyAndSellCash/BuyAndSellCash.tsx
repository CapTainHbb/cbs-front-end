import React, {useCallback} from 'react';
import {Container, Form, Modal, ModalBody, ModalHeader} from "reactstrap";
import {t} from "i18next";
import TransactionMetaData from "../TransactionMetaData";
import TransactionDetails from "../TransactionDetails";
import TransactionFooter from "../TransactionFooter";
import {useTransactionFormik} from "../hooks/useTransactionFormik";
import {BuyAndSellCashFormDataType, defaultBuyAndSellCashFormData} from "./types";
import {formatNumber} from "../../../Reports/utils";
import * as Yup from "yup";
import {getFormattedDateTime} from "../../../../helpers/date";
import {removeNonNumberChars} from "../../utils";

interface Props {
    isOpen: boolean;
    toggle: any;
    activeTransactionData?: BuyAndSellCashFormDataType;
}

const BuyAndSellCash: React.FC<Props> = ({ isOpen, toggle, activeTransactionData }) => {

    const getSpecificFormFieldsInitial = useCallback(() => {
        return {
            isBuy: activeTransactionData?.is_buy || false,
            exchangeRate: (activeTransactionData && formatNumber(activeTransactionData?.exchange_rate)) || "0",
            baseCurrency: activeTransactionData?.creditor_party?.currency || null,
            againstCurrency: activeTransactionData?.debtor_party?.currency || null,
            financialAccount: activeTransactionData?.creditor_party?.financial_account || null,
            baseReceivedFeeRate: formatNumber(activeTransactionData?.creditor_party?.interest.rate) || "0",
            baseReceivedFeeAmount: formatNumber(activeTransactionData?.creditor_party?.interest.amount) || "0",
            basePaidFeeRate: formatNumber(activeTransactionData?.creditor_party?.cost?.rate) || "0",
            basePaidFeeAmount: formatNumber(activeTransactionData?.creditor_party?.cost?.amount) || "0",
            againstReceivedFeeRate: formatNumber(activeTransactionData?.debtor_party?.interest?.rate) || "0",
            againstReceivedFeeAmount: formatNumber(activeTransactionData?.debtor_party?.interest?.amount) || "0",
            againstPaidFeeRate: formatNumber(activeTransactionData?.debtor_party?.cost?.rate) || "0",
            againstPaidFeeAmount: formatNumber(activeTransactionData?.debtor_party?.cost?.amount) || "0",
        }
    }, [activeTransactionData]);
    const getLockableFormFieldsInitial = useCallback(() => {
        return {
            isBaseCurrencyLocked: false,
            isAgainstCurrencyLocked: false,
            isFinancialAccountLocked: false,
            isIsBuyLocked: false,
        }
    }, []);
    const getSpecificFormFieldsValidation = useCallback(() => {
        return ({
            isBuy: Yup.boolean().required(t('Required')),
            exchangeRate: Yup.string().required(t('Required')),
            baseCurrency: Yup.string().required(t('Required')),
            againstCurrency: Yup.string().required(t('Required')),
            financialAccount: Yup.string().required(t('Required')),
            baseReceivedFeeRate: Yup.string().required(t("Required")),
            baseReceivedFeeAmount: Yup.string().required(t("Required")),
            basePaidFeeRate: Yup.string().required(t("Required")),
            basePaidFeeAmount: Yup.string().required(t("Required")),
            againstReceivedFeeRate: Yup.string().required(t("Required")),
            againstReceivedFeeAmount: Yup.string().required(t("Required")),
            againstPaidFeeRate: Yup.string().required(t("Required")),
            againstPaidFeeAmount: Yup.string().required(t("Required"))
        });
    }, []);
    const getSpecificFormFieldsAfterSubmission = useCallback((createdTransaction: any) => {
        return {
            isBuy: createdTransaction?.isBuy || false,
            baseCurrency: createdTransaction?.creditor_party?.currency || null,
            financialAccount: createdTransaction?.creditor_party?.financial_account || null,
            baseReceivedFeeRate: formatNumber(createdTransaction?.creditor_party?.interest.rate) || "0",
            baseReceivedFeeAmount: formatNumber(createdTransaction?.creditor_party?.interest.amount) || "0",
            basePaidFeeRate: formatNumber(createdTransaction?.creditor_party?.cost?.rate) || "0",
            basePaidFeeAmount: formatNumber(createdTransaction?.creditor_party?.cost?.amount) || "0",
            againstReceivedFeeRate: formatNumber(createdTransaction?.debtor_party?.interest?.rate) || "0",
            againstReceivedFeeAmount: formatNumber(createdTransaction?.debtor_party?.interest?.amount) || "0",
            againstPaidFeeRate: formatNumber(createdTransaction?.debtor_party?.cost?.rate) || "0",
            againstPaidFeeAmount: formatNumber(createdTransaction?.debtor_party?.cost?.amount) || "0",
        }
    }, []);
    const getSpecificFormFieldsAfterResetForm = useCallback((inputFormik: any) => {
        return {
            isBuy: inputFormik.values.isIsBuyLocked? inputFormik.values.isBuy: false,
            baseCurrency: inputFormik.values.isBaseCurrencyLocked? inputFormik.values.baseCurrency: null,
            againstCurrency: inputFormik.values.isAgainstCurrencyLocked? inputFormik.values.againstCurrency: null,
            financialAccount:inputFormik.values.isFinancialAccountLocked? inputFormik.values.financialAccount: null,
            baseReceivedFeeRate: "0",
            baseReceivedFeeAmount: "0",
            basePaidFeeRate: "0",
            basePaidFeeAmount: "0",
            againstReceivedFeeRate: "0",
            againstReceivedFeeAmount: "0",
            againstPaidFeeRate: "0",
            againstPaidFeeAmount: "0",
        }
    }, []);
    const getLockableFormFieldsAfterResetForm = useCallback((inputFormik: any) => {
        return {
            isIsBuyLocked: inputFormik.values.isIsBuyLocked,
            isFinancialAccountLocked: inputFormik.values.isFinancialAccountLocked,
            isBaseCurrencyLocked: inputFormik.values.isBaseCurrencyLocked,
            isAgainstCurrencyLocked: inputFormik.values.isAgainstCurrencyLocked,
        };
    }, []);
    const getSpecificTransactionDataForSubmission = useCallback((inputFormik: any) => {
        let data = {
            ...structuredClone(defaultBuyAndSellCashFormData),
            debtor_party: structuredClone(defaultBuyAndSellCashFormData.debtor_party),
            creditor_party: structuredClone(defaultBuyAndSellCashFormData.creditor_party)
        };

        // const date = getFormattedDateTime(inputFormik.values.dateTime).date;
        // const time = getFormattedDateTime(inputFormik.values.dateTime).time;
        // const amount = Number(removeNonNumberChars(inputFormik.values.amount));
        // data.amount = amount;
        // data.debtor_party.financial_account = inputFormik.values.debtorFinancialAccount;
        // data.debtor_party.amount = amount;
        // data.debtor_party.currency = inputFormik.values.currency;
        // data.debtor_party.date = date;
        // data.debtor_party.time = time;
        // data.debtor_party.cost.amount = Number(removeNonNumberChars(inputFormik.values.debtorPaidFeeAmount));
        // data.debtor_party.cost.rate = Number(removeNonNumberChars(inputFormik.values.debtorPaidFeeRate));
        // data.debtor_party.interest.amount = Number(removeNonNumberChars(inputFormik.values.debtorReceivedFeeAmount));
        // data.debtor_party.interest.rate = Number(removeNonNumberChars(inputFormik.values.debtorReceivedFeeRate));
        // data.debtor_party.description = inputFormik.values.description;
        // data.debtor_party.user_specified_id = inputFormik.values.userSpecifiedId;
        //
        // data.creditor_party.financial_account = inputFormik.values.creditorFinancialAccount;
        // data.creditor_party.amount = amount;
        // data.creditor_party.currency = inputFormik.values.currency;
        // data.creditor_party.date = date;
        // data.creditor_party.time = time;
        // data.creditor_party.cost.amount = Number(removeNonNumberChars(inputFormik.values.creditorPaidFeeAmount));
        // data.creditor_party.cost.rate = Number(removeNonNumberChars(inputFormik.values.creditorPaidFeeRate));
        // data.creditor_party.interest.amount = Number(removeNonNumberChars(inputFormik.values.creditorReceivedFeeAmount));
        // data.creditor_party.interest.rate = Number(removeNonNumberChars(inputFormik.values.creditorReceivedFeeRate));
        // data.creditor_party.description = inputFormik.values.description;
        // data.creditor_party.user_specified_id = inputFormik.values.userSpecifiedId;

        return data;
    },[])

    const {formik} = useTransactionFormik({
        endPointApi: '/transactions/buy-and-sell-cash',
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

    return (
        <Modal isOpen={isOpen} toggle={toggle} backdrop={"static"} className={'modal-xl'}>
            <ModalHeader className="bg-primary-subtle p-2" toggle={toggle}>
                <h5 className="modal-title">{t("Direct Currency Transfer")}</h5>
            </ModalHeader>
            <ModalBody>
                <Form className={'form-container active'} onSubmit={formik.handleSubmit}>
                    <Container fluid>
                        {!formik.values.isCreate && <TransactionMetaData formik={formik} />}

                        <TransactionDetails formik={formik} />
                        <TransactionFooter formik={formik}/>
                    </Container>
                </Form>
            </ModalBody>
        </Modal>
    );
};

export default BuyAndSellCash;