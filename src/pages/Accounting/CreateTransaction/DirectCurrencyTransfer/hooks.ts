import React, {useCallback, useMemo} from "react";
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
    setActiveTransactionData: any;
}

export const useTransactionFormik = ({ endPointApi, activeTransactionData, setActiveTransactionData }: TransactionFormikProps) => {
    const initialDateTime = useMemo(() => new Date(), []);

    const formik: any = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: activeTransactionData?.id || undefined,
            isEditing: (!activeTransactionData) && false,
            isDeleting: false,
            isCreate: !activeTransactionData,
            amount: (activeTransactionData && formatNumber(activeTransactionData?.amount)) || 0,
            currency: activeTransactionData?.creditor_party?.currency || null,
            creditorFinancialAccount: activeTransactionData?.creditor_party?.financial_account || null,
            creditorReceivedFeeRate: formatNumber(activeTransactionData?.creditor_party?.interest.rate) || 0,
            creditorReceivedFeeAmount: formatNumber(activeTransactionData?.creditor_party?.interest.amount) || 0,
            creditorPaidFeeRate: formatNumber(activeTransactionData?.creditor_party?.cost?.rate) || 0,
            creditorPaidFeeAmount: formatNumber(activeTransactionData?.creditor_party?.cost?.amount) || 0,
            debtorFinancialAccount: activeTransactionData?.debtor_party?.financial_account || null,
            debtorReceivedFeeRate: formatNumber(activeTransactionData?.debtor_party?.interest?.rate) || 0,
            debtorReceivedFeeAmount: formatNumber(activeTransactionData?.debtor_party?.interest?.amount) || 0,
            debtorPaidFeeRate: formatNumber(activeTransactionData?.debtor_party?.cost?.rate) || 0,
            debtorPaidFeeAmount: formatNumber(activeTransactionData?.debtor_party?.cost?.amount) || 0,
            description: activeTransactionData?.debtor_party?.description || "",
            userSpecifiedId: activeTransactionData?.debtor_party?.user_specified_id || "",
            dateTime: (activeTransactionData && createDate(activeTransactionData?.date, activeTransactionData?.time)) || initialDateTime,
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
                ...structuredClone(defaultDirectCurrencyTransferFormData)
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
            formValues.debtor_party.cost.amount = values.debtorPaidFeeAmount;
            formValues.debtor_party.cost.rate = values.debtorPaidFeeRate;
            formValues.debtor_party.interest.amount = values.debtorReceivedFeeAmount;
            formValues.debtor_party.interest.rate = values.debtorReceivedFeeRate;
            formValues.debtor_party.description = values.description;
            formValues.debtor_party.user_specified_id = values.userSpecifiedId;

            formValues.creditor_party.financial_account = values.creditorFinancialAccount;
            formValues.creditor_party.amount = amount;
            formValues.creditor_party.currency = values.currency
            formValues.creditor_party.date = date;
            formValues.creditor_party.time = time;
            formValues.creditor_party.cost.amount = values.creditorPaidFeeAmount;
            formValues.creditor_party.cost.rate = values.creditorPaidFeeRate;
            formValues.creditor_party.interest.amount = values.creditorReceivedFeeAmount;
            formValues.creditor_party.interest.rate = values.creditorReceivedFeeRate;
            formValues.creditor_party.description = values.description;
            formValues.creditor_party.user_specified_id = values.userSpecifiedId;
            handleSubmitTransaction(formValues);
        }
    });

    // Add derivedState directly to formik
    Object.defineProperty(formik, 'derivedState', {
        get: () => ({
            areInputsDisabled: !formik.values.isCreate && !formik.values.isEditing,
        }),
    });

    const handleSubmitTransaction = useCallback(async (data: any) => {
        try {
            await formik.values.isEditing? axiosInstance.put(`${endPointApi}${formik?.values?.id}/`, data): axiosInstance.post(endPointApi, data);
            toast.success(formik.values.isEditing? t("Transaction updated successfully") : t("Transaction created successfully"));
        } catch (error) {
            toast.error(normalizeDjangoError(error));
        }
    }, [formik, endPointApi]);

    formik.handleClickNewDocument = useCallback(async () => {
        formik.setFieldValue('isCreate', true);
        setActiveTransactionData(undefined);
    }, [setActiveTransactionData]);

    formik.handleDeleteTransaction = () => {
        if(!formik.values?.id) return;

        formik.setFieldValue('isDeleting', true);
        axiosInstance.delete(`/transactions/direct-currency-transfer/${formik?.values?.id}/`)
            .then(response => {
                setActiveTransactionData(undefined);
            })
            .catch(error => {})
            .finally(() => {formik.setFieldValue('isDeleting', false);});
    };

    const handleNumberInputChange = (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(name, customFormatNumber(e.target.value));
    };

    return {
        formik, handleNumberInputChange
    }
}