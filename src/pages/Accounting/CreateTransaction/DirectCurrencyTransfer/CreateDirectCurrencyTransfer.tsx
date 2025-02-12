import React from 'react'
import {Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader} from 'reactstrap';
import {t} from "i18next";
import {useAdjacentTransactionLoader} from "../hooks";
import RectLoader from "../../../Reports/RectLoader";
import SelectCurrency from "../../../Reports/SelectCurrency/SelectCurrency";
import {Formik} from "formik";
import {defaultDirectCurrencyTransferFormData} from "./types";


const CreateDirectCurrencyTransfer = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
    const {isAdjacentTransactionLoading,
        size, ref, handelLoadAnotherTransaction} =  useAdjacentTransactionLoader({
        transactionUrl:'/transactions/direct-currency-transfer/'
    });

    const validation: any = Formik({
        enableReinitialize: true,
        initialValues: {
            ...structuredClone(defaultDirectCurrencyTransferFormData)
        },
        validationSchema: {
            amount: Yup.number().min(0)
        },
        onSubmit: (values: any) => {

        }
    });
    return (
        <Modal isOpen={isOpen} toggle={toggle} backdrop={"static"} centered>
            <ModalHeader className="bg-primary-subtle p-3" toggle={toggle}>
                <h5 className="modal-title">{t("Direct Currency Transfer")}</h5>
            </ModalHeader>
            <ModalBody className="text-center p-5">
                <Form className={'form-container active'}>
                    {isAdjacentTransactionLoading && <RectLoader style={size} isNormalized={false} />}
                    <div className="form-section transfer-amount-container">
                            <FormGroup className="mb-3">
                                <Label htmlFor="amount">{t("TransferAmount")}</Label>
                                <Input type={'number'} />
                                <SelectCurrency currency={} onCurrencyChange={}
                            </FormGroup>
                    </div>
                </Form>
            </ModalBody>
        </Modal>
    );
};

export default CreateDirectCurrencyTransfer
