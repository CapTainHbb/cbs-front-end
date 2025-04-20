import React, {useEffect, useState} from 'react';
import {useFormik} from "formik";
import * as Yup from "yup";
import {t} from "i18next";
import {useDispatch, useSelector} from "react-redux";
import {Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import {Currency} from "../Reports/utils";
import SelectCurrency from "../Reports/SelectCurrency/SelectCurrency";
import axiosInstance from "../../helpers/axios_instance";
import {setReferenceCurrency} from "../../slices/initialData/reducer";
import {toast, ToastContainer} from "react-toastify";
import {normalizeDjangoError} from "../../helpers/error";

interface Props {
    show ?: boolean;
    onCloseClick ?: () => void;
}

const ReferenceCurrencyModal: React.FC<Props> = ({ show, onCloseClick }) => {
    const dispatch = useDispatch();
    const referenceCurrency = useSelector((state: any) => state.InitialData.referenceCurrency);

    const [selectedReferenceCurrency, setSelectedReferenceCurrency] = useState<Currency | undefined>(referenceCurrency);

    useEffect(() => {
        setSelectedReferenceCurrency(referenceCurrency)
    }, [referenceCurrency]);

    const validation: any = useFormik({
        enableReinitialize: true,

        initialValues: {
            currency: referenceCurrency?.name || '',
        },
        validationSchema: Yup.object({
            currency: Yup.string().required(t("Please Enter Currency"))
        }),
        onSubmit: (values) => {
            axiosInstance.put("/currencies/reference-currency/", selectedReferenceCurrency)
                .then(response => {
                    toast.success(t("Reference currency was updated successfully"));
                    dispatch(setReferenceCurrency(response.data))
                })
                .catch(error => toast.error(normalizeDjangoError(error)));
        }
    });

    return (
        <Modal id="showModal" isOpen={show} toggle={onCloseClick} centered>
            <ModalHeader className="bg-primary-subtle p-3" toggle={onCloseClick}>
                {t("Update Reference Currency")}
            </ModalHeader>

            <Form className="tablelist-form" onSubmit={validation.handleSubmit}>
                <ModalBody>
                    <Input type="hidden" id="id-field" />
                    <Row className="g-3">
                        <Col lg={12}>
                            <Col lg={12}>
                                <Label
                                    htmlFor="role-field"
                                    className="form-label"
                                >
                                    {t("Currency Type")}
                                </Label>

                                <SelectCurrency currencyId={selectedReferenceCurrency?.id} onCurrencyChange={(currency: Currency) => {
                                        setSelectedReferenceCurrency(currency);
                                        validation.setFieldValue('currency', currency?.name);
                                    }
                                } />
                                {validation.touched.currency &&
                                validation.errors.currency ? (
                                    <FormFeedback type="invalid">
                                        {validation.errors.currency}
                                    </FormFeedback>
                                ) : null}
                            </Col>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <div className="hstack gap-2 justify-content-end">
                        <button type="button" className="btn btn-light" onClick={onCloseClick}> {t("Close")} </button>
                        <button type="submit" className="btn btn-success" id="add-btn"> {t("Update")} </button>
                    </div>
                </ModalFooter>
            </Form>
        </Modal>
    );
};

export default ReferenceCurrencyModal;