import {getLocalizedFormattedDateTime, getLocalizedFormattedToday, getUTCFormattedDateTime} from 'helpers/date';
import { t } from 'i18next';
import React from 'react'
import { Col, Label, Row } from 'reactstrap';

interface Props {
    formik: any;
}

const TransactionMetaData: React.FC<Props> = ({ formik }) => {
  return (
    <Row className={' border border-1 border-info-subtle m-1'}>
      <Col md={4} sm={12}>
          <Row>
              <Col>
                <Label>{t("Document Number")}</Label>
              </Col>
              <Col>
                <Label>{formik.values?.id}</Label>
              </Col>
          </Row>
      </Col>
      <Col md={4} sm={12}>
          <Row>
              <Col>
                <Label>{t("Created By")}</Label>
              </Col>
              <Col>
                <Label>{formik.values?.createdBy?.username}</Label>
              </Col>
          </Row>
      </Col>
      <Col md={4} sm={12} className={'gap-1'}>
          <Row>
            <Col>
                <Label>{t("Created At")}</Label>
            </Col>
              <Col>
                <Label>{getLocalizedFormattedDateTime(new Date(formik.values?.createdAt))?.date}  {getLocalizedFormattedDateTime(new Date(formik.values?.createdAt))?.time} </Label>
              </Col>
          </Row>
      </Col>
    </Row>
  )
}

export default TransactionMetaData
