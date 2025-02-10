import React, {useMemo, useState} from 'react';
import {Card, CardBody, CardHeader, Col, Container} from "reactstrap";
import {t} from "i18next";
import {ColumnDef} from "@tanstack/table-core";
import CustomTableContainer from "../CustomTableContainer";
import {useSelector} from "react-redux";
import {Currency} from "../utils";
import IndeterminateCheckbox from "../IndetermineCheckbox";
import CurrencyNameAndFlag from "../CurrencyNameAndFlag";
import BalanceAmount from "../BalanceAmount";
import CreditorsAndDebtorsExtraHeader from "./CreditorsAndDebtorsExtraHeader";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { PartyType, partyTypeOptions } from '../SelectPartyType';
import {getCurrencyNameById} from "../../../helpers/currency";
import {CurrencyAccount} from "../../Accounting/types";


interface Filters {
    partyType?: PartyType;
    currency?: Currency;
}


const CreditorsAndDebtors = () => {
    const currencies = useSelector((state: any) => state.InitialData.currencies);
    const [currency, setCurrency] =
        useState<Currency>(currencies.find((c: Currency) => c.name === "USD"));
    const [partyType, setPartyType] = useState<PartyType>(partyTypeOptions[0]);

    const [itemsChanged, setItemsChanged] = useState<boolean>(false);

    const filters: Filters = useMemo(() => {
        return {
            party_type: partyType?.name,
            currency: currency,
        }
    }, [partyType, currency])

    const columns = useMemo<ColumnDef<CurrencyAccount>[]>(() => {
        return (
            [
                {
                    id: 'select',
                    header: ({ table }) => (
                        <IndeterminateCheckbox
                            {...{
                                checked: table.getIsAllRowsSelected(),
                                indeterminate: table.getIsSomeRowsSelected(),
                                onChange: table.getToggleAllRowsSelectedHandler(),
                            }}
                        />
                    ),
                    cell: ({ row }) => (
                        <div className="px-1">
                            <IndeterminateCheckbox
                                {...{
                                    checked: row.getIsSelected(),
                                    disabled: !row.getCanSelect(),
                                    indeterminate: row.getIsSomeSelected(),
                                    onChange: row.getToggleSelectedHandler(),
                                }}
                            />
                        </div>
                    ),
                    size: 10
                },
                {
                    header: t("Account Name"),
                    cell: info => info.row.original.financial_account.name,
                    size: 20,
                },
                {
                    header: t("Account Number"),
                    cell: info => info.row.original.financial_account.full_code,
                    size: 60,
                },
                {
                    header: t("Currency Type"),
                    cell: info => <CurrencyNameAndFlag currencyName={
                        getCurrencyNameById(currencies, info.row.original.currency)
                    } />,
                    minSize: 10,  // Ensure the column doesn't shrink below this size
                    maxSize: 10,  // Prevent resizing beyond this size
                    width: 10     // Explicitly set the width
                },
                {
                    header: t("Balance"),
                    cell: info => <BalanceAmount amount={info.row.original.balance} /> ,
                    size: 60,
                },
            ]
        )
    }, [currencies])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={t("Creditors And Debtors")} pageTitle={t("Reports")} />
                    <Col lg={12}>
                        <Card>
                            <CardHeader>
                                <CreditorsAndDebtorsExtraHeader currency={currency} 
                                setCurrency={(newOption: Currency) => setCurrency(newOption)}
                                partyType={partyType} setPartyType={setPartyType} />
                            </CardHeader>
                            <CardBody>
                                <React.Fragment >
                                    <CustomTableContainer
                                        loadItemsApi='statistics-information/creditors-and-debtors/'
                                        columns={(columns || [])}
                                        filters={filters}
                                        itemsChanged={itemsChanged}
                                        setItemsChanged={setItemsChanged}
                                    />
                                </React.Fragment >
                            </CardBody>
                        </Card>
                    </Col>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default CreditorsAndDebtors;