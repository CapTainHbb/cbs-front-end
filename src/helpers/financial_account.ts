import {FinancialAccount} from "../pages/Accounting/types";


export const getFinancialAccountById = (financialAccounts: FinancialAccount[], id: number | undefined) => {
    return financialAccounts.find((f) => f.id === id);
}