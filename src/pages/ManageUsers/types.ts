import {t} from "i18next";


export const statusOptions = [
    {label: t("Active"), value: true},
    {label: t("Inactive"), value: false}
]

export const roleOptions = [
    {label: t("Admin"), value: "admin"},
    {label: t("Manager"), value: 'manager'},
    {label: t("DepartmentManager"), value: 'department_manager'},
    {label: t("BranchManager"), value: 'branch_manager'},
    {label: t("Level1Employee"), value: 'level_1_employee'},
    {label: t("Level2Employee"), value: 'Level_2_employee'},
    {label: t("Level3Employee"), value: 'level_3_employee'},
]

export interface User {
    id?: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_active: boolean;
    is_superuser: boolean;
    last_login?: string;
    date_joined?: string;
    password?: string;
    repeat_password?: string;
    groups: any;
    user_permissions: any;
}

export interface UserProfile {
    id?: number;
    user: User;
    profile_photo?: string;
    role: string;
    date_joined: any;
}

export interface Filters {
    username: string | undefined;
    first_name: string | undefined;
    last_name: string | undefined;
    email: string | undefined;
    is_active: boolean | undefined;
    role: string | undefined;
}

export interface Permission {
    id: number;
    codename: string;
    model: string;
    app_label: string;
}