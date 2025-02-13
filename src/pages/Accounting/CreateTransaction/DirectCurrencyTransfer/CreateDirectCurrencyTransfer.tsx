import React, {useCallback} from 'react'
import {
    Badge,
    Button,
    Col, Container,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    Row
} from 'reactstrap';
import {t} from "i18next";
import SelectCurrency from "../../../Reports/SelectCurrency/SelectCurrency";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Currency} from "../../../Reports/utils";
import SelectFinancialAccount from "../../SelectFinancialAccount";
import {FinancialAccount} from "../../types";
import FinancialAccountViewDetail from "../../../ManageFinancialAccounts/FinancialAccountViewDetail";

const CreateDirectCurrencyTransfer = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {


    const formik: any = useFormik({
        enableReinitialize: true,
        initialValues: {
            amount: 0,
            currency: null,
            creditorFinancialAccount: null,
            creditorReceivedFeeRate: 0,
            creditorReceivedAmount: 0,
            debtorFinancialAccount: null,
            debtorReceivedFeeRate: 0,
            debtorReceivedAmount: 0,
        },
        validationSchema:Yup.object({
            amount: Yup.string().required(t('Required')),
            currency: Yup.number().required(t('Required')),
            creditorFinancialAccount: Yup.number().required(t('Required')),
            creditorReceivedFeeRate: Yup.number(),
            creditorReceivedAmount: Yup.number(),
            debtorFinancialAccount: Yup.number().required(t('Required')),
            debtorReceivedFeeRate: Yup.number(),
            debtorReceivedAmount: Yup.number(),
        }),
        onSubmit: (values: any) => {
            console.log(values)
        }
    });

    const removeNonNumberChars = (input: any) => {
        // Remove invalid characters (allow digits and a single decimal point)
        return input.replace(/[^0-9.]/g, '');
    }

    const customFormatNumber = useCallback((rawInput: any) => {
        rawInput = removeNonNumberChars(rawInput);

        const parts = rawInput.split('.');
        if (parts.length > 2) {
            rawInput = parts[0] + '.' + parts.slice(1).join('');
        }

        // Split integer and decimal parts
        const [integerPart, decimalPart] = rawInput.split('.');

        // Format the integer part with commas
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // Reconstruct the formatted value
        let formattedValue = decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;

        // Handle the case where the user types only '.'
        if (rawInput.startsWith('.')) formattedValue = '.' + decimalPart;
        return formattedValue;
    }, [])

    const handleNumberInputChange = (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(name, customFormatNumber(e.target.value));
    };


    return (
        <Modal isOpen={isOpen} toggle={toggle} backdrop={"static"} className={'modal-xl'} centered>
            <ModalHeader className="bg-primary-subtle p-3" toggle={toggle}>
                <h5 className="modal-title">{t("Direct Currency Transfer")}</h5>
            </ModalHeader>
            <ModalBody>
                <Form className={'form-container active'} onSubmit={formik.handleSubmit}>
                    <Container fluid>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label htmlFor="amount">{t("Transfer Amount")}</Label>
                                    <Input
                                        id="amount"
                                        name="amount"
                                        type="text"
                                        value={formik.values.amount}
                                        onChange={(e: any) => handleNumberInputChange('amount', e)}
                                        onBlur={formik.handleBlur}
                                        placeholder="Enter amount"
                                        invalid={
                                            !!(formik.touched.amount && formik.errors.amount)
                                        }
                                    />
                                    {formik.touched.amount && formik.errors.amount ? (
                                        <FormFeedback type="invalid">{formik.errors.amount}</FormFeedback>
                                    ) : null}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label htmlFor="currency">{t("Currency Type")}</Label>
                                    <SelectCurrency currencyId={formik.values.currency}
                                                    onCurrencyChange={(currency: Currency) => formik.setFieldValue('currency', currency?.id)}
                                    />
                                </FormGroup>
                            </Col>
                            <FormGroup className="mb-3"></FormGroup>
                        </Row>
                        <Row>
                            <Row>
                                <Col md={12}>
                                    <Badge className={'px-5 fs-6 mb-2'} color={"success"}>{t("Creditor")}</Badge>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label htmlFor="creditorFinancialAccount">{t("Financial Account")}</Label>
                                        <SelectFinancialAccount onSelectFinancialAccount={(acc: FinancialAccount) => formik.setFieldValue('creditorFinancialAccount', acc?.id)}
                                                                selectedFinancialAccountId={formik.values.creditorFinancialAccount}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <span className={'badge rounded-pill bg-success-subtle text-success'} >{t("Received Fee")}</span>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label htmlFor="rate">{t("Rate")}</Label>
                                                <Input
                                                    id="creditor-recieved-fee-rate"
                                                    name="creditorRecievedFeeRate"
                                                    type="text"
                                                    value={formik.values.creditorReceivedFeeRate}
                                                    onChange={(e: any) => handleNumberInputChange('creditorReceivedFeeRate', e)}
                                                    onBlur={formik.handleBlur}
                                                    placeholder={t("Enter Rate")}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <Label htmlFor="amount">{t("Amount")}</Label>
                                                <Input
                                                    id="creditor-recieved-fee-amount"
                                                    name="creditorRecievedFeeAmount"
                                                    type="text"
                                                    value={formik.values.creditorReceivedFeeAmount}
                                                    onChange={(e: any) => handleNumberInputChange('creditorReceivedFeeAmount', e)}
                                                    onBlur={formik.handleBlur}
                                                    placeholder={t("Enter Amount")}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={3}>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <span className={'badge rounded-pill bg-danger-subtle text-danger'} >{t("Paid Fee")}</span>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label htmlFor="rate">{t("Rate")}</Label>
                                                <Input
                                                    id="creditor-recieved-fee-rate"
                                                    name="creditorRecievedFeeRate"
                                                    type="text"
                                                    value={formik.values.creditorReceivedFeeRate}
                                                    onChange={(e: any) => handleNumberInputChange('creditorReceivedFeeRate', e)}
                                                    onBlur={formik.handleBlur}
                                                    placeholder={t("Enter Rate")}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <Label htmlFor="amount">{t("Amount")}</Label>
                                                <Input
                                                    id="creditor-recieved-fee-amount"
                                                    name="creditorRecievedFeeAmount"
                                                    type="text"
                                                    value={formik.values.creditorReceivedFeeAmount}
                                                    onChange={(e: any) => handleNumberInputChange('creditorReceivedFeeAmount', e)}
                                                    onBlur={formik.handleBlur}
                                                    placeholder={t("Enter Amount")}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={6}>
                                    <FinancialAccountViewDetail financialAccountId={formik.values.creditorFinancialAccount} />
                                </Col>
                            </Row>
                        </Row>

                        <Row>
                            <Row>
                                <Col md={6}>
                                    <Badge className={'px-5 fs-6 mb-2'} color={"danger"}>{t("Debtor")}</Badge>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label htmlFor="debtorFinancialAccount">{t("Financial Account")}</Label>
                                        <SelectFinancialAccount onSelectFinancialAccount={(acc: FinancialAccount) => formik.setFieldValue('debtorFinancialAccount', acc?.id)}
                                                                selectedFinancialAccountId={formik.values.debtorFinancialAccount}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <span className={'badge rounded-pill bg-success-subtle text-success'} >{t("Received Fee")}</span>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label htmlFor="rate">{t("Rate")}</Label>
                                                <Input
                                                    id="debtor-recieved-fee-rate"
                                                    name="debtorRecievedFeeRate"
                                                    type="text"
                                                    value={formik.values.debtorReceivedFeeRate}
                                                    onChange={(e: any) => handleNumberInputChange('debtorReceivedFeeRate', e)}
                                                    onBlur={formik.handleBlur}
                                                    placeholder={t("Enter Rate")}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <Label htmlFor="amount">{t("Amount")}</Label>
                                                <Input
                                                    id="creditor-recieved-fee-amount"
                                                    name="creditorRecievedFeeAmount"
                                                    type="text"
                                                    value={formik.values.creditorReceivedFeeAmount}
                                                    onChange={(e: any) => handleNumberInputChange('creditorReceivedFeeAmount', e)}
                                                    onBlur={formik.handleBlur}
                                                    placeholder={t("Enter Amount")}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={3}>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <span className={'badge rounded-pill bg-danger-subtle text-danger'} >{t("Paid Fee")}</span>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label htmlFor="rate">{t("Rate")}</Label>
                                                <Input
                                                    id="debtor-recieved-fee-rate"
                                                    name="debtorRecievedFeeRate"
                                                    type="text"
                                                    value={formik.values.debtorReceivedFeeRate}
                                                    onChange={(e: any) => handleNumberInputChange('debtorReceivedFeeRate', e)}
                                                    onBlur={formik.handleBlur}
                                                    placeholder={t("Enter Rate")}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <Label htmlFor="amount">{t("Amount")}</Label>
                                                <Input
                                                    id="debtor-recieved-fee-amount"
                                                    name="debtorRecievedFeeAmount"
                                                    type="text"
                                                    value={formik.values.debtorReceivedFeeAmount}
                                                    onChange={(e: any) => handleNumberInputChange('debtorReceivedFeeAmount', e)}
                                                    onBlur={formik.handleBlur}
                                                    placeholder={t("Enter Amount")}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={6}>
                                    <FinancialAccountViewDetail financialAccountId={formik.values.debtorFinancialAccount} />
                                </Col>
                            </Row>
                        </Row>

                        <Row>
                            <Col><Button type={'submit'}>submit</Button></Col>
                        </Row>
                    </Container>
                </Form>
            </ModalBody>
        </Modal>
    );
};

export default CreateDirectCurrencyTransfer
