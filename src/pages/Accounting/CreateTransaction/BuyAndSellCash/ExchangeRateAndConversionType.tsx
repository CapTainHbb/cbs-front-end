import { t } from 'i18next';
import React, {useCallback, useMemo, useState} from 'react'
import {Button, Col, FormFeedback, FormGroup, Input, Label, Row, Spinner} from 'reactstrap';
import Select from 'react-select';
import FinancialAccountViewDetail from "../../../ManageFinancialAccounts/FinancialAccountViewDetail";
import axiosInstance from "../../../../helpers/axios_instance";
import {removeNonNumberChars} from "../../utils";

interface Props {
    formik: any;
}

const ExchangeRateAndConversionType: React.FC<Props> = ({ formik }) => {
    const [isXeRatesLoading, setIsXeRatesLoading] = useState<boolean>(false);

    const conversionTypeOptions = useMemo(() => {
        return [
            {label: ('÷' + "  " + t("Division")), value: 'division'},
            {label: ('x' + "  " + t("Multiplication")), value: 'multiplication'}
        ]
    }, [t])

    const onExchangeRateChange = useCallback((e: any) => {
        formik.handleNumberInputChange('exchangeRate', e.target.value);
        formik.updateAgainstAmount(e.target.value, formik.values.conversionType, formik.values.baseAmount);
    }, [formik]);

    const onConversionTypeChange = useCallback((item: any) => {
        formik.setFieldValue('conversionType', item.value);
        formik.updateAgainstAmount(formik.values.exchangeRate, item.value, formik.values.baseAmount);
    }, [formik]);

    const onClickRateBasedOnAmounts = useCallback((e: any) => {
        let newExchangeRate = '';
        if(formik.values.conversionType === 'multiplication') {
            newExchangeRate = String(Number(removeNonNumberChars(formik.values.againstAmount)) / Number(removeNonNumberChars(formik.values.baseAmount)));
        } else {
            newExchangeRate = String(Number(removeNonNumberChars(formik.values.baseAmount)) / Number(removeNonNumberChars(formik.values.againstAmount)));
        }
        formik.handleNumberInputChange('exchangeRate', newExchangeRate);
        formik.updateAgainstAmount(newExchangeRate, formik.values.conversionType, formik.values.baseAmount);
    }, [formik]);

    const onClickRateBasedOnXe = useCallback(async (e: any) => {
        const data = {
            from_currency_id: formik.values.conversionType === 'multiplication' ? formik.values.baseCurrency : formik.values.againstCurrency,
            to_currency_id: formik.values.conversionType === 'multiplication' ? formik.values.againstCurrency : formik.values.baseCurrency,
        }
        setIsXeRatesLoading(true);
        axiosInstance.post('/currencies/xe-exchange-rate/', data)
            .then(response => {
                formik.handleNumberInputChange('exchangeRate', String(response.data));
                formik.updateAgainstAmount(String(response.data), formik.values.conversionType, formik.values.baseAmount);
            })
            .catch(error => console.error(error))
            .finally(() => setIsXeRatesLoading(false));
    }, [formik]);

    return (
    <Row className="align-items-center">
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
        </FormGroup>
        <Row>
              <FormGroup row className={'gap-1'}>
                  <Label md={2}>{t("Exchange Rate")}</Label>
                  <Col md={3} sm={12}>
                      <Input
                          id={'exchange-rate'}
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
                      {formik.touched?.exchangeRate && formik.errors?.exchangeRate ? (
                          <FormFeedback type="invalid">{formik.errors?.exchangeRate}</FormFeedback>
                      ) : null}
                  </Col>
                  <Col md={3} sm={12}>
                      <Button type={'button'} color={'primary'} className={'w-100'}
                              disabled={formik.derivedState.areInputsDisabled}
                              onClick={onClickRateBasedOnAmounts}
                      >
                          {t("Rate Based on Amounts")}
                      </Button>
                  </Col>
                  <Col md={3} sm={12}>
                      {isXeRatesLoading && <Spinner size={'small'} />}
                      {!isXeRatesLoading && <Button type={'button'} color={'primary'} className={'w-100'}
                              disabled={formik.derivedState.areInputsDisabled}
                              onClick={onClickRateBasedOnXe}
                      >
                          {t("Rate Based on XE")}
                      </Button>}
                  </Col>
              </FormGroup>
          </Row>
      </Col>
      <Col md={4}>
          <FinancialAccountViewDetail
              financialAccountId={formik.values?.[`financialAccount`]}
              forceUpdate={formik.values.forceUpdateFinancialAccountsBalance}
          />
      </Col>
    </Row>
  )
}

export default ExchangeRateAndConversionType
