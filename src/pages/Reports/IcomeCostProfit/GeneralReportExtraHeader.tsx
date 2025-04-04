import React from 'react'
import {Button, Col, Label, Row} from 'reactstrap';
import Flatpickr from "react-flatpickr";
import {getUTCFormattedDate} from "../../../helpers/date";
import {t} from "i18next";

interface Props {
    fromDate: string;
    onChangeFromDate: any;
    toDate: string;
    onChangeToDate: any;
    itemsChanged: boolean;
    setItemsChanged: any;
    itemsAreLoading?: boolean;
}

const GeneralReportExtraHeader: React.FC<Props> = ({ fromDate, onChangeFromDate,
                                                          toDate, onChangeToDate,
                                                      itemsChanged, setItemsChanged, itemsAreLoading = false}) => {

    return (
    <React.Fragment>
      <Row className={'align-items-center'}>
        <Col lg={6} >
          <div className="mt-3">
            <Label className="form-label mb-0">{t("From Date")}</Label>
            <Flatpickr
              className="form-control"
              onChange={(e: any) => {onChangeFromDate(getUTCFormattedDate(e?.[0]))}}
              value={fromDate}
              options={{
                dateFormat: "Y-m-d",
                defaultDate: ["2022-01-20"],
              }}
              disabled={itemsAreLoading}
            />
          </div>
        </Col>

        <Col lg={4} >
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
              disabled={itemsAreLoading}
            />
          </div>
        </Col>
        <Col lg={2}>
            <Button type={'button'} color={'primary'}
                    onClick={(e: any) => setItemsChanged(!itemsChanged)}
                    disabled={itemsAreLoading}
            >
                <i className='ri-refresh-fill'/> {t("Refresh")}
            </Button>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default GeneralReportExtraHeader
