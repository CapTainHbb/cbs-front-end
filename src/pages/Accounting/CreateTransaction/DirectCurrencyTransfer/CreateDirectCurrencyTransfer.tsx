import React, { useEffect } from 'react'
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
import {useTransactionFormik} from "./hooks";
import {DirectCurrencyTransferTransaction} from "./types";
import TransactionFooter from "../TransactionFooter";
import TransactionMetaData from '../TransactionMetaData';

interface Props {
    isOpen: boolean;
    toggle: any;
    activeTransactionData?: DirectCurrencyTransferTransaction;
}

const CreateDirectCurrencyTransfer: React.FC<Props> = ({ isOpen, toggle, activeTransactionData }) => {
    const {formik} = useTransactionFormik({
        endPointApi: '/transactions/direct-currency-transfer/',
        activeTransactionData,
        isParentModalOpen: isOpen,

    });

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
