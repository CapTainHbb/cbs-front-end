import React from 'react'
import { Col, Label, Row } from 'reactstrap';
import Flatpickr from "react-flatpickr";

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
            <Label className="form-label mb-0">From Date</Label>
            <Flatpickr
              className="form-control"
              onChange={onChangeFromDate}
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
            <Label className="form-label mb-0">To Date</Label>
            <Flatpickr
              className="form-control"
              onChange={onChangeToDate}
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
