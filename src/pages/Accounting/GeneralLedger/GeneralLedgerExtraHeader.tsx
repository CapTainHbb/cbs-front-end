import React from 'react';
import {Button, Col, Input, Label, Row} from "reactstrap";
import {t} from "i18next";
import Flatpickr from "react-flatpickr";
import {getUTCFormattedDate} from "../../../helpers/date";

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
                    <Input type={"checkbox"} className={'form-check-input mx-1'}
                       checked={checked}
                       onChange={(e) => setChecked(e.target.checked)} />
                    <Label>{t("Hide Small Amounts")}</Label>
                </Col>
                <Col>
                    <Row className={'align-items-center'}>
                        <Col md={1}>
                            <Label>{t("Date")}</Label>
                        </Col>
                        <Col md={2}>
                            <Flatpickr
                                className="form-control"
                                options={{
                                    dateFormat: "Y-m-d",
                                }}
                                onChange={([selectedDate]) => setDate(getUTCFormattedDate(selectedDate))}
                                value={date}
                            />
                        </Col>
                        <Col md={2}>
                            <Row>
                                <Button color='primary' className={'w-100'}
                                        onClick={() => setItemsChanged(!itemsChanged)}>
                                    <i className='ri-refresh-fill'/> {t("Refresh")}
                                </Button>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default GeneralLedgerExtraHeader;