import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {t} from "i18next";
import {
    DirectCurrencyTransferTransactionFormDataType
} from "../DirectCurrencyTransfer/types";
import {customFormatNumber, removeNonNumberChars} from "../../utils";
import {createLocalizedDate, getUTCFormattedDateTime} from "../../../../helpers/date";
import axiosInstance from "../../../../helpers/axios_instance";
import {toast} from "react-toastify";
import {normalizeDjangoError} from "../../../../helpers/error";
import {BuyAndSellCashFormDataType} from "../BuyAndSellCash/types";
import {LocalPaymentsFormDataType} from "../LocalPayments/types";

interface TransactionFormikProps {
    endPointApi: string;
    activeTransactionData?: DirectCurrencyTransferTransactionFormDataType | BuyAndSellCashFormDataType | LocalPaymentsFormDataType;
    isParentModalOpen: boolean;
    getSpecificFormFieldsInitial: any;
    getLockableFormFieldsInitial?: any;
    getSpecificFormFieldsValidation: any;
    getSpecificFormFieldsAfterResetForm: any;
    getLockableFormFieldsAfterResetForm?: any;
    getSpecificFormFieldsAfterSubmission: any;
    getSpecificTransactionDataForSubmission: any;
}

export const useTransactionFormik = ({ endPointApi, activeTransactionData, isParentModalOpen,
                                         getSpecificFormFieldsInitial,
                                         getLockableFormFieldsInitial,
                                         getSpecificFormFieldsValidation,
                                         getSpecificFormFieldsAfterSubmission,
                                         getSpecificFormFieldsAfterResetForm,
                                         getLockableFormFieldsAfterResetForm,
                                         getSpecificTransactionDataForSubmission}: TransactionFormikProps) => {
    const [lastActiveTransactionData, setLastActiveTransactionData] = useState(activeTransactionData);

    const initialDateTime = useMemo(() => new Date(), []);
    useEffect(() => {
        // for first render in fresh create new document
        if(activeTransactionData || !isParentModalOpen) return;
        fetchAndSetPreviousTransactionId();
    }, [activeTransactionData, isParentModalOpen]);

    useEffect(() => {
        setLastActiveTransactionData(activeTransactionData);
    }, [activeTransactionData]);



    const getCommonTransactionFieldsInitial = useCallback(() => {
        return {
            id: activeTransactionData?.id || undefined,
            description: activeTransactionData?.description || "",
            userSpecifiedId: activeTransactionData?.user_specified_id || "",
            dateTime: (activeTransactionData && createLocalizedDate(activeTransactionData?.date, activeTransactionData?.time)) || initialDateTime,
            createdAt: activeTransactionData?.created_at || undefined,
            createdBy: activeTransactionData?.created_by || undefined,
            isEditing: (!activeTransactionData) && false,
            isDeleting: false,
            isCreate: !activeTransactionData,
            nextTransactionId: activeTransactionData?.next_transaction || undefined,
            previousTransactionId: activeTransactionData?.prev_transaction || undefined,
            forceUpdateFinancialAccountsBalance: false
        }
    }, [activeTransactionData, activeTransactionData, isParentModalOpen]);
    const getCommonTransactionValidationInitial = useCallback(() => {
        return ({
            description: Yup.string(),
            userSpecifiedId: Yup.string(),
            dateTime: Yup.string().required(t("Required")),
        });
    }, []);
    const getInitialValues = useCallback(() => {
        return {
            ...getCommonTransactionFieldsInitial(),
            ...getSpecificFormFieldsInitial(),
            ...getLockableFormFieldsInitial?.(),
        }
    }, [getCommonTransactionFieldsInitial, getSpecificFormFieldsInitial, getLockableFormFieldsInitial]);

    const [validationSchema, setValidationSchema] = useState(
        Yup.object({
            ...getCommonTransactionValidationInitial(),
            ...getSpecificFormFieldsValidation()
        }
    ));

    const formik: any = useFormik({
        enableReinitialize: true,
        initialValues: {...getInitialValues()},
        validationSchema: validationSchema,
        onSubmit: (values: any) => {
            const commonData = {
                id: values?.id,
                date: getUTCFormattedDateTime(values.dateTime).date,
                time: getUTCFormattedDateTime(values.dateTime).time,
                description: values?.description,
                user_specified_id: values?.userSpecifiedId,
            }
            const specificData = getSpecificTransactionDataForSubmission(formik);
            const finalData = {
                ...specificData,
                ...commonData,
            }
            sendCreateTransactionRequest(finalData)
            .then((response: any) => {
                const createdTransaction = response.data;
                formik.setValues({
                    ...getCommonFormFieldsAfterSubmission(createdTransaction),
                    ...getSpecificFormFieldsAfterSubmission(createdTransaction),
                    ...getLockableFormFieldsAfterResetForm?.(formik),
                })
                setLastActiveTransactionData(createdTransaction);
                toast.success(formik.values.isEditing? t("Transaction updated successfully") : t("Transaction created successfully"));
            })
            .catch(error => toast.error(normalizeDjangoError(error)))
            .finally(() => { formik.setSubmitting(false); });
        }
    });
    const sendCreateTransactionRequest = useCallback(async (data: any) => {
         return (formik.values.isEditing? axiosInstance.put(`${endPointApi}/${formik?.values?.id}/`, data): axiosInstance.post(`${endPointApi}/`, data));
    }, [formik, endPointApi]);

    const getCommonFormFieldsAfterSubmission = useCallback((createdTransaction: any) => {
        return {
            id: createdTransaction?.id || undefined,
            createdAt: createdTransaction?.created_at || undefined,
            createdBy: createdTransaction?.created_by || undefined,
            isEditing: false,
            isDeleting: false,
            isCreate: false,
            nextTransactionId: createdTransaction?.next_transaction || undefined,
            previousTransactionId: createdTransaction?.prev_transaction || undefined,
            userSpecifiedId: createdTransaction?.user_specified_id || "",
            dateTime: (createdTransaction && createLocalizedDate(createdTransaction?.date, createdTransaction?.time)) || initialDateTime,
            forceUpdateFinancialAccountsBalance: !formik.values.forceUpdateFinancialAccountsBalance,
            description: createdTransaction?.description || "",
        }
    }, []);

    useEffect(() => {
        setValidationSchema(Yup.object({
            ...getCommonTransactionValidationInitial(),
            ...getSpecificFormFieldsValidation(formik.values)
        }));
    }, [formik.values])

    const fetchAndSetPreviousTransactionId = useCallback(() => {
        axiosInstance.get(`${endPointApi}/last-transaction/`)
            .then(response => {formik.setFieldValue('previousTransactionId', response.data)})
            .catch(error => console.error(error));
    }, [formik])

    // Add derivedState directly to formik
    Object.defineProperty(formik, 'derivedState', {
        get: () => ({
            areInputsDisabled: !formik.values.isCreate && !formik.values.isEditing,
        }),
    });

    formik.loadTransaction = useCallback((transactionId: number) => {
        axiosInstance.get(`${endPointApi}/${transactionId}/`)
            .then(response => {
                const loadedTransaction: DirectCurrencyTransferTransactionFormDataType = response.data;
                formik.setValues({
                    ...getCommonFormFieldsAfterSubmission(loadedTransaction),
                    ...getSpecificFormFieldsAfterSubmission(loadedTransaction),
                    ...getLockableFormFieldsInitial?.(),
                })
                setLastActiveTransactionData(response.data)
            })
            .catch(error => {
                console.error(error);
            })
    }, [])

    const getCommonFormFieldsAfterResetForm = useCallback(() => {
        return {
            id: undefined,
            isEditing: false,
            isDeleting: false,
            isCreate: true,
            nextTransactionId: null,
            previousTransactionId: null,
            forceUpdateFinancialAccountsBalance: formik.values.forceUpdateFinancialAccountsBalance,
            description: "",
            userSpecifiedId: "",
            dateTime: initialDateTime,
        }
    }, [formik])
    formik.resetFormValues = useCallback(async () => {
        formik.setValues({
            ...getCommonFormFieldsAfterResetForm(),
            ...getSpecificFormFieldsAfterResetForm(formik),
            ...getLockableFormFieldsAfterResetForm?.(formik),
        });
        fetchAndSetPreviousTransactionId();
    }, [formik]);

    formik.flushFormValues = useCallback(async () => {
        formik.setValues({
            ...getCommonFormFieldsAfterResetForm(),
            ...getSpecificFormFieldsInitial(formik),
            ...getLockableFormFieldsInitial?.(formik),
        });
    }, [formik]);

    formik.handleClickEditTransaction = useCallback(async () => {
        if(formik.values.isEditing) {
            formik.setValues({
                ...getCommonFormFieldsAfterSubmission(lastActiveTransactionData),
                ...getSpecificFormFieldsAfterSubmission(lastActiveTransactionData),
                ...getLockableFormFieldsAfterResetForm?.(formik),
            })
        }
        formik.setFieldValue("isEditing", !formik.values.isEditing)

    }, [formik]);
    formik.handleClickNewDocument = useCallback(async () => {
        formik.setFieldValue('isCreate', true);
        formik.resetFormValues();
    }, [formik]);
    formik.handleDeleteTransaction = () => {
        if(!formik.values?.id) return;

        formik.setFieldValue('isDeleting', true);
        axiosInstance.delete(`${endPointApi}/${formik?.values?.id}/`)
            .then(response => {
                formik.resetFormValues();
            })
            .catch(error => {})
            .finally(() => {formik.setFieldValue('isDeleting', false);});
    };
    formik.handleNumberInputChange = (name: string, value: string) => {
        formik.setFieldValue(name, customFormatNumber(value));
    };

    return {
        formik
    }
}