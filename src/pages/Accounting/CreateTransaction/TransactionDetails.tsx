import React from 'react';
import {Col, FormGroup, Input, Label, Row} from "reactstrap";
import {t} from "i18next";
import Flatpickr from "react-flatpickr";
import {getToday} from "../../../helpers/date";

interface Props {
    formik: any;
}

const TransactionDetails: React.FC<Props> = ({ formik }) => {
    return (
        <Row>
            <Col md={4}>
                <FormGroup>
                    <Label htmlFor='description'>
                        {t("Description")}
                    </Label>
                    <Input
                        type={'text'}
                        name={'description'}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                    />
                </FormGroup>
            </Col>
            <Col md={4}>
                <FormGroup>
                    <Label htmlFor='description'>
                        {t("Transaction Number")}
                    </Label>
                    <Input
                        type={'text'}
                        name={'userSpecifiedId'}
                        value={formik.values.userSpecifiedId}
                        onChange={formik.handleChange}
                    />
                </FormGroup>
            </Col>
            <Col md={4}>
                <FormGroup>
                    <Label htmlFor='date-time'>
                        {t("Date and Time")}
                    </Label>
                    <Flatpickr
                        className="form-control"
                        name={'dateTime'}
                        options={{
                            enableTime: true,
                            dateFormat: "Y-m-d H:i",
                        }}
                        onChange={([selectedDate]) => {
                            formik.setFieldValue('dateTime', selectedDate);
                        }}
                        value={formik.values.dateTime || getToday()}
                    />
                    {formik.errors.dateTime && formik.touched.dateTime && (
                        <div className="text-danger mt-1">{formik.errors.dateTime}</div>
                    )}
                </FormGroup>
            </Col>
        </Row>
    );
};

export default TransactionDetails;