import React from 'react'
import {Button, Col, Label, Row} from 'reactstrap';
import Flatpickr from "react-flatpickr";
import {getUTCFormattedDate} from "../../helpers/date";
import {t} from "i18next";

interface Props {
    fromDate: string | null;
    onChangeFromDate: any;
    toDate: string | null;
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
      <Row className={'align-items-center gap-1'}>
        <Col md={4}>
            <Row className={'align-items-center'}>
                <Col md={2} >
                    <Label className="form-label mb-0">{t("From Date")}</Label>
                </Col>
                <Col md={5} >
                    <Flatpickr
                      className="form-control"
                      onChange={(e: any) => {onChangeFromDate(getUTCFormattedDate(e?.[0]))}}
                      value={fromDate || ""}
                      options={{
                        dateFormat: "Y-m-d",
                        defaultDate: ["2022-01-20"],
                      }}
                      disabled={itemsAreLoading}
                    />
                </Col>
            </Row>
        </Col>

        <Col md={4}>
            <Row className={'align-items-center'}>
                <Col md={2}>
                    <Label className="form-label mb-0">{t("To Date")}</Label>
                </Col>
                <Col md={5}>
                    <Flatpickr
                      className="form-control"
                      onChange={(e: any) => onChangeToDate(getUTCFormattedDate(e?.[0]))}
                      value={toDate || ""}
                      options={{
                        dateFormat: "Y-m-d",
                        defaultDate: ["2022-01-20"],
                      }}
                      disabled={itemsAreLoading}
                    />
                </Col>
            </Row>
        </Col>
        <Col md={2}>
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
