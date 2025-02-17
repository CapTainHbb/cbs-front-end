import React, {useCallback, useEffect, useMemo} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {t} from "i18next";
import {defaultDirectCurrencyTransferFormData, DirectCurrencyTransferTransaction} from "./types";
import {customFormatNumber, removeNonNumberChars} from "../../utils";
import {createDate, getFormattedDateTime} from "../../../../helpers/date";
import axiosInstance from "../../../../helpers/axios_instance";
import {toast} from "react-toastify";
import {normalizeDjangoError} from "../../../../helpers/error";
import {formatNumber} from "../../../Reports/utils";

interface TransactionFormikProps {
    endPointApi: string;
    activeTransactionData?: DirectCurrencyTransferTransaction;
    isParentModalOpen: boolean;
}

export const useTransactionFormik = ({ endPointApi, activeTransactionData, isParentModalOpen }: TransactionFormikProps) => {
    const initialDateTime = useMemo(() => new Date(), []);

    const formik: any = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: activeTransactionData?.id || undefined,
            createdAt: activeTransactionData?.created_at || undefined,
            createdBy: activeTransactionData?.created_by || undefined,
            isEditing: (!activeTransactionData) && false,
            isDeleting: false,
            isCreate: !activeTransactionData,
            amount: (activeTransactionData && formatNumber(activeTransactionData?.amount)) || "0",
            currency: activeTransactionData?.creditor_party?.currency || null,
            isCurrencyLocked: false,
            creditorFinancialAccount: activeTransactionData?.creditor_party?.financial_account || null,
            isCreditorFinancialAccountLocked: false,
            creditorReceivedFeeRate: formatNumber(activeTransactionData?.creditor_party?.interest.rate) || "0",
            creditorReceivedFeeAmount: formatNumber(activeTransactionData?.creditor_party?.interest.amount) || "0",
            creditorPaidFeeRate: formatNumber(activeTransactionData?.creditor_party?.cost?.rate) || "0",
            creditorPaidFeeAmount: formatNumber(activeTransactionData?.creditor_party?.cost?.amount) || "0",
            debtorFinancialAccount: activeTransactionData?.debtor_party?.financial_account || null,
            isDebtorFinancialAccountLocked: false,
            debtorReceivedFeeRate: formatNumber(activeTransactionData?.debtor_party?.interest?.rate) || "0",
            debtorReceivedFeeAmount: formatNumber(activeTransactionData?.debtor_party?.interest?.amount) || "0",
            debtorPaidFeeRate: formatNumber(activeTransactionData?.debtor_party?.cost?.rate) || "0",
            debtorPaidFeeAmount: formatNumber(activeTransactionData?.debtor_party?.cost?.amount) || "0",
            description: activeTransactionData?.debtor_party?.description || "",
            userSpecifiedId: activeTransactionData?.debtor_party?.user_specified_id || "",
            dateTime: (activeTransactionData && createDate(activeTransactionData?.date, activeTransactionData?.time)) || initialDateTime,
            nextTransactionId: activeTransactionData?.next_transaction || undefined,
            previousTransactionId: activeTransactionData?.prev_transaction || undefined,
            forceUpdateFinancialAccountsBalance: false,
        },
        validationSchema:Yup.object({
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
            debtorPaidFeeAmount: Yup.string().required(t("Required")),
            description: Yup.string(),
            userSpecifiedId: Yup.string(),
            dateTime: Yup.string().required(t("Required")),
        }),
        onSubmit: (values: any) => {
            let formValues = {
                ...structuredClone(defaultDirectCurrencyTransferFormData),
                debtor_party: structuredClone(defaultDirectCurrencyTransferFormData.debtor_party),
                creditor_party: structuredClone(defaultDirectCurrencyTransferFormData.creditor_party)
            };
            
            const amount = Number(removeNonNumberChars(values.amount));
            const date = getFormattedDateTime(values.dateTime).date;
            const time = getFormattedDateTime(values.dateTime).time;

            formValues.id = values?.id;
            formValues.amount = amount
            formValues.date = date;
            formValues.time = time;
            formValues.description = values.description;
            formValues.user_specified_id = values.userSpecifiedId;

            formValues.debtor_party.financial_account = values.debtorFinancialAccount;
            formValues.debtor_party.amount = amount;
            formValues.debtor_party.currency = values.currency
            formValues.debtor_party.date = date;
            formValues.debtor_party.time = time;
            formValues.debtor_party.cost.amount = Number(removeNonNumberChars(values.debtorPaidFeeAmount));
            formValues.debtor_party.cost.rate = Number(removeNonNumberChars(values.debtorPaidFeeRate));
            formValues.debtor_party.interest.amount = Number(removeNonNumberChars(values.debtorReceivedFeeAmount));
            formValues.debtor_party.interest.rate = Number(removeNonNumberChars(values.debtorReceivedFeeRate));
            formValues.debtor_party.description = values.description;
            formValues.debtor_party.user_specified_id = values.userSpecifiedId;

            formValues.creditor_party.financial_account = values.creditorFinancialAccount;
            formValues.creditor_party.amount = amount;
            formValues.creditor_party.currency = values.currency
            formValues.creditor_party.date = date;
            formValues.creditor_party.time = time;
            formValues.creditor_party.cost.amount = Number(removeNonNumberChars(values.creditorPaidFeeAmount));
            formValues.creditor_party.cost.rate = Number(removeNonNumberChars(values.creditorPaidFeeRate));
            formValues.creditor_party.interest.amount = Number(removeNonNumberChars(values.creditorReceivedFeeAmount));
            formValues.creditor_party.interest.rate = Number(removeNonNumberChars(values.creditorReceivedFeeRate));
            formValues.creditor_party.description = values.description;
            formValues.creditor_party.user_specified_id = values.userSpecifiedId;

            handleSubmitTransaction(formValues);
        }
    });

    useEffect(() => {
        if(activeTransactionData || !isParentModalOpen) return;

        axiosInstance.get("/transactions/direct-currency-transfer/last-transaction/")
        .then(response => {formik.setFieldValue('previousTransactionId', response.data)})
        .catch(error => console.error(error));
    }, [activeTransactionData, isParentModalOpen])

    // Add derivedState directly to formik
    Object.defineProperty(formik, 'derivedState', {
        get: () => ({
            areInputsDisabled: !formik.values.isCreate && !formik.values.isEditing,
        }),
    });

    const handleSubmitTransaction = useCallback(async (data: any) => {
        
        try {
            const response = await (formik.values.isEditing? axiosInstance.put(`${endPointApi}${formik?.values?.id}/`, data): axiosInstance.post(endPointApi, data));
            const createdTransaction = response.data;
            formik.setValues({
                id: createdTransaction?.id || undefined,
                createdAt: createdTransaction?.created_at || undefined,
                createdBy: createdTransaction?.created_by || undefined,
                isEditing: false,
                isDeleting: false,
                isCreate: false,
                amount: (createdTransaction && formatNumber(createdTransaction?.amount)) || 0,
                currency: createdTransaction?.creditor_party?.currency || null,
                isCurrencyLocked: formik.values.isCurrencyLocked,
                creditorFinancialAccount: createdTransaction?.creditor_party?.financial_account || null,
                isCreditorFinancialAccountLocked: formik.values.isCreditorFinancialAccountLocked,
                creditorReceivedFeeRate: formatNumber(createdTransaction?.creditor_party?.interest.rate) || 0,
                creditorReceivedFeeAmount: formatNumber(createdTransaction?.creditor_party?.interest.amount) || 0,
                creditorPaidFeeRate: formatNumber(createdTransaction?.creditor_party?.cost?.rate) || 0,
                creditorPaidFeeAmount: formatNumber(createdTransaction?.creditor_party?.cost?.amount) || 0,
                debtorFinancialAccount: createdTransaction?.debtor_party?.financial_account || null,
                isDebtorFinancialAccountLocked: formik.values.isDebtorFinancialAccountLocked,
                debtorReceivedFeeRate: formatNumber(createdTransaction?.debtor_party?.interest?.rate) || 0,
                debtorReceivedFeeAmount: formatNumber(createdTransaction?.debtor_party?.interest?.amount) || 0,
                debtorPaidFeeRate: formatNumber(createdTransaction?.debtor_party?.cost?.rate) || 0,
                debtorPaidFeeAmount: formatNumber(createdTransaction?.debtor_party?.cost?.amount) || 0,
                description: createdTransaction?.debtor_party?.description || "",
                userSpecifiedId: createdTransaction?.debtor_party?.user_specified_id || "",
                dateTime: (createdTransaction && createDate(createdTransaction?.date, createdTransaction?.time)) || initialDateTime,
                nextTransactionId: createdTransaction?.next_transaction || undefined,
                previousTransactionId: createdTransaction?.prev_transaction || undefined,
                forceUpdateFinancialAccountsBalance: !formik.values.forceUpdateFinancialAccountsBalance,                
            })
            toast.success(formik.values.isEditing? t("Transaction updated successfully") : t("Transaction created successfully"));
            
        } catch (error) {
            toast.error(normalizeDjangoError(error));
        }
        formik.setSubmitting(false);

    }, [formik, endPointApi]);

    formik.handleClickEditTransaction = useCallback(async () => {
        formik.setFieldValue("isEditing", !formik.values.isEditing)
    }, [formik]);

    const fetchLastTransactionId = useCallback(async () => {
        try {
            const result = await axiosInstance.get('/transactions/direct-currency-transfer/last-transaction/')
            return result.data;
        } catch(error) {
            console.error(error);
        }
    }, [])

    formik.resetFormValues = useCallback(async () => {
        formik.setValues({
            id: undefined,
            isEditing: false,
            isDeleting: false,
            isCreate: true,
            amount: "0",
            currency: formik.values.isCurrencyLocked? formik.values.currency: null,
            isCurrencyLocked: formik.values.isCurrencyLocked,
            creditorFinancialAccount:formik.values.isCreditorFinancialAccountLocked? formik.values.creditorFinancialAccount: null,
            isCreditorFinancialAccountLocked: formik.values.isCreditorFinancialAccountLocked,
            creditorReceivedFeeRate: "0",
            creditorReceivedFeeAmount: "0",
            creditorPaidFeeRate: "0",
            creditorPaidFeeAmount: "0",
            debtorFinancialAccount: formik.values.isDebtorFinancialAccountLocked? formik.values.debtorFinancialAccount: null,
            isDebtorFinancialAccountLocked: formik.values.isDebtorFinancialAccountLocked,
            debtorReceivedFeeRate: "0",
            debtorReceivedFeeAmount: "0",
            debtorPaidFeeRate: "0",
            debtorPaidFeeAmount: "0",
            description: "",
            userSpecifiedId: "",
            dateTime: initialDateTime,
            nextTransactionId: null,
            previousTransactionId: await fetchLastTransactionId(),
            forceUpdateFinancialAccountsBalance: formik.values.forceUpdateFinancialAccountsBalance,
        });
    }, [formik]);

    formik.handleClickNewDocument = useCallback(async () => {
        formik.setFieldValue('isCreate', true);
        formik.resetFormValues();
    }, [formik]);

    formik.handleDeleteTransaction = () => {
        if(!formik.values?.id) return;

        formik.setFieldValue('isDeleting', true);
        axiosInstance.delete(`/transactions/direct-currency-transfer/${formik?.values?.id}/`)
            .then(response => {
                formik.resetFormValues();
            })
            .catch(error => {})
            .finally(() => {formik.setFieldValue('isDeleting', false);});
    };

    formik.loadTransaction = useCallback((transactionId: number) => {
        axiosInstance.get(`/transactions/direct-currency-transfer/${transactionId}/`)
        .then(response => {
            const loadedTransaction: DirectCurrencyTransferTransaction = response.data; 
            formik.setValues({
                id: loadedTransaction?.id,
                createdAt: loadedTransaction?.created_at || undefined,
                createdBy: loadedTransaction?.created_by || undefined,
                isEditing: false,
                isDeleting: false,
                isCreate: false,
                amount: formatNumber(loadedTransaction?.amount),
                currency: loadedTransaction?.creditor_party?.currency,
                creditorFinancialAccount:loadedTransaction?.creditor_party?.financial_account,
                creditorReceivedFeeRate: loadedTransaction?.creditor_party?.interest?.rate,
                creditorReceivedFeeAmount: loadedTransaction?.creditor_party?.interest?.amount,
                creditorPaidFeeRate: loadedTransaction?.creditor_party?.cost?.rate,
                creditorPaidFeeAmount: loadedTransaction?.creditor_party?.cost?.amount,
                debtorFinancialAccount: loadedTransaction?.debtor_party?.financial_account,
                debtorReceivedFeeRate: loadedTransaction?.debtor_party?.interest?.rate,
                debtorReceivedFeeAmount: loadedTransaction?.debtor_party?.interest?.amount,
                debtorPaidFeeRate: loadedTransaction?.debtor_party?.cost?.rate,
                debtorPaidFeeAmount: loadedTransaction?.debtor_party?.cost?.amount,
                description: loadedTransaction?.debtor_party?.description,
                userSpecifiedId: loadedTransaction?.debtor_party?.user_specified_id,
                dateTime: createDate(loadedTransaction?.debtor_party?.date, loadedTransaction?.debtor_party?.time),
                nextTransactionId: loadedTransaction?.next_transaction,
                previousTransactionId: loadedTransaction?.prev_transaction,
            })
        })
        .catch(error => {
            console.error(error);
        })
    }, [])

    formik.handleNumberInputChange = (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(name, customFormatNumber(e.target.value));
    };

    formik.toggleCurrencyLock = useCallback((e: any) => {
        formik.setFieldValue('isCurrencyLocked', !formik.values.isCurrencyLocked);
    }, [formik.values.isCurrencyLocked]);

    formik.toggleCreditorFinancialAccountLock = useCallback((e: any) => {
        formik.setFieldValue('isCreditorFinancialAccountLocked', !formik.values.isCreditorFinancialAccountLocked);
    }, [formik.values.isCreditorFinancialAccountLocked]); 

    formik.toggleDebtorFinancialAccountLock = useCallback((e: any) => {
        formik.setFieldValue('isDebtorFinancialAccountLocked', !formik.values.isDebtorFinancialAccountLocked);
    }, [formik.values.isDebtorFinancialAccountLocked]); 

    return {
        formik
    }
}