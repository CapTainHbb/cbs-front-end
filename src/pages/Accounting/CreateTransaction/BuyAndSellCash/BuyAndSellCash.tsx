import React, {useCallback, useEffect} from 'react';
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
import SelectFinancialAccountAndTradeType from './SelectFinancialAccountAndTradeType';
import ExchangeRateAndConversionType from './ExchangeRateAndConversionType';
import PartyContainer from "../PartyContainer";
import ReceivedPaidFeeContainer from "../ReceivedPaidFeeContainer";
import BuyAndSellAmountAndCurrency from "./BuyAndSellAmountAndCurrency";

const initialResetForm = {
    isBuy: false,
    exchangeRate: "0",
    conversionType: "multiplication",
    financialAccount: null,
    baseCurrency: null,
    baseAmount: "0",
    baseReceivedFeeRate: "0",
    baseReceivedFeeAmount: "0",
    basePaidFeeRate: "0",
    basePaidFeeAmount: "0",
    againstCurrency: null,
    againstAmount: "0",
    againstReceivedFeeRate: "0",
    againstReceivedFeeAmount: "0",
    againstPaidFeeRate: "0",
    againstPaidFeeAmount: "0",
}

interface Props {
    isOpen: boolean;
    toggle: any;
    activeTransactionData?: BuyAndSellCashFormDataType;
}

