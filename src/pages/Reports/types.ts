export interface ReportItemType {
    id: number;
    name: string;
    code: string;
    full_code: string;
    parent_group: any;
    balance_currency_accounts: any;
    creditor_currency_accounts: any;
    debtor_currency_accounts: any;
    exchanged_amount: number;
    type: string;
    from_date: any;
    to_date: any;
}