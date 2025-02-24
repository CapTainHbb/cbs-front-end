import React from 'react'
import { Col, Label, Row } from 'reactstrap';
import Flatpickr from "react-flatpickr";
import {getUTCFormattedDate} from "../../../helpers/date";
import {t} from "i18next";

interface Props {
    fromDate: string;
    onChangeFromDate: any;
    toDate: string;
    onChangeToDate: any;
}

const IncomeCostProfitExtraHeader: React.FC<Props> = ({ fromDate, onChangeFromDate, toDate, onChangeToDate }) => {

    return (
    <React.Fragment>
      <Row>
        <Col lg={6} >
          <div className="mt-3">
            <Label className="form-label mb-0">{t("From Date")}</Label>
            <Flatpickr
              className="form-control"
              onChange={(e: any) => onChangeFromDate(getUTCFormattedDate(e?.[0]))}
              value={fromDate}
              options={{
                dateFormat: "Y-m-d",
                defaultDate: ["2022-01-20"],
              }}
            />
          </div>
        </Col>

        <Col lg={6} >
          <div className="mt-3">
            <Label className="form-label mb-0">{t("To Date")}</Label>
            <Flatpickr
              className="form-control"
              onChange={(e: any) => onChangeToDate(getUTCFormattedDate(e?.[0]))}
              value={toDate}
              options={{
                dateFormat: "Y-m-d",
                defaultDate: ["2022-01-20"],
              }}
            />
          </div>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default IncomeCostProfitExtraHeader
