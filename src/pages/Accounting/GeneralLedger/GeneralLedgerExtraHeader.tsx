import React from 'react';
import {Button, Col, Input, Label, Row} from "reactstrap";
import {t} from "i18next";
import Flatpickr from "react-flatpickr";
import {getUTCFormattedDateTime} from "../../../helpers/date";

interface Props {
    checked: boolean;
    setChecked: any;
    date: any;
    setDate: any;
    itemsChanged: boolean;
    setItemsChanged: any;
}

const GeneralLedgerExtraHeader: React.FC<Props> = ({ checked, setChecked,
                                                       date, setDate,
                                                   itemsChanged, setItemsChanged}) => {
    return (
        <React.Fragment>
            <Row className="d-flex gap-3">
                <Col md={2}>
                    <Input type={"checkbox"} className={'form-check-input'}
                       checked={checked}
                       onChange={(e) => setChecked(e.target.checked)} />
                    <Label>{t("Hide Small Amounts")}</Label>
                </Col>
                <Col>
                    <Row>
                        <Col>
                            <Label>{t("Date")}</Label>
                        </Col>
                        <Col>
                            <Flatpickr
                                className="form-control"
                                options={{
                                    dateFormat: "Y-m-d",
                                }}
                                onChange={([selectedDate]) => setDate(getUTCFormattedDateTime(selectedDate).date)}
                                value={date}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Row>
                        <Button color='primary' className={'w-100'}
                                onClick={() => setItemsChanged(!itemsChanged)}>
                            <i className='ri-refresh-fill'/> {t("Refresh")}
                        </Button>
                    </Row>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default GeneralLedgerExtraHeader;