import { t } from 'i18next'
import { ReactNode } from 'react';
import { Badge, Col, Row } from 'reactstrap'

interface Props {
    children: ReactNode;
}

const PaymentsContainer: React.FC<Props> = ({ children }) => {
  return (
    <Row className={`mb-1 border-opacity-50 border border-1 border-info'}`}>
        <Row>
            <Col md={6}>
                <Badge className={'px-5 fs-6 mb-2'} color={'info'}>{t("Payments")}</Badge>
            </Col>
        </Row>
        {children}
    </Row>
  )
}

export default PaymentsContainer
