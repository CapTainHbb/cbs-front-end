import React, {ReactNode} from 'react';
import {Badge, Col, Row} from "reactstrap";

interface Props {
    formik: any;
    party: 'creditor' | 'debtor';
    headerTitle: string;
    children: ReactNode;
}

const PartyContainer: React.FC<Props> = ({ formik, party, headerTitle, children }) => {
    return (
        <Row className={`mb-1 border-opacity-50 border border-1 ${party === 'debtor'? 'border-danger': 'border-success'}`}>
            <Row>
                <Col md={6}>
                    <Badge className={'px-5 fs-6 mb-2'} color={party === 'debtor'? "danger": 'success'}>{headerTitle}</Badge>
                </Col>
            </Row>
            {children}
        </Row>
    );
};

export default PartyContainer;