import React from 'react';
import {Col, Label, Row} from "reactstrap";
import {t} from "i18next";
import Flatpickr from "react-flatpickr";
import {getFormattedDate, getFormattedToday} from "../../helpers/date";

interface Props {
    fromDate?: string;
    onChangeFromDate?: any;
    toDate?: string;
    onChangeToDate?: any;
}

const UsersActivityHistoryExtraHeader: React.FC<Props> = ({fromDate, onChangeFromDate,
toDate, onChangeToDate}) => {
    return (
        <React.Fragment>
            <Row>
                <Col lg={6} >
                    <div className="mt-3">
                        <Label className="form-label mb-0">{t("From Date")}</Label>
                        <Flatpickr
                            className="form-control"
                            onChange={(e: any) => onChangeFromDate(getFormattedDate(e?.[0]))}
                            value={fromDate}
                            options={{
                                dateFormat: "Y-m-d",
                                defaultDate: [getFormattedToday()],
                            }}
                        />
                    </div>
                </Col>

                <Col lg={6} >
                    <div className="mt-3">
                        <Label className="form-label mb-0">{t("To Date")}</Label>
                        <Flatpickr
                            className="form-control"
                            onChange={(e: any) => onChangeToDate(getFormattedDate(e?.[0]))}
                            value={toDate}
                            options={{
                                dateFormat: "Y-m-d",
                                defaultDate: [getFormattedToday()],
                            }}
                        />
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default UsersActivityHistoryExtraHeader;