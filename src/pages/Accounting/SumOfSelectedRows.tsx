import React, {useCallback, useMemo, useState} from 'react';
import {AccumulatedAmountType, Party} from "./types";
import {Button, Modal, ModalBody, ModalHeader, Table} from "reactstrap";
import {t} from "i18next";
import {useSelector} from "react-redux";
import {Currency} from "../Reports/utils";
import {getCurrencyById, getCurrencyNameById} from "../../helpers/currency";
import CurrencyNameAndFlag from "../Reports/CurrencyNameAndFlag";
import CreditorDebtorAmount from "../Reports/CreditorsAndDebtors/CreditorDebtorAmount";
import BalanceAmount from "../Reports/BalanceAmount";

interface Props {
    selectedRows?: Party[];
}

const SumOfSelectedRows: React.FC<Props> = ({ selectedRows }) => {
    const [modal, setModal] = useState<boolean>(false);
    const {currencies} = useSelector((state: any) => state.InitialData);

    const toggle = useCallback(() => {
        if (modal) {
            setModal(false);
        } else {
            setModal(true);
        }
    }, [modal]);

    const accumulatedAmounts = useMemo(() => {
        if(!selectedRows) return [];
        const groupedByCurrency = selectedRows.reduce((acc: any, party: Party) => {
            const { currency } = party;
            if(!currency)
                return acc;

            const currencyName = getCurrencyNameById(currencies, currency);
            if(!currencyName)
                return acc;

            if (!acc[currencyName]) {
                acc[currencyName] = [];
            }
            acc[currencyName].push(party);
            return acc;
        }, {} as Record<string, Party[]>);

        const accumulated: AccumulatedAmountType[] = []
        Object.entries(groupedByCurrency).forEach(([key, value]) => {
            // @ts-ignore
            const accumulatedAmount = value?.reduce((acc: any, party: Party) => {
                if(!acc?.[party.type]) {
                    acc[party.type] = 0
                }
                acc[party.type] += Number(party.amount)

                return acc;
            }, {} as Record<string, number>)
            // @ts-ignore
            const currency = getCurrencyById(currencies, value?.[0]?.currency)
            const debtor_amount = accumulatedAmount['debtor'] || 0;
            const creditor_amount = accumulatedAmount['creditor'] || 0;

            accumulated.push({
                currency: currency,
                debtor_amount: debtor_amount,
                creditor_amount: creditor_amount,
                balance: (-1 * debtor_amount) + creditor_amount
            })
        });

        return accumulated;

    }, [selectedRows]);



    return (
        <React.Fragment>
            <Button type='button' color={'primary'} onClick={() => setModal(true)}>
                {t("Sum of Selected Rows")}
            </Button>
            <Modal isOpen={modal} toggle={toggle} centered>
                <ModalHeader className="bg-primary-subtle p-3" toggle={toggle}>
                    {t("Sum of Selected Rows")}
                </ModalHeader>
                <ModalBody>
                    <Table className={'table table-hover table-bordered'}>
                        <thead className={"table-light"}>
                            <tr>
                                <th>
                                    {t("Currency Type")}
                                </th>
                                <th>
                                    {t("Debtor")}
                                </th>
                                <th>
                                    {t("Creditor")}
                                </th>
                                <th>
                                    {t("Balance")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {accumulatedAmounts.map((acc, index) => (
                            <tr key={index}>
                                <td>
                                    <CurrencyNameAndFlag currencyId={acc?.currency?.id} />
                                </td>
                                <td>
                                    <CreditorDebtorAmount
                                        type={"debtor"}
                                        party_type={'debtor'}
                                        amount={acc.debtor_amount}
                                    />
                                </td>
                                <td>
                                    <CreditorDebtorAmount
                                        type={"creditor"}
                                        party_type={'creditor'}
                                        amount={acc.creditor_amount}
                                    />
                                </td>
                                <td>
                                    <BalanceAmount amount={acc.balance} />
                                </td>
                            </tr>
                        ))

                        }
                        </tbody>
                    </Table>
                </ModalBody>
            </Modal>
        </React.Fragment>
    );
};

export default SumOfSelectedRows;