import { t } from 'i18next';
import React, { useMemo } from 'react'
import { Col, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';
import Select from 'react-select';

interface Props {
    formik: any;
}

const ExchangeRateAndConversionType: React.FC<Props> = ({ formik }) => {
    const conversionTypeOptions = useMemo(() => {
        return [
            {label: '÷', value: 'division'},
            {label: 'x', value: 'multiplication'}
        ]
    }, [])
  
    return (
    <Row>
      <Col md={6}>
        <FormGroup row>
            <Label md={2} >{t("Conversion Operator")}</Label>
            <Col>
                <Select 
                    options={conversionTypeOptions}
                    onChange={(item: any) => formik.setFieldValue('conversionType', item.value)}
                    value={formik.values.conversionType === "division"? conversionTypeOptions[0]: conversionTypeOptions[1]}
                    isDisabled={formik.derivedState.areInputsDisabled}
                />
            </Col>
        </FormGroup>

      </Col>
      <Col md={6}>
        <FormGroup row>
            <Label md={2}>{t("Exchange Rate")}</Label>
            <Col>
                <Input
                    id={'exchange-rate'}
                    name={"exchangeRate"}
                    type="text"
                    value={formik.values?.exchangeRate}
                    onChange={(e: any) => formik.handleNumberInputChange('exchangeRate', e)}
                    onBlur={formik.handleBlur}
                    placeholder={t("Enter Rate")}
                    invalid={
                        !!(formik.touched?.exchangeRate && formik.errors?.exchangeRate)
                    }
                    disabled={formik.derivedState.areInputsDisabled}
                />
                {formik.touched?.exchangeRate && formik.errors?.exchangeRate ? (
                    <FormFeedback type="invalid">{formik.errors?.exchangeRate}</FormFeedback>
                ) : null}
            </Col>
        </FormGroup>
      </Col>
    </Row>
  )
}

export default ExchangeRateAndConversionType
