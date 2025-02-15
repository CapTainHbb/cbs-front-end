import React, {useState} from 'react';
import {Button, Col, Row, Spinner} from "reactstrap";
import {t} from "i18next";
import DeleteModal from "../../../Components/Common/DeleteModal";

interface Props {
    formik: any;
}

const TransactionFooter: React.FC<Props> = ({ formik }) => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

    return (
        <Row>
            <Col>
                <Button type={'button'}
                    className={'btn btn-info'}
                    onClick={() => formik.handleClickNewDocument()}
                >
                    <i className={' ri-file-add-fill'} /> {t("Create new document")}
                </Button>
            </Col>
            <Col>
                <Button type={'button'}
                        disabled={!formik.values?.id || formik.values.isCreate}
                        className={'btn btn-warning'}
                        onClick={(e: any) => formik.setFieldValue("isEditing", !formik.values.isEditing)}
                >
                    <i className={'ri-edit-fill'} /> {formik.values?.isEditing? t("Cancel Edit"): t("Edit")}
                </Button>
            </Col>
            <Col>
                {!formik.values.isDeleting && <Button type={'button'}
                        disabled={!formik.values?.id || formik.values.isCreate}
                        className={'btn btn-danger'}
                        onClick={(e: any) => setIsConfirmModalOpen(true)}
                >
                    <i className={'ri-delete-bin-fill'} /> {t("Delete")}
                </Button>}
                {formik.values.isDeleting && <Spinner color={'danger'} />}
            </Col>
            <Col>
                {!formik.isSubmitting && <Button type={'submit'} disabled={(formik.values?.id) && (!formik.values.isEditing)} className={'btn btn-primary'}>
                    {t("Submit")}
                </Button>}
                {formik.isSubmitting && <Spinner color={'primary'} />}
            </Col>
            <DeleteModal show={isConfirmModalOpen}
                         onDeleteClick={() => {formik.handleDeleteTransaction(); setIsConfirmModalOpen(false)}}
                         onCloseClick={() => setIsConfirmModalOpen(false)}
            />
        </Row>
    );
};

export default TransactionFooter;