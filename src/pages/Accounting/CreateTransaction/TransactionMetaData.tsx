import { getFormattedDateTime } from 'helpers/date';
import { t } from 'i18next';
import React from 'react'
import { Col, Label, Row } from 'reactstrap';

interface Props {
    formik: any;
}

const TransactionMetaData: React.FC<Props> = ({ formik }) => {
  return (
    <Row>
      <Col>
        <Label>{t("Document Number")}</Label>
        <span>{formik.values?.id}</span>
      </Col>
      <Col>
        <Label>{t("Created By")}</Label>
        <span>{formik.values?.createdBy?.username}</span>
      </Col>
      <Col>
        <Label>{t("Created At")}</Label>
        <span>{getFormattedDateTime(new Date(formik.values?.createdAt))?.date} {getFormattedDateTime(new Date(formik.values?.createdAt))?.time}</span>
      </Col>
    </Row>
  )
}

export default TransactionMetaData
