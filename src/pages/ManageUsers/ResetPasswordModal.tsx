import React, {useCallback, useState} from 'react';
import {Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import {t} from "i18next";
import {useFormik} from "formik";
import * as Yup from "yup";
import {UserProfile} from "./UsersList";
import axiosInstance from "../../helpers/axios_instance";
import {toast} from "react-toastify";
import {normalizeDjangoError} from "../../helpers/error";


interface Props {
    show ?: boolean;
    onCloseClick ?: () => void;
    activeUserProfile: UserProfile | null;
}

const ResetPasswordModal: React.FC<Props> = ({ show,
                                                 onCloseClick,
                                                 activeUserProfile}) => {
    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    const [repeatPasswordShow, setRepeatPasswordShow] = useState<boolean>(false)

    const validation: any = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            password: '',
            repeatPassword: ''
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .required(t("Please Enter Password"))
                .min(8, t("Password must be at least 8 character")),
            repeatPassword: Yup.string()
                .required(t("Please Enter Password Again"))
                .oneOf([Yup.ref('password')], t("Passwords must match"))
        }),
        onSubmit: (values) => {
            handleResetPassword({password: values['password']});
        }
    });

    const handleResetPassword = useCallback(async (data: any) => {
        axiosInstance.put(`/users/${activeUserProfile?.id}/reset-password/`, data)
            .then(response => {
                toast.success(t("Password Reset Successfully"));
            })
            .catch(error => {
                toast.error(normalizeDjangoError(error.response.data))
            })
    }, [activeUserProfile]);

    return (
        <Modal id="showModal" isOpen={show} toggle={onCloseClick} centered>
            <ModalHeader className="bg-primary-subtle p-3" toggle={onCloseClick}>
                {t("Reset Password")}
            </ModalHeader>

            <Form className="tablelist-form" onSubmit={validation.handleSubmit}>
                <ModalBody>
                    <Input type="hidden" id="id-field" />
                    <Row className="g-3">

                         <Col lg={12}>
                            <Label
                                htmlFor="password-field"
                                className="form-label"
                            >
                                {t("Password")}
                            </Label>
                            <div className='position-relative auth-pass-inputgroup mb-3'>
                                <Input
                                    name="password"
                                    id="password-field"
                                    className="form-control"
                                    placeholder={t("Enter password")}
                                    type={passwordShow ? "text" : "password"}
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.password || ""}
                                    invalid={
                                        validation.touched.password && validation.errors.password ? true : false
                                    }
                                />
                                <button
                                    className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                    type="button" id="password-addon" onClick={() => setPasswordShow(!passwordShow)}><i
                                    className="ri-eye-fill align-middle"></i></button>
                                {validation.touched.password && validation.errors.password ? (
                                    <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                                ) : null}

                            </div>
                        </Col>
                         <Col lg={12}>
                            <Label
                                htmlFor="repeatpassword-field"
                                className="form-label"
                            >
                                {t("Repeat Password")}
                            </Label>
                            <div className='position-relative auth-pass-inputgroup mb-3'>
                                <Input
                                    name="repeatPassword"
                                    id="repeatpassword-field"
                                    className="form-control"
                                    placeholder={t("Enter Repeat Password")}
                                    type={repeatPasswordShow ? "text" : "password"}
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.repeatPassword || ""}
                                    invalid={
                                        validation.touched.repeatPassword && validation.errors.repeatPassword ? true : false
                                    }
                                />
                                <button
                                    className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                    type="button" id="password-addon"
                                    onClick={() => setRepeatPasswordShow(!repeatPasswordShow)}><i
                                    className="ri-eye-fill align-middle"></i></button>
                                {validation.touched.repeatPassword && validation.errors.repeatPassword ? (
                                    <FormFeedback type="invalid">{validation.errors.repeatPassword}</FormFeedback>
                                ) : null}
                            </div>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <div className="hstack gap-2 justify-content-end">
                        <button type="button" className="btn btn-light" onClick={onCloseClick}> {t("Close")} </button>
                        <button type="submit" className="btn btn-success" id="add-btn"> {t("Reset Password")} </button>
                    </div>
                </ModalFooter>
            </Form>
        </Modal>
    );
};

export default ResetPasswordModal;