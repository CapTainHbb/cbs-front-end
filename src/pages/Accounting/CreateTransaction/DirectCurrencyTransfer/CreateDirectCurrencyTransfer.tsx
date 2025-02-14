import React, {useCallback, useMemo} from 'react'
import {
    Button,
    Col, Container,
    Form,
    Modal,
    ModalBody,
    ModalHeader,
    Row
} from 'reactstrap';
import {t} from "i18next";
import {useFormik} from "formik";
import * as Yup from "yup";
import TransactionDetails from "../TransactionDetails";
import PartyContainer from "../PartyContainer";
import {customFormatNumber, removeNonNumberChars} from "../../utils";
import TransferAmountAndCurrency from "./TransferAmountAndCurrency";
import {defaultDirectCurrencyTransferFormData} from "./types";
import {getFormattedDateTime} from "../../../../helpers/date";
import axiosInstance from "../../../../helpers/axios_instance";
import {toast, ToastContainer} from "react-toastify";
import {normalizeDjangoError} from "../../../../helpers/error";

const CreateDirectCurrencyTransfer = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
    const initialDateTime = useMemo(() => new Date(), []);

    const formik: any = useFormik({
        enableReinitialize: true,
        initialValues: {
            amount: null,
            currency: null,
            creditorFinancialAccount: null,
            creditorReceivedFeeRate: 0,
            creditorReceivedFeeAmount: 0,
            creditorPaidFeeRate: 0,
            creditorPaidFeeAmount: 0,
            debtorFinancialAccount: null,
            debtorReceivedFeeRate: 0,
            debtorReceivedFeeAmount: 0,
            debtorPaidFeeRate: 0,
            debtorPaidFeeAmount: 0,
            description: "",
            userSpecifiedId: "",
            dateTime: initialDateTime,
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

            formValues.amount = amount
            formValues.date = getFormattedDateTime(values.dateTime).date;
            formValues.time = getFormattedDateTime(values.dateTime).time;
            formValues.description = values.description;
            formValues.user_specified_id = values.userSpecifiedId;

            formValues.debtor_party.financial_account = values.debtorFinancialAccount;
            formValues.debtor_party.amount = amount;
            formValues.debtor_party.currency = values.currency
            formValues.debtor_party.date = getFormattedDateTime(values.dateTime).date;
            formValues.debtor_party.time = getFormattedDateTime(values.dateTime).time;
            formValues.debtor_party.cost.amount = values.debtorPaidFeeAmount;
            formValues.debtor_party.cost.rate = values.debtorPaidFeeRate;
            formValues.debtor_party.interest.amount = values.debtorReceivedFeeAmount;
            formValues.debtor_party.interest.rate = values.debtorReceivedFeeRate;
            formValues.debtor_party.description = values.description;
            formValues.debtor_party.user_specified_id = values.userSpecifiedId;

            formValues.creditor_party.financial_account = values.creditorFinancialAccount;
            formValues.creditor_party.amount = amount;
            formValues.creditor_party.currency = values.currency
            formValues.creditor_party.date = getFormattedDateTime(values.dateTime).date;
            formValues.creditor_party.time = getFormattedDateTime(values.dateTime).time;
            formValues.creditor_party.cost.amount = values.creditorPaidFeeAmount;
            formValues.creditor_party.cost.rate = values.creditorPaidFeeRate;
            formValues.creditor_party.interest.amount = values.creditorReceivedFeeAmount;
            formValues.creditor_party.interest.rate = values.creditorReceivedFeeRate;
            formValues.creditor_party.description = values.description;
            formValues.creditor_party.user_specified_id = values.userSpecifiedId;
            handleSubmitTransaction(formValues);
        }
    });

    const handleSubmitTransaction = useCallback((data: any) => {
        axiosInstance.post(`/transactions/direct-currency-transfer/`, data)
            .then(response => {
                toast.success(t("Transaction created successfully"));
            })
            .catch(error => {
                toast.error(normalizeDjangoError(error));
            })
    }, [])

    const handleNumberInputChange = (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(name, customFormatNumber(e.target.value));
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle} backdrop={"static"} className={'modal-xl'}>
            <ModalHeader className="bg-primary-subtle p-2" toggle={toggle}>
                <h5 className="modal-title">{t("Direct Currency Transfer")}</h5>
            </ModalHeader>
            <ModalBody>
                <Form className={'form-container active'} onSubmit={formik.handleSubmit}>
                    <Container fluid>
                        <TransferAmountAndCurrency formik={formik}
                                                   handleNumberInputChange={handleNumberInputChange} />
                        <PartyContainer formik={formik}
                                        party={'creditor'}
                                        headerTitle={t("Creditor")}
                                        handleNumberInputChange={handleNumberInputChange} />

                        <PartyContainer formik={formik}
                                        party={'debtor'}
                                        headerTitle={t("Debtor")}
                                        handleNumberInputChange={handleNumberInputChange}
                        />
                        <TransactionDetails formik={formik} />
                        <Row>
                            <Col><Button type={'submit'}>{t("Submit")}</Button></Col>
                        </Row>
                    </Container>
                </Form>
            </ModalBody>
            <ToastContainer closeButton={false} limit={1} />
        </Modal>
    );
};

export default CreateDirectCurrencyTransfer
