import React from 'react'
import {Button, Col, Label, Row} from 'reactstrap';
import Flatpickr from "react-flatpickr";
import {getUTCFormattedDate} from "../../../helpers/date";
import {t} from "i18next";

interface Props {
    date: string;
    setDate: any;
    itemsChanged: boolean;
    setItemsChanged: any;
    itemsAreLoading: boolean;
}

const TotalPerformanceExtraHeader: React.FC<Props> = ({ date, setDate, itemsChanged, setItemsChanged, itemsAreLoading  }) => {

    return (
        <React.Fragment>
            <Row className={'align-items-center'}>
                <Col lg={6} >
                    <div className="mt-3">
                        <Label className="form-label mb-0">{t("Date")}</Label>
                        <Flatpickr
                            className="form-control"
                            onChange={(e: any) => {setDate(getUTCFormattedDate(e?.[0]))}}
                            value={date}
                            options={{
                                dateFormat: "Y-m-d",
                                defaultDate: ["2022-01-20"],
                            }}
                            disabled={itemsAreLoading}
                        />
                    </div>
                </Col>
                <Col>
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

export default TotalPerformanceExtraHeader;
