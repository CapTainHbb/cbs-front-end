import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PaymentDataType } from './types';
import { Button, Col, FormFeedback, Input, Label, Row } from 'reactstrap';
import { t } from 'i18next';
import { getFormattedDateTime, getFormattedTodayDateTime, getToday } from 'helpers/date';
import Flatpickr from "react-flatpickr";


interface Props {
    formik: any;
}

const Payments: React.FC<Props> = ({ formik }) => {

    // Helper function to add a new payment
    const handleAddPayment = () => {
        const newPayment: PaymentDataType = {
            amount: undefined,
            bank_account: '',
            payment_transaction_id: '',
            date: '',
            time: '',
        };
        formik.setFieldValue('payments', [...formik.values.payments, newPayment]);
    };

    // Helper function to delete a payment
    const handleDeletePayment = (index: number) => {
        const updatedPayments = formik.values.payments.filter((_: any, i: number) => i !== index);
        formik.setFieldValue('payments', updatedPayments);
    };

    return (
        <Row style={{margin: '1px'}}>
            {formik.values.payments.map((payment: PaymentDataType, index: number) => (
                <Row key={index} style={{marginBottom: '2px'}}>
                    {/* Amount Field */}
                    <Col>
                        <Input
                            id={`payments.${index}.amount`}
                            name={`payments.${index}.amount`}
                            type="text"
                            onBlur={formik.handleBlur}
                            placeholder={t("Enter Amount")}
                            value={payment.amount}
                            onChange={(e: any) => formik.handleNumberInputChange(`payments.${index}.amount`, e.target.value)}
                            disabled={formik.derivedState.areInputsDisabled}
                            invalid={
                                formik.errors.payments?.[index]?.amount ? true : false
                            }
                        />

                        {formik.errors.payments?.[index]?.amount ? (
                            <FormFeedback type='invalid'>{formik.errors.payments?.[index]?.amount}</FormFeedback>
                        ): null}
                    </Col>

                    {/* Bank Account Field */}
                    <Col>
                        <Input
                            id={`payments.${index}.bank_account`}
                            name={`payments.${index}.bank_account`}
                            type="text"
                            onChange={formik.handleChange}
                            value={payment.bank_account}
                            placeholder={t("Bank Account")}
                            disabled={formik.derivedState.areInputsDisabled}
                        />
                        {formik.errors.payments?.[index]?.bank_account && (
                            <div>{formik.errors.payments[index].bank_account}</div>
                        )}
                    </Col>

                    {/* Transaction ID Field */}
                    <Col>
                        <Input
                            id={`payments.${index}.payment_transaction_id`}
                            name={`payments.${index}.payment_transaction_id`}
                            type="text"
                            onChange={formik.handleChange}
                            value={payment.payment_transaction_id}
                            placeholder={t("Transaction Number")}
                            disabled={formik.derivedState.areInputsDisabled}
                        />
                        {formik.errors.payments?.[index]?.payment_transaction_id && (
                            <div>{formik.errors.payments[index].payment_transaction_id}</div>
                        )}
                    </Col>

                    {/* Date Field */}
                    <Col>
                        <Flatpickr
                            className="form-control"
                            name={`payments.${index}.date`}
                            options={{
                                dateFormat: "Y-m-d",
                            }}
                            onChange={([selectedDate]) => {
                                formik.setFieldValue(`payments.${index}.date`, selectedDate);
                            }}
                            value={formik.values.dateTime || getToday()}
                            disabled={formik.derivedState.areInputsDisabled}
                        />
                        {formik.errors.payments?.[index]?.date && (
                            <div>{formik.errors.payments[index].date}</div>
                        )}
                    </Col>

                    {/* Time Field */}
                    <Col>
                        <Input
                            id={`payments.${index}.time`}
                            name={`payments.${index}.time`}
                            type="time"
                            onChange={formik.handleChange}
                            value={payment.time || getFormattedTodayDateTime().time}
                            disabled={formik.derivedState.areInputsDisabled}
                        />
                        {formik.errors.payments?.[index]?.time && (
                            <div>{formik.errors.payments[index].time}</div>
                        )}
                    </Col>

                    {/* Delete Button */}
                    <Col>
                        <Button 
                            type="button" 
                            color={'danger'} 
                            onClick={() => handleDeletePayment(index)}
                            disabled={formik.derivedState.areInputsDisabled}    
                        >
                            <i className='ri-delete-bin-fill'/>
                        </Button>
                    </Col>
                </Row>
            ))}

                {/* Add Payment Button */}
                <Button type="button" onClick={handleAddPayment} disabled={formik.derivedState.areInputsDisabled}>
                    {t("Add Payment")}
                </Button>
        </Row>
    );
};

export default Payments;