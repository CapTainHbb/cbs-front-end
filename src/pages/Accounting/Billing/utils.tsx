import {exportToXLSX} from "../../../helpers/export";
import {FinancialAccount, Party} from "../types";
import {t} from "i18next";
import axiosInstance from "../../../helpers/axios_instance";
import {GroupedByCurrency} from "./types";

export interface PartyForExport extends Pick<Party, 'transaction_type' |
    'transaction' | 'date' | 'time' | 'currency' | 'type' | 'balance'> {
    debtor_amount?: number;
    creditor_amount?: number;
}

export const getRowsForExport = (data: Party[], currencies: any) => {
    return data?.map((party: Party, index: number) => {
        const partyForExport: PartyForExport = {
            transaction_type: t(party.transaction_type),
            transaction: party.transaction,
            date: party.date,
            time: party.time,
            currency: currencies.find((acc: FinancialAccount) => acc.id === party.currency).name ,
            type: party.type,
            debtor_amount: party?.type === 'debtor' ? party.amount : 0,
            creditor_amount: party?.type === 'creditor' ? party.amount : 0,
            balance: party.balance,
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


export const generateXlsx = (data: Party[], selectedFinancialAccount: FinancialAccount, currencies: any) => {
    const columnsForPDF = columnsForExport
    const rowsForPDF = getRowsForExport(data, currencies);
    exportToXLSX(columnsForPDF, rowsForPDF, selectedFinancialAccount?.full_name)
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

export const groupPartiesByDate = (parties: Party[]): (Party | { headerContent: any; isHeader: true })[] => {
    if(!parties) return []

    const processedList: (Party | { headerContent: any; isHeader: true })[] = [];
    let lastDate: string | null = null;

    for (const party of parties) {
        if (party.date !== lastDate) {
            processedList.push({ headerContent: (new Date(party.date)).toLocaleDateString(), isHeader: true }); // Insert header
            lastDate = party.date;
        }
        processedList.push(party); // Insert actual item
    }

    return processedList;
};


export const getTransactionTypeCell = (info: any) => {
        const { document_type, transaction_type } = info.row.original;

        if (document_type !== "main") {
            if (document_type === 'interest' || document_type === 'standalone-interest') {
                return <span className={'badge bg-success-subtle text-success fs-11'}>{t("Received Fee")}</span>;
            } else if (document_type === 'cost' || document_type === 'standalone-cost') {
                return <span className={'badge bg-danger-subtle text-danger fs-11'}>{t("Paid Fee")}</span>;
            }
        } else {
            switch (transaction_type) {
                case 'direct-currency-transfer':
                    return <p className="badge bg-primary-subtle text-primary fs-11">{t(String(info.getValue()))}</p>;
                case 'sell-cash':
                    return <p className="badge bg-secondary-subtle text-secondary fs-11">{t(String(info.getValue()))}</p>;
                case 'buy-cash':
                    return <p className="badge bg-warning-subtle text-warning fs-11">{t(String(info.getValue()))}</p>;
                case 'local-payments':
                    return <p className="badge bg-info-subtle text-info fs-11">{t(String(info.getValue()))}</p>;
                default:
                    return null;
            }
        }

        return null;
};