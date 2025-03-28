import React, {useCallback, useMemo} from 'react';
import {PaymentDataType} from './types';
import {Button, Col, FormFeedback, FormGroup, Input, Label, Row} from 'reactstrap';
import {t} from 'i18next';
import {getToday} from 'helpers/date';
import Flatpickr from "react-flatpickr";
import {customFormatNumber, removeNonNumberChars} from "../../utils";


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
            dateTime: '',
        };
        formik.setFieldValue('payments', [...formik.values.payments, newPayment]);
    };

    // Helper function to delete a payment
    const handleDeletePayment = (index: number) => {
        const updatedPayments = formik.values.payments.filter((_: any, i: number) => i !== index);
        formik.setFieldValue('payments', updatedPayments);
    };

    const totalPaidAmount = useMemo(() => {
        return formik.values.payments.reduce((sum: number, payment: PaymentDataType) => sum + (Number(removeNonNumberChars(payment?.amount)) || 0), 0);
    }, [formik.values.payments]);

    const remainedPaidAmount = useMemo(() => {
        return Number(removeNonNumberChars(formik.values.totalAmount) - totalPaidAmount);
    }, [totalPaidAmount, formik.values.totalAmount]);

    const onKeyDownTransactionId = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            // Handle Enter key press here
            handleAddPayment();
        }
    }, [handleAddPayment]);

    return (
        <Row style={{margin: '1px'}}>
            {formik.values.payments.map((payment: PaymentDataType, index: number) => (
                <Row key={index} style={{marginBottom: '2px'}}>
                    {/* Amount Field */}
                    <Col md={3} sm={12}>
                        <Input
                            id={`payments.${index}.amount`}
                            name={`payments.${index}.amount`}
                            type="text"
                            onBlur={formik.handleBlur}
                            placeholder={t("Enter Amount")}
                            value={customFormatNumber(payment.amount)}
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
                    <Col md={4} sm={12}>
                        <Input
                            id={`payments.${index}.bank_account`}
                            name={`payments.${index}.bank_account`}
                            type="text"
                            onChange={formik.handleChange}
                            value={payment.bank_account}
                            placeholder={t("Destination Bank Account Info")}
                            disabled={formik.derivedState.areInputsDisabled}
                        />
                        {formik.errors.payments?.[index]?.bank_account && (
                            <div>{formik.errors.payments[index].bank_account}</div>
                        )}
                    </Col>

                    {/* Transaction ID Field */}
                    <Col md={2} sm={12}>
                        <Input
                            id={`payments.${index}.payment_transaction_id`}
                            name={`payments.${index}.payment_transaction_id`}
                            type="text"
                            onChange={formik.handleChange}
                            value={payment.payment_transaction_id}
                            onKeyDown={onKeyDownTransactionId}
                            placeholder={t("Transaction Number")}
                            disabled={formik.derivedState.areInputsDisabled}
                        />
                        {formik.errors.payments?.[index]?.payment_transaction_id && (
                            <div>{formik.errors.payments[index].payment_transaction_id}</div>
                        )}
                    </Col>

                    {/* Date Field */}
                    <Col md={2} sm={12}>
                        <Flatpickr
                            className="form-control"
                            name={`payments.${index}.dateTime`}
                            options={{
                                enableTime: true,
                                dateFormat: "Y-m-d H:i",
                            }}
                            onChange={([selectedDate]) => {
                                formik.setFieldValue(`payments.${index}.dateTime`, selectedDate);
                            }}
                            value={payment.dateTime ||  getToday()}
                            disabled={formik.derivedState.areInputsDisabled}
                        />
                        {formik.errors.payments?.[index]?.dateTime && (
                            <div>{formik.errors.payments[index].dateTime}</div>
                        )}
                    </Col>

                    {/* Delete Button */}
                    <Col md={1} sm={12}>
                        <Button
                            className={'w-100'}
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
            <Row>
                <Col md={5} className={'align-items-center'}>
                    <FormGroup row>
                        <Col>
                            <Label>{t("Total Paid Amount")}</Label>
                        </Col>
                        <Col>
                            <Label>{customFormatNumber(totalPaidAmount)}</Label>
                        </Col>
                    </FormGroup>
                </Col>
                <Col md={4}>
                    <FormGroup row>
                        <Col >
                            <Label>{t("Remained Paid Amount")}</Label>
                        </Col>
                        <Col>
                            <Label dir={'ltr'}>{customFormatNumber(remainedPaidAmount)}</Label>
                        </Col>
                    </FormGroup>
                </Col>
                <Col md={3}>
                    <Button type={'button'} disabled={true}
                            color={remainedPaidAmount === 0? 'success': (remainedPaidAmount < 0? 'warning': 'danger')}
                            className={'btn-label w-100 m-1'}>
                        <i className={remainedPaidAmount === 0? "ri-check-double-line": (remainedPaidAmount < 0? "ri-error-warning-line": "ri-alert-line" )  +
                            ' label-icon align-middle fs-16 me-2'}/>
                        {remainedPaidAmount === 0? t("Fully Paid"): (remainedPaidAmount < 0? t("Extra Paid"): t("Semi Paid"))}
                    </Button>
                </Col>
            </Row>
            {/* Add Payment Button */}
            <Button type="button" color='primary'  className={'align-content-center'} onClick={handleAddPayment} disabled={formik.derivedState.areInputsDisabled}>
                <i className={'ri-add-circle-line mx-1'} />
                <Label>{t("Add Payment")}</Label>
            </Button>
        </Row>
    );
};

export default Payments;