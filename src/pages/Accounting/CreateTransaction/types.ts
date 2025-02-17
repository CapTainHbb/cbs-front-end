export interface CommonTransactionFormFields {
    id?: number,
    description: string,
    userSpecifiedId: string,
    dateTime: Date,
    createdAt?: string,
    createdBy?: any,
    isEditing: boolean,
    isDeleting: boolean,
    isCreate: boolean,
    nextTransactionId?: number,
    previousTransactionId?: number,
    forceUpdateFinancialAccountsBalance: boolean,
}
