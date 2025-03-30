import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FinancialAccount} from "../types";
import {Button, Col, Label, Row} from "reactstrap";
import SelectCurrency from "../../Reports/SelectCurrency/SelectCurrency";
import {Currency} from "../../Reports/utils";
import SelectTransactionType from "../SelectTransactionType";
import {t} from "i18next";
import FinancialAccountViewDetail from "../../ManageFinancialAccounts/FinancialAccountViewDetail";
import SelectFinancialAccount from "../SelectFinancialAccount";
import DownloadBillingPdf from "./exports/DownloadBillingPdf";
import {useBillingFilters} from "./hooks/useBillingFilters";
import Flatpickr from "react-flatpickr";
import {getUTCFormattedDateTime} from "../../../helpers/date";
import DownloadBillingXlsx from "./exports/DownloadBillingXlsx";
import Select from "react-select";
import {Link} from "react-router-dom";
import ChangePageContainer from "../../Reports/ChangePageContainer";

interface Props {
    table: any;
    itemsChanged?: boolean;
    setItemsChanged: any;
}

const BillingExtraHeader: React.FC<Props> = ({ table, setItemsChanged,
                                             itemsChanged}) => {

    const { filters, updateFilter } = useBillingFilters();
    const [pageSize, setPageSize] = useState<number>(table?.getState().pagination.pageSize);
    const onChangeFinancialAccount = useCallback((acc: FinancialAccount) => {
        updateFilter("financial_account", acc?.id)
    }, [updateFilter])

    const pageSizeOptions = useMemo(() => {
        return [
            {label: "30", value: 30},
            {label: "50", value: 50},
            {label: "70", value: 70},
            {label: "100", value: 100},
            {label: "150", value: 150},
            {label: "200", value: 200},
        ]
    }, []);

    return (
        <Row>
            <Col md={9} sm={12}>
                <Row>
                    <Col md={9} sm={12}>
                        <Row>
                            <Col md={6} sm={12}>
                                <Label>{t("Financial Account")}</Label>
                                <SelectFinancialAccount onSelectFinancialAccount={onChangeFinancialAccount}
                                                        selectedFinancialAccountId={filters?.financial_account} />
                            </Col>
                            <Col md={3} sm={12}>
                                <Label>{t("Currency Type")}</Label>
                                <SelectCurrency currencyId={filters?.currency}
                                                onCurrencyChange={(item: Currency) => updateFilter('currency', item?.id)} />
                            </Col>
                            <Col md={3} sm={12}>
                                <Label>{t("Transaction Type")}</Label>
                                <SelectTransactionType
                                    transactionType={filters?.transaction_type}
                                    onTransactionTypeChange={(e: any) => updateFilter('transaction_type', e)}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={2} sm={12}>
                                <Label>{t("From Date")}</Label>
                                <Flatpickr
                                    className="form-control"
                                    name={'date_from'}
                                    options={{
                                        dateFormat: "Y-m-d",
                                    }}
                                    onChange={([selectedDate]) => updateFilter("date_from", getUTCFormattedDateTime(selectedDate).date)}
                                    value={filters?.date_from}
                                />
                            </Col>
                            <Col md={2} sm={12}>
                                <Label>{t("To Date")}</Label>
                                <Flatpickr
                                    className="form-control"
                                    name={'date_to'}
                                    options={{
                                        dateFormat: "Y-m-d",
                                    }}
                                    onChange={([selectedDate]) => updateFilter("date_to", getUTCFormattedDateTime(selectedDate).date)}
                                    value={filters?.date_to}
                                />
                            </Col>
                            <Col md={3} sm={12}>
                                <Label>{t("Number of Last Transactions Per Page")}</Label>
                                <Select
                                    options={pageSizeOptions}
                                    onChange={(item: any) => {
                                        table?.setPageSize?.(item?.value);
                                        setPageSize(item.value);
                                    }}
                                    value={pageSizeOptions?.find((item) => item.value === pageSize) || pageSizeOptions[0] }
                                />
                            </Col>
                        </Row>
                    </Col>

                    <Col md={3} sm={12}>
                        <Row>
                            <Row>
                                <Button color='primary' className={'w-100'}
                                        onClick={() => setItemsChanged(!itemsChanged)}>
                                    <i className='ri-refresh-fill'/> {t("Refresh")}
                                </Button>
                            </Row>
                            <Row>
                                <DownloadBillingPdf/>
                            </Row>
                            <Row>
                                <DownloadBillingXlsx/>
                            </Row>
                        </Row>
                    </Col>
                </Row>
            </Col>

            <Col style={{maxHeight: "250px", overflowY: "auto"}} md={3} sm={12}>
                <FinancialAccountViewDetail financialAccountId={filters?.financial_account} forceUpdate={itemsChanged}/>
            </Col>
        </Row>

    );
};

export default BillingExtraHeader;