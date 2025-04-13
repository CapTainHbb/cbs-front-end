import React, {useEffect, useMemo, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {Card, Col, Container, Input, Label, Row, Button, Form, FormFeedback, Spinner, FormGroup} from 'reactstrap';

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import AuthSlider from '../authCarousel';
import {loginUser} from "../../../slices/auth/login/thunk";
import {useDispatch, useSelector} from "react-redux";
import {t} from "i18next";

const CoverSignIn = () => {
    document.title = "SignIn | ZALEX - Currency Exchange Accounting & Dashboard";

    const dispatch: any = useDispatch();
    const isAuthenticated = useSelector((state: any) => state.Authentication.isAuthenticated)
    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    const [loader, setLoader] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const signInRememberedCredentials = useMemo(() => {
        return {
            username: localStorage.getItem('rememberedUsername'),
            password: localStorage.getItem('rememberedPassword'),
        }
    }, [])

    useEffect(() => {
        const rememberLoginData = localStorage.getItem('rememberLoginData');
        setRememberMe(rememberLoginData === "true")
    }, [])

    const validation: any = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            username: signInRememberedCredentials?.username || '',
            password: signInRememberedCredentials?.password || '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required(t("Please Enter Your Username")),
            password: Yup.string().required(t("Please Enter Your Password")),
        }),
        onSubmit: (values) => {
            if (rememberMe) {
                // Save username and password to localStorage or cookies
                localStorage.setItem('rememberedUsername', values.username);
                localStorage.setItem('rememberedPassword', values.password);
            } else {
                // Clear saved credentials if "Remember Me" is not checked
                localStorage.removeItem('rememberedUsername');
                localStorage.removeItem('rememberedPassword');
            }
            localStorage.setItem('rememberLoginData', String(rememberMe));

            dispatch(loginUser(values));
            setLoader(true)
            setTimeout(() => {setLoader(false)}, 5000)
        }
    });

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <React.Fragment>
            <div className="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
                <div className="bg-overlay"></div>
                <div className="auth-page-content overflow-hidden pt-lg-5">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <Card className="overflow-hidden">
                                    <Row className="g-0">
                                        <AuthSlider />

                                        <Col lg={6}>
                                            <div className="p-lg-5 p-4">
                                                <div>
                                                    <h5 className="text-primary">{t("Welcome Back")}!</h5>
                                                    <p className="text-muted">{t("Sign in to continue to ZALEX")}.</p>
                                                </div>

                                                <div className="mt-4">
                                                    <Form
                                                        onSubmit={(e) => {
                                                            e.preventDefault();
                                                            validation.handleSubmit();
                                                            return false;
                                                        }}
                                                        action="#">

                                                        <div className="mb-3">
                                                            <Label htmlFor="username" className="form-label">{t("Username")}</Label>
                                                            <Input type="text" className="form-control" id="username" placeholder={t("Enter username")}
                                                                   name="username"
                                                                   onChange={validation.handleChange}
                                                                   onBlur={validation.handleBlur}
                                                                   value={validation.values.username || ""}
                                                                   invalid={
                                                                       !!(validation.touched.username && validation.errors.username)
                                                                   }
                                                            />
                                                            {validation.touched.username && validation.errors.username ? (
                                                                <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                                                            ) : null}
                                                        </div>

                                                        <div className="mb-3">
                                                            <Label className="form-label" htmlFor="password-input">{t("Password")}</Label>
                                                            <div className="position-relative auth-pass-inputgroup mb-3">
                                                                <Input type={passwordShow ? "text" : "password"} className="form-control pe-5 password-input" placeholder={t("Enter password")} id="password-input"
                                                                       name="password"
                                                                       value={validation.values.password || ""}
                                                                       onChange={validation.handleChange}
                                                                       onBlur={validation.handleBlur}
                                                                       invalid={
                                                                           !!(validation.touched.password && validation.errors.password)
                                                                       }
                                                                />
                                                                {validation.touched.password && validation.errors.password ? (
                                                                    <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                                                                ) : null}
                                                                <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon" type="button" id="password-addon" onClick={() => setPasswordShow(!passwordShow)}><i className="ri-eye-fill align-middle"></i></button>
                                                            </div>
                                                        </div>

                                                        <FormGroup check className="mb-3">
                                                            <Input type="checkbox" id="rememberMe" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                                                            <Label check htmlFor="rememberMe">{t("Remember Me")}</Label>
                                                        </FormGroup>

                                                        <div className="mt-4">
                                                            <Button color="success"
                                                                    disabled={loader && true}
                                                                    className="btn btn-success w-100" type="submit">
                                                                {loader && <Spinner size="sm"
                                                                                    className='me-2'> Loading... </Spinner>}
                                                                {t("Sign In")}
                                                            </Button>
                                                        </div>

                                                    </Form>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>

                <footer className="footer">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center">
                                    <p className="mb-0">&copy; {new Date().getFullYear()} ZALEX. Crafted with <i className="mdi mdi-heart text-danger"></i> by Captainhb</p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </footer>

            </div>
        </React.Fragment>
    );
};

export default CoverSignIn;