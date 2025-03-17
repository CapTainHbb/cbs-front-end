import React from 'react';
import {Card, Container} from 'reactstrap';
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { t } from 'i18next';

const ManageBackup = () => {
    return (
        <React.Fragment>
            <div className='page-content'>
                <Container fluid>
                    <BreadCrumb title={t("Manage Backup")} pageTitle={t("Manage Backup")} />
                    <Card>

                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ManageBackup;