import { t } from 'i18next';
import SelectFinancialAccount from 'pages/Accounting/SelectFinancialAccount';
import { FinancialAccount } from 'pages/Accounting/types';
import React, { useMemo } from 'react'
import {Button, Col, FormGroup, Label, Row} from 'reactstrap';
import Select from "react-select";
import LockInputButton from "../../../../Components/Common/LockInputButton";
import FinancialAccountViewDetail from "../../../ManageFinancialAccounts/FinancialAccountViewDetail";



interface Props {
    formik: any;
}

const SelectFinancialAccountAndTradeType: React.FC<Props> = ({ formik }) => {
    const options: any = useMemo(() => {
        return [
            {label: t("Buy"), value: true},
            {label: t("Sell"), value: false}
        ]
    }, []) 
    
    return (
        <Row className={'border border-1 p-1'}>
            <Col md={7} sm={12}>
              <Row>
                <FormGroup row>
                    <Label for={'financialAccount'} md={2}>{t("Financial Account")}</Label>
                    <Col lg={8}>
                        <SelectFinancialAccount selectedFinancialAccountId={formik.values.financialAccount}
                                                onSelectFinancialAccount={(acc: FinancialAccount) => formik.setFieldValue('financialAccount', acc?.id)}
                        />
                        {formik.errors.financialAccount && (<Label className={'text-danger'}>{t(formik.errors.financialAccount)}</Label>)}
                    </Col>
                    <Col>
                        <LockInputButton isLocked={formik.values.isFinancialAccountLocked} onClick={formik.toggleFinancialAccountLock} />
                    </Col>
                </FormGroup>
              </Row>
              <Row>
                <FormGroup row>
                    <Label for={'tradeType'} md={2}>{t("Trade Type")}</Label>
                    <Col>
                        <Select
                            options={options}
                            onChange={(item: any) => formik.setFieldValue('isBuy', item.value)}
                            value={formik.values.isBuy? options[0]: options[1]}
                            isDisabled={formik.derivedState.areInputsDisabled}
                        />
                    </Col>
                    <Col md={2}>
                        <LockInputButton isLocked={formik.values.isIsBuyLocked} onClick={formik.toggleIsBuyLock} />
                    </Col>
                </FormGroup>
              </Row>
            </Col>
            <Col md={5} sm={12}>
                <Row >
                    <FinancialAccountViewDetail
                        financialAccountId={formik.values?.[`financialAccount`]}
                        forceUpdate={formik.values.forceUpdateFinancialAccountsBalance}
                    />
                </Row>
            </Col>
        </Row>
  )
}

export default SelectFinancialAccountAndTradeType
