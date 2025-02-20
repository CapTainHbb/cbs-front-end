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
                    <Input
                        disabled={formik.derivedState.areInputsDisabled}
                        type={'text'}
                        name={'description'}
                        placeholder={t("Description")}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                    />
                </FormGroup>
            </Col>
            <Col md={4}>
                <FormGroup>
                    <Input
                        type={'text'}
                        name={'userSpecifiedId'}
                        placeholder={t("Transaction Number")}
                        value={formik.values.userSpecifiedId}
                        onChange={formik.handleChange}
                        disabled={formik.derivedState.areInputsDisabled}
                    />
                </FormGroup>
            </Col>
            <Col md={4}>
                <FormGroup>
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
                        disabled={formik.derivedState.areInputsDisabled}
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