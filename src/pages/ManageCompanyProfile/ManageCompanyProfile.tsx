import React from 'react';
import {Col, Container, Row} from "reactstrap";
import {t} from "i18next";
import BreadCrumb from "../../Components/Common/BreadCrumb";

const ManageCompanyProfile = () => {
    return (
        <React.Fragment>
            <div className={'page-content'}>
                <Container fluid>
                    <BreadCrumb title={t("Manage Company Profile")} pageTitle={t("Manage Company Profile")} />
                    <Row>
                        <Col lg={12}>

                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ManageCompanyProfile;