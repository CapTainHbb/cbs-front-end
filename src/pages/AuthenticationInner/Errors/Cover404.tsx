import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

import error400cover from "../../../assets/images/error400-cover.png"
import {t} from "i18next";

const Cover404 = () => {
document.title="404 Error | ZALEX - Financial Software";
    return (
        <React.Fragment>
            <div className="auth-page-content">
                <div className="auth-page-wrapper py-5 d-flex justify-content-center align-items-center min-vh-100">
                    <div className="auth-page-content overflow-hidden p-0">
                        <Container>
                            <Row className="justify-content-center">
                                <Col xl={7} lg={8}>
                                    <div className="text-center">
                                        <img src={error400cover} alt="error img" className="img-fluid" />
                                        <div className="mt-3">
                                            <h3 className="text-uppercase">{t("Sorry, Page not Found")} 😭</h3>
                                            <Link to="/" className="btn btn-success"><i className="mdi mdi-home me-1"></i>{t("Back to home")}</Link>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Cover404;