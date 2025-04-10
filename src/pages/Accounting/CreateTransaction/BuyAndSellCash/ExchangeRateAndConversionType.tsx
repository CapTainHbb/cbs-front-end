import { t } from 'i18next';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {Button, Col, FormFeedback, FormGroup, Input, Label, Row, Spinner} from 'reactstrap';
import Select from 'react-select';
import axiosInstance from "../../../../helpers/axios_instance";
import {removeExtraZerosFromFractional} from "../../utils";
import { calculateNewExchangeRate } from './utils';

interface Props {
    formik: any;
}

const ExchangeRateAndConversionType: React.FC<Props> = ({ formik }) => {
    const exhcangeRateComponentRef = useRef<HTMLInputElement>(null);
    const [isXeRatesLoading, setIsXeRatesLoading] = useState<boolean>(false);

    useEffect(() => {
        const component = exhcangeRateComponentRef.current;
    
        const handleFocus = () => formik.setFieldValue("isFocusedOnExchangeRate", true);
        const handleBlur = () => formik.setFieldValue("isFocusedOnExchangeRate", false);
    
        if (component) {
          component.addEventListener('focus', handleFocus, true);
          component.addEventListener('blur', handleBlur, true);
        }
    
        return () => {
          if (component) {
            component.removeEventListener('focus', handleFocus, true);
            component.removeEventListener('blur', handleBlur, true);
          }
        };
      }, []);

    const conversionTypeOptions = useMemo(() => {
        return [
            {label: ('÷' + "  " + t("Division")), value: 'division'},
            {label: ('x' + "  " + t("Multiplication")), value: 'multiplication'}
        ]
    }, [t])

    const onExchangeRateChange = useCallback((e: any) => {
        formik.handleExchangeRateInputChange('exchangeRate', e.target.value);
        formik.updateAgainstAmount(e.target.value, formik.values.conversionType, formik.values.baseAmount);
    }, [formik.values.conversionType, formik.values.baseAmount]);

    const onConversionTypeChange = useCallback((item: any) => {
        formik.setFieldValue('conversionType', item.value);
        formik.updateAgainstAmount(formik.values.exchangeRate, item.value, formik.values.baseAmount);
    }, [formik.values.exchangeRate, formik.values.baseAmount]);


    const onClickRateBasedOnXe = useCallback(async (e: any) => {
        const data = {
            from_currency_id: formik.values.conversionType === 'multiplication' ? formik.values.baseCurrency : formik.values.againstCurrency,
            to_currency_id: formik.values.conversionType === 'multiplication' ? formik.values.againstCurrency : formik.values.baseCurrency,
        }
        setIsXeRatesLoading(true);
        axiosInstance.post('/currencies/xe-exchange-rate/', data)
            .then(response => {
                formik.handleExchangeRateInputChange('exchangeRate', removeExtraZerosFromFractional(String(response.data)));
                formik.updateAgainstAmount(String(response.data), formik.values.conversionType, formik.values.baseAmount);
            })
            .catch(error => console.error(error))
            .finally(() => setIsXeRatesLoading(false));
    }, [formik]);

    useEffect(() => {
        if(formik.values.isFocusedOnExchangeRate || !(formik.values.isFocusedOnBaseAmount || formik.values.isFocusedOnAgainstAmount)) {
            return;  
        } 
        const newRate = calculateNewExchangeRate(formik.values.baseAmount, formik.values.againstAmount, formik.values.conversionType)
        formik.handleExchangeRateInputChange('exchangeRate', newRate);
    }, [formik.values.baseAmount, formik.values.againstAmount]);

    return (
    <Row className="align-items-center border border-1 pt-1">
      <Col md={8}>
        <FormGroup row>
            <Label md={2} >{t("Conversion Operator")}</Label>
            <Col md={3}>
                <Select 
                    options={conversionTypeOptions}
                    onChange={onConversionTypeChange}
                    value={formik.values.conversionType === "division"? conversionTypeOptions[0]: conversionTypeOptions[1]}
                    isDisabled={formik.derivedState.areInputsDisabled}
                />
            </Col>
            <Label md={2}>{t("Exchange Rate")}</Label>
            <Col md={5} sm={12}>
                <Input
                    id={'exchange-rate'}
                    innerRef={exhcangeRateComponentRef}
                    name={"exchangeRate"}
                    type="text"
                    value={formik.values?.exchangeRate}
                    onChange={onExchangeRateChange}
                    onBlur={formik.handleBlur}
                    placeholder={t("Enter Rate")}
                    invalid={
                        !!(formik.touched?.exchangeRate && formik.errors?.exchangeRate)
                    }
                    disabled={formik.derivedState.areInputsDisabled}
                />
                {formik.errors?.exchangeRate ? (
                    <FormFeedback type="invalid">{formik.errors?.exchangeRate}</FormFeedback>
                ) : null}
            </Col>
        </FormGroup>
      </Col>
      <Col md={4}>
          <Row>
              <Col md={6} sm={12}>
                  {isXeRatesLoading && <Spinner size={'small'} />}
                  {!isXeRatesLoading && <Button type={'button'} color={'primary'} className={'w-100'}
                                                disabled={formik.derivedState.areInputsDisabled}
                                                onClick={onClickRateBasedOnXe}
                  >
                      {t("Rate Based on XE")}
                  </Button>}
              </Col>
          </Row>
      </Col>
    </Row>
  )
}

export default ExchangeRateAndConversionType
