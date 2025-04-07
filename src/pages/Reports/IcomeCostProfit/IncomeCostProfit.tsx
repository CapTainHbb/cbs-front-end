import BreadCrumb from 'Components/Common/BreadCrumb'
import React, {useCallback, useMemo, useState} from 'react'
import { Card, CardBody, CardHeader, Col, Container } from 'reactstrap'
import GeneralReportExtraHeader from './GeneralReportExtraHeader';
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
import { CurrencyAccount } from 'pages/Accounting/types';

interface IncomeCostProfitReportItemType {
    exchanged_amount: number;
    currency_accounts: CurrencyAccount[];
    type: "income" | "gross-cost" | 'benefit-loss'
}

const IncomeCostProfit = () => {
  const [fromDate, setFromDate] = useState<string | null>(getFormattedToday());
  const [toDate, setToDate] = useState<string | null>(getFormattedToday());

  const referenceCurrency = useSelector((state: any) => state.InitialData.referenceCurrency);
  const referenceCurrencies = useSelector((state: any) => state.InitialData.referenceCurrencies);
  const [itemsAreLoading, setItemsAreLoading] = useState<boolean>(false)
  const [itemsChanged, setItemsChanged] = useState<boolean>(false)

    const columns = useMemo<ColumnDef<IncomeCostProfitReportItemType>[]>(
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
            minSize: 35,  // Ensure the column doesn't shrink below this size
            maxSize: 35,  // Prevent resizing beyond this size
            width: 35      // Explicitly set the width
        },
        {
            id: "type",
            cell: (info) => t(info.row.original.type),
            header: () => <span>{t("Report Type")}</span>,
            minSize: 80,  // Ensure the column doesn't shrink below this size
            maxSize: 80,  // Prevent resizing beyond this size
            width: 80      // Explicitly set the width
        },
        {
            id: 'exchanged_amounts',
            cell: (info) =>  <BalanceAmount
                amount={info.row.original.exchanged_amount}

            />,
            header: () => <Col lg={12}>
                <p>{t("Exchanged Total Amount")}</p>
                <CurrencyNameAndFlag currencyId={referenceCurrency?.id} />
            </Col>,
            minSize: 120,  // Ensure the column doesn't shrink below this size
            maxSize: 120,  // Prevent resizing beyond this size
            width: 120      // Explicitly set the width
        },
        ...currencyColumns(referenceCurrencies),
    ],
    [referenceCurrencies, referenceCurrency]
  );

  const urlToFetch = useMemo(() => {
        return `statistics-information/income-cost-profit/?from_date=${fromDate}&to_date=${toDate}`;
  }, [fromDate, toDate])

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title={t("Income Cost And Profit")} pageTitle={t("Reports")} />
          <Col lg={12}>
            <Card>
                <CardHeader>
                    <GeneralReportExtraHeader
                        fromDate={fromDate} onChangeFromDate={setFromDate}
                        toDate={toDate} onChangeToDate={setToDate}
                        itemsChanged={itemsChanged} setItemsChanged={setItemsChanged}
                        itemsAreLoading={itemsAreLoading}
                     />
                </CardHeader>
                <CardBody>
                    <React.Fragment >
                        <CustomTableContainer
                            itemsChanged={itemsChanged}
                            loadMethod={'GET'}
                            setItemsChanged={setItemsChanged}
                            loadItemsApi={urlToFetch}
                            columns={(columns || [])}
                            hasPagination={false}
                            setItemsAreLoading={setItemsAreLoading}
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
