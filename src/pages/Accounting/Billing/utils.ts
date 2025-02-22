import {exportToXLSX} from "../../../helpers/export";
import {Party} from "../types";
import {t} from "i18next";
import axiosInstance from "../../../helpers/axios_instance";
import {GroupedByCurrency} from "./types";

export interface PartyForExport extends Pick<Party, 'transaction_type' |
    'transaction' | 'date' | 'time' | 'currency' | 'type' | 'balance'> {
    debtor_amount?: number;
    creditor_amount?: number;
}

export const getRowsForExport = (data: Party[]) => {
    return data?.map((party: Party, index: number) => {
        const partyForExport: PartyForExport = {
            transaction_type: party.transaction_type,
            transaction: party.transaction,
            date: party.date,
            time: party.time,
            currency: party.currency,
            type: party.type,
            balance: party.balance,
            debtor_amount: party?.type === 'debtor' ? party.amount : 0,
            creditor_amount: party?.type === 'creditor' ? party.amount : 0,
        }
        return partyForExport
    });
}

export const columnsForExport = [
    t("transaction_type"),
    t("transaction"),
    t("date"),
    t("time"),
    t("currency"),
    t("debtor_amount"),
    t("creditor_amount"),
    t("balance")
]


export const onExportXlsxClicked = (data: Party[]) => {
    const columnsForPDF = columnsForExport
    const rowsForPDF = getRowsForExport(data);

    exportToXLSX(columnsForPDF, rowsForPDF)
}

export const createTempoDownloadLink = (blob: Blob, fileName: string) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click(); // Trigger the download

    // Cleanup
    document.body.removeChild(link);
}

export const groupByCurrency = async (
    parties: Party[]
): Promise<{ currency: string; previous_balance: number; total_creditor: number; total_debtor: number; balance: number }[]> => {
    const grouped = await parties.reduce(async (accPromise, party) => {
        const acc: any = await accPromise;
        const currencyName = party.currency ?? 'unknown';

        if (!acc[currencyName]) {
            let previous_balance = 0;
            try {
                const response = await axiosInstance.get(`/transactions/previous-balance/party/${party.id}/`);
                previous_balance = response.data;
            } catch (error) {
                console.error(error);
            }

            acc[currencyName] = {
                previous_balance: previous_balance,
                total_creditor: 0,
                total_debtor: 0,
                balance: 0,
            };

        }

        if (party.type === 'creditor' && party.amount) {
            acc[currencyName].total_creditor += Number(party.amount);
        } else if (party.type === 'debtor' && party.amount) {
            acc[currencyName].total_debtor += Number(party.amount);
        }

        acc[currencyName].balance = Number(party.balance);
        return acc;
    }, Promise.resolve({} as Record<string, GroupedByCurrency>));

    // Transform the object into an array
    return Object.keys(grouped).map((currency) => ({
        currency: currency,
        ...grouped[currency],
    }));
};