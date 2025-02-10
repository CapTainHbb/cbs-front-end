import BreadCrumb from 'Components/Common/BreadCrumb'
import React, { useMemo, useState } from 'react'
import { Card, CardBody, CardHeader, Col, Container } from 'reactstrap'
import IncomeCostProfitExtraHeader from './IncomeCostProfitExtraHeader';
import CustomTableContainer from '../CustomTableContainer';
import { ColumnDef } from '@tanstack/react-table';
import IndeterminateCheckbox from '../IndetermineCheckbox';
import { t } from 'i18next';
import { ReportItemType } from '../types';
import BalanceAmount from '../BalanceAmount';
import CurrencyNameAndFlag from '../CurrencyNameAndFlag';
import { currencyColumns } from '../utils';
import { useSelector } from 'react-redux';
import {getFormattedToday} from "../../../helpers/date";

export interface Filters {
  from_date: string;
  to_date: string;
}

const IncomeCostProfit = () => {
  const [fromDate, setFromDate] = useState<string>(getFormattedToday());
  const [toDate, setToDate] = useState<string>(getFormattedToday());

  const referenceCurrency = useSelector((state: any) => state.InitialData.referenceCurrency);
  const referenceCurrencies = useSelector((state: any) => state.InitialData.referenceCurrencies);

    const [itemsChanged, setItemsChanged] = useState<boolean>(false)

  const filters: Filters = useMemo(() => {
        return {
            from_date: fromDate,
            to_date: toDate,
        }
    }, [fromDate, toDate])

    const columns = useMemo<ColumnDef<ReportItemType>[]>(
    () => [
        {
            id: "select",
            header: ({ table }) => (
                <IndeterminateCheckbox
                    checked={table.getIsAllRowsSelected()}
                    indeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <IndeterminateCheckbox
                        checked={row.getIsSelected()}
                        disabled={!row.getCanSelect()}
                        indeterminate={row.getIsSomeSelected()}
                        onChange={row.getToggleSelectedHandler()}
                    />
                </div>
            ),
            minSize: 5,  // Ensure the column doesn't shrink below this size
            maxSize: 5,  // Prevent resizing beyond this size
            width: 5     // Explicitly set the width
        },
        {
            id: "type",
            cell: (info) => t(info.row.original.name),
            header: () => <span>{t("Report Type")}</span>,
            minSize: 40,
        },
        {
            id: 'exchanged_amounts',
            cell: (info) =>  <BalanceAmount
                amount={info.row.original.exchanged_amounts}

            />,
            header: () => <Col lg={12}>
                <p>{t("Exchanged Total Amount")}</p>
                <CurrencyNameAndFlag currencyName={referenceCurrency?.name} />
            </Col>,
            size: 50,
        },
        ...currencyColumns(referenceCurrencies),
    ],
    [referenceCurrencies, referenceCurrency]
  );

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title={t("Income Cost And Profit")} pageTitle={t("Reports")} />
          <Col lg={12}>
            <Card>
                <CardHeader>
                    <IncomeCostProfitExtraHeader 
                        fromDate={fromDate} onChangeFromDate={setFromDate}
                        toDate={toDate} onChangeToDate={setToDate}
                     />
                </CardHeader>
                <CardBody>
                    <React.Fragment >
                        <CustomTableContainer
                            itemsChanged={itemsChanged}
                            setItemsChanged={setItemsChanged}
                            loadItemsApi='statistics-information/income-cost-profit/'
                            columns={(columns || [])}
                            filters={filters}
                        />
                    </React.Fragment >
                </CardBody>
            </Card>
          </Col>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default IncomeCostProfit
