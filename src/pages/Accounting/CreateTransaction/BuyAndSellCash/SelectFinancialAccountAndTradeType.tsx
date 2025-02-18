import { t } from 'i18next';
import SelectFinancialAccount from 'pages/Accounting/SelectFinancialAccount';
import { FinancialAccount } from 'pages/Accounting/types';
import React, { useMemo } from 'react'
import { Col, FormGroup, Label, Row } from 'reactstrap';
import Select from "react-select";



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
    <Row>
      <Col md={6} >
        <FormGroup row>
            <Label for={'financialAccount'} md={2}>{t("Financial Account")}</Label>
            <Col>
                <SelectFinancialAccount selectedFinancialAccountId={formik.values.financialAccount}
                                        onSelectFinancialAccount={(acc: FinancialAccount) => formik.setFieldValue('financialAccount', acc?.id)}
                />
            </Col>
        </FormGroup>
      </Col>
      <Col md={6}>
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
        </FormGroup>
      </Col>
    </Row>
  )
}

export default SelectFinancialAccountAndTradeType
