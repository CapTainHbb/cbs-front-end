import React, {useState} from 'react';
import {Button, Col, Row, Spinner} from "reactstrap";
import {t} from "i18next";
import DeleteModal from "../../../Components/Common/ConfirmModal";

interface Props {
    formik: any;
    toggle: any;
}

const TransactionFooter: React.FC<Props> = ({ formik, toggle }) => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

    return (
        <Row className={'g-1'}>
            <Col md={2} sm={12}>
                {!formik.isSubmitting && (
                    <Button
                        type="submit"
                        color='primary'
                        disabled={formik.values?.id && !formik.values.isEditing}
                        className="w-100"
                    >
                        {t("Submit")}
                    </Button>
                )}
                {formik.isSubmitting && <Spinner color="primary" />}
            </Col>

            <Col md={2} sm={12}>
                <Button
                    type="button"
                    color='primary'
                    className="w-100"
                    onClick={() => formik.handleClickNewDocument()}
                >
                    <i className="ri-file-add-fill" /> {t("Create new document")}
                </Button>
            </Col>

            <Col md={2} sm={12}>
                <Button
                    type="button"
                    disabled={!formik.values?.id || formik.values.isCreate}
                    className="btn btn-warning w-100"
                    onClick={(e: any) => formik.handleClickEditTransaction()}
                >
                    <i className="ri-edit-fill" />{" "}
                    {formik.values?.isEditing ? t("Cancel Edit") : t("Edit")}
                </Button>
            </Col>
            <Col md={2} sm={12}>
                <Button
                    type="button"
                    color={'primary'}
                    className="btn w-100"
                    disabled={!formik.handlePrintTransaction}
                    onClick={(e: any) => formik?.handlePrintTransaction()}
                >
                    <i className="ri-printer-fill" />{" "}
                    {t("Print")}
                </Button>
            </Col>

            <Col md={1} sm={12}>
                {!formik.values.isDeleting && (
                    <Button
                        type="button"
                        disabled={!formik.values?.id || formik.values.isCreate}
                        className="btn btn-danger w-100"
                        onClick={(e: any) => setIsConfirmModalOpen(true)}
                    >
                        <i className="ri-delete-bin-fill" /> {t("Delete")}
                    </Button>
                )}
                {formik.values.isDeleting && <Spinner color="danger" />}
            </Col>

            <Col md={1} sm={12}>
                <Button
                    type='button'
                    color={'primary'}
                    className="w-100"
                    onClick={(e: any) => toggle()}
                >
                    <i className="ri-close-fill" />{t("Close")}
                </Button>
            </Col>

            <Col md={1} sm={12}>
                <Button
                    type='button'
                    color='primary'
                    className="w-100"
                    disabled={!formik.values.previousTransactionId}
                    onClick={(e: any) => formik.loadTransaction(formik.values.previousTransactionId)}
                >
                    <i className="ri-arrow-right-s-line" /> {t("Previous")}
                </Button>
            </Col>

            <Col md={1} sm={12}>
                <Button
                    type='button'
                    color='primary'
                    className="w-100"
                    disabled={!formik.values.nextTransactionId}
                    onClick={(e: any) => formik.loadTransaction(formik.values.nextTransactionId)}
                >
                    <i className="ri-arrow-left-s-line" /> {t("Next")}
                </Button>
            </Col>


            <DeleteModal
                show={isConfirmModalOpen}
                onConfirmClick={() => {
                    formik.handleDeleteTransaction();
                    setIsConfirmModalOpen(false);
                }}
                onCloseClick={() => setIsConfirmModalOpen(false)}
                isConfirm={false}
            />
        </Row>

    );
};

export default TransactionFooter;