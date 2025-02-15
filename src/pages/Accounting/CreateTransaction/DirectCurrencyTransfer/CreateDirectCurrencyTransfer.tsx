import React, {useCallback, useMemo, useState} from 'react'
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
import TransactionDetails from "../TransactionDetails";
import PartyContainer from "../PartyContainer";
import TransferAmountAndCurrency from "./TransferAmountAndCurrency";
import {ToastContainer} from "react-toastify";
import {useTransactionFormik} from "./hooks";
import {DirectCurrencyTransferTransaction} from "./types";
import TransactionFooter from "../TransactionFooter";

interface Props {
    isOpen: boolean;
    toggle: any;
    activeTransactionData?: DirectCurrencyTransferTransaction;
    setActiveTransactionData?: any;
}

const CreateDirectCurrencyTransfer: React.FC<Props> = ({ isOpen, toggle, activeTransactionData, setActiveTransactionData }) => {
    const {formik, handleNumberInputChange} = useTransactionFormik({
        endPointApi: '/transactions/direct-currency-transfer/',
        activeTransactionData: activeTransactionData,
        setActiveTransactionData: setActiveTransactionData
    });

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
                        <TransactionFooter formik={formik}/>
                    </Container>
                </Form>
            </ModalBody>
            <ToastContainer autoClose={2000} closeButton={false} limit={1} />
        </Modal>
    );
};

export default CreateDirectCurrencyTransfer