const BuyAndSellCash: React.FC<Props> = ({ isOpen, toggle, activeTransactionData }) => {
    const getSpecificFormFieldsInitial = useCallback(() => {
        if(activeTransactionData?.transaction_type !== 'buy-and-sell-cash') {
            return structuredClone(initialResetForm);
        }

        const isBuy = activeTransactionData?.is_buy || false;
        const baseParty = isBuy? "debtor": "creditor";
        const againstParty = isBuy? "creditor": "debtor";
        return {
            isBuy: isBuy,
            conversionType: activeTransactionData?.conversion_type || "multiplication",
            exchangeRate: (activeTransactionData && formatNumber(activeTransactionData?.exchange_rate)) || "0",
            financialAccount: activeTransactionData?.creditor_party?.financial_account || null,
            baseCurrency: activeTransactionData?.[`${baseParty}_party`]?.currency || null,
            baseAmount: formatNumber(activeTransactionData?.[`${baseParty}_party`]?.amount) || "0",
            baseReceivedFeeRate: formatNumber(activeTransactionData?.[`${baseParty}_party`]?.interest.rate) || "0",
            baseReceivedFeeAmount: formatNumber(activeTransactionData?.[`${baseParty}_party`]?.interest.amount) || "0",
            basePaidFeeRate: formatNumber(activeTransactionData?.[`${baseParty}_party`]?.cost?.rate) || "0",
            basePaidFeeAmount: formatNumber(activeTransactionData?.[`${baseParty}_party`]?.cost?.amount) || "0",
            againstCurrency: activeTransactionData?.[`${againstParty}_party`]?.currency || null,
            againstAmount: formatNumber(activeTransactionData?.[`${againstParty}_party`]?.amount) || "0",
            againstReceivedFeeRate: formatNumber(activeTransactionData?.[`${againstParty}_party`]?.interest?.rate) || "0",
            againstReceivedFeeAmount: formatNumber(activeTransactionData?.[`${againstParty}_party`]?.interest?.amount) || "0",
            againstPaidFeeRate: formatNumber(activeTransactionData?.[`${againstParty}_party`]?.cost?.rate) || "0",
            againstPaidFeeAmount: formatNumber(activeTransactionData?.[`${againstParty}_party`]?.cost?.amount) || "0",
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
            baseAmount: Yup.string().required(t("Required")),
            baseReceivedFeeRate: Yup.string().required(t("Required")),
            baseReceivedFeeAmount: Yup.string().required(t("Required")),
            basePaidFeeRate: Yup.string().required(t("Required")),
            basePaidFeeAmount: Yup.string().required(t("Required")),
            againstAmount: Yup.string().required(t("Required")),
            againstReceivedFeeRate: Yup.string().required(t("Required")),
            againstReceivedFeeAmount: Yup.string().required(t("Required")),
            againstPaidFeeRate: Yup.string().required(t("Required")),
            againstPaidFeeAmount: Yup.string().required(t("Required"))
        });
    }, []);
    const getSpecificFormFieldsAfterSubmission = useCallback((createdTransaction: BuyAndSellCashFormDataType) => {
        const isBuy = createdTransaction?.is_buy || false;
        const baseParty = isBuy? "debtor": "creditor";
        const againstParty = isBuy? "creditor": "debtor";
        return {
            isBuy: isBuy,
            conversionType: createdTransaction?.conversion_type || "multiplication",
            exchangeRate: createdTransaction?.exchange_rate || "0",
            financialAccount: createdTransaction?.creditor_party?.financial_account || null,
            baseCurrency: createdTransaction?.[`${baseParty}_party`]?.currency || null,
            baseAmount: formatNumber(createdTransaction?.[`${baseParty}_party`]?.amount) || "0",
            baseReceivedFeeRate: formatNumber(createdTransaction?.[`${baseParty}_party`]?.interest.rate) || "0",
            baseReceivedFeeAmount: formatNumber(createdTransaction?.[`${baseParty}_party`]?.interest.amount) || "0",
            basePaidFeeRate: formatNumber(createdTransaction?.[`${baseParty}_party`]?.cost?.rate) || "0",
            basePaidFeeAmount: formatNumber(createdTransaction?.[`${baseParty}_party`]?.cost?.amount) || "0",
            againstCurrency: createdTransaction?.[`${againstParty}_party`]?.currency || null,
            againstAmount: formatNumber(createdTransaction?.[`${againstParty}_party`]?.amount) || "0",
            againstReceivedFeeRate: formatNumber(createdTransaction?.[`${againstParty}_party`]?.interest?.rate) || "0",
            againstReceivedFeeAmount: formatNumber(createdTransaction?.[`${againstParty}_party`]?.interest?.amount) || "0",
            againstPaidFeeRate: formatNumber(createdTransaction?.[`${againstParty}_party`]?.cost?.rate) || "0",
            againstPaidFeeAmount: formatNumber(createdTransaction?.[`${againstParty}_party`]?.cost?.amount) || "0",
        }
    }, []);
    const getSpecificFormFieldsAfterResetForm = useCallback((inputFormik: any) => {
        return {
            isBuy: inputFormik.values.isIsBuyLocked? inputFormik.values.isBuy: false,
            exchangeRate: "0",
            conversionType: "multiplication",
            financialAccount:inputFormik.values.isFinancialAccountLocked? inputFormik.values.financialAccount: null,
            baseCurrency: inputFormik.values.isBaseCurrencyLocked? inputFormik.values.baseCurrency: null,
            baseAmount: "0",
            baseReceivedFeeRate: "0",
            baseReceivedFeeAmount: "0",
            basePaidFeeRate: "0",
            basePaidFeeAmount: "0",
            againstCurrency: inputFormik.values.isAgainstCurrencyLocked? inputFormik.values.againstCurrency: null,
            againstAmount: "0",
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

        const date = getFormattedDateTime(inputFormik.values.dateTime).date;
        const time = getFormattedDateTime(inputFormik.values.dateTime).time;

        const isBuy = inputFormik.values.isBuy;
        const baseParty = isBuy? 'debtor': 'creditor';
        const againstParty = isBuy? 'creditor': 'debtor';

        data.transaction_type = isBuy? 'buy-cash': 'sell-cash';
        data.is_buy = isBuy;
        data.exchange_rate = inputFormik.values.exchangeRate;
        data.conversion_type = inputFormik.values.conversionType;

        data[`${baseParty}_party`].financial_account = inputFormik.values.financialAccount;
        data[`${baseParty}_party`].amount = Number(removeNonNumberChars(inputFormik.values.baseAmount));
        data[`${baseParty}_party`].currency = inputFormik.values.baseCurrency;
        data[`${baseParty}_party`].date = date;
        data[`${baseParty}_party`].time = time;
        data[`${baseParty}_party`].cost.amount = Number(removeNonNumberChars(inputFormik.values.basePaidFeeAmount));
        data[`${baseParty}_party`].cost.rate = Number(removeNonNumberChars(inputFormik.values.basePaidFeeRate));
        data[`${baseParty}_party`].interest.amount = Number(removeNonNumberChars(inputFormik.values.baseReceivedFeeAmount));
        data[`${baseParty}_party`].interest.rate = Number(removeNonNumberChars(inputFormik.values.baseReceivedFeeRate));
        data[`${baseParty}_party`].description = inputFormik.values.description;
        data[`${baseParty}_party`].user_specified_id = inputFormik.values.userSpecifiedId;

        data[`${againstParty}_party`].financial_account = inputFormik.values.financialAccount;
        data[`${againstParty}_party`].amount = Number(removeNonNumberChars(inputFormik.values.againstAmount));
        data[`${againstParty}_party`].currency = inputFormik.values.againstCurrency;
        data[`${againstParty}_party`].date = date;
        data[`${againstParty}_party`].time = time;
        data[`${againstParty}_party`].cost.amount = Number(removeNonNumberChars(inputFormik.values.againstPaidFeeAmount));
        data[`${againstParty}_party`].cost.rate = Number(removeNonNumberChars(inputFormik.values.againstPaidFeeRate));
        data[`${againstParty}_party`].interest.amount = Number(removeNonNumberChars(inputFormik.values.againstReceivedFeeAmount));
        data[`${againstParty}_party`].interest.rate = Number(removeNonNumberChars(inputFormik.values.againstReceivedFeeRate));
        data[`${againstParty}_party`].description = inputFormik.values.description;
        data[`${againstParty}_party`].user_specified_id = inputFormik.values.userSpecifiedId;

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

    formik.updateAgainstAmount = useCallback((exchangeRate: string, conversionType: string, baseAmount: string) => {
        const baseAmountNumber = Number(removeNonNumberChars(baseAmount))
        const exchangeRateNumber = Number(removeNonNumberChars(exchangeRate))
        let newAgainstValue = '';
        if(conversionType === 'multiplication')
        {
            newAgainstValue = String(baseAmountNumber * exchangeRateNumber);
        } else {
            newAgainstValue = String(baseAmountNumber / exchangeRateNumber);
        }
        formik.handleNumberInputChange("againstAmount", newAgainstValue);
    }, [formik]);
    formik.toggleIsBuyLock = useCallback((e: any) => {
        formik.setFieldValue('isIsBuyLocked', !formik.values.isIsBuyLocked);
    }, [formik.values.isIsBuyLocked]);
    formik.toggleFinancialAccountLock = useCallback((e: any) => {
        formik.setFieldValue('isFinancialAccountLocked', !formik.values.isFinancialAccountLocked);
    }, [formik.values.isFinancialAccountLocked]);
    formik.toggleBaseCurrencyLock = useCallback((e: any) => {
        formik.setFieldValue('isBaseCurrencyLocked', !formik.values.isBaseCurrencyLocked);
    }, [formik.values.isBaseCurrencyLocked]);
    formik.toggleAgainstCurrencyLock = useCallback((e: any) => {
        formik.setFieldValue('isAgainstCurrencyLocked', !formik.values.isAgainstCurrencyLocked);
    }, [formik.values.isAgainstCurrencyLocked]);
    const onChangeBaseAmountValue = useCallback((e: any) => {
        formik.handleNumberInputChange(`baseAmount`, e.target.value);
        formik.updateAgainstAmount(formik.values.exchangeRate,
            formik.values.conversionType, e.target.value);
    }, [formik]);

    const onChangeAgainstAmountValue = useCallback((e: any) => {
        formik.handleNumberInputChange(`againstAmount`, e.target.value);
    }, [formik]);

    useEffect(() => {
        if(isOpen) return;
        formik.resetFormValues();
    }, [isOpen])

    return (
        <Modal isOpen={isOpen} toggle={toggle} backdrop={"static"} className={'modal-xl'}>
            <ModalHeader className="bg-primary-subtle p-2" toggle={toggle}>
                <h5 className="modal-title">{t("Buy and Sell Cash")}</h5>
            </ModalHeader>
            <ModalBody>
                <Form className={'form-container active'} onSubmit={formik.handleSubmit}>
                    <Container fluid>
                        {!formik.values.isCreate && <TransactionMetaData formik={formik} />}
                        <SelectFinancialAccountAndTradeType formik={formik} />
                        <ExchangeRateAndConversionType formik={formik} />
                        <PartyContainer party={formik.values.isBuy? 'debtor': 'creditor'}
                                        headerTitle={formik.values.isBuy? t("Buy"): t("Sell")}
                        >
                            <BuyAndSellAmountAndCurrency
                                onChangeAmountValue={onChangeBaseAmountValue}
                                formik={formik}
                                prefixName={'base'}
                            />
                            <ReceivedPaidFeeContainer formik={formik} prefixName={'base'} />
                        </PartyContainer>
                        <PartyContainer party={formik.values.isBuy? 'creditor': 'debtor'}
                                        headerTitle={t("Against")} >
                            <BuyAndSellAmountAndCurrency
                                onChangeAmountValue={onChangeAgainstAmountValue}
                                formik={formik}
                                prefixName={'against'}
                            />
                            <ReceivedPaidFeeContainer formik={formik} prefixName={'against'} />
                        </PartyContainer>
                        <TransactionDetails formik={formik} />
                        <TransactionFooter formik={formik} />
                    </Container>
                </Form>
            </ModalBody>
        </Modal>
    );
};

export default BuyAndSellCash;