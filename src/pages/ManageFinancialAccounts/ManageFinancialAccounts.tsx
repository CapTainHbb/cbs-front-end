import React, {useCallback, useEffect, useMemo, useState} from 'react';
import DeleteModal from "../../Components/Common/DeleteModal";

import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container, DropdownItem, DropdownMenu, DropdownToggle,
    Form, FormFeedback,
    Input,
    Label,
    Modal,
    ModalBody, ModalFooter,
    ModalHeader,
    Row, Table, UncontrolledDropdown
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {t} from "i18next";
import CustomTableContainer from "../Reports/CustomTableContainer";
import {AccountGroup, FinancialAccount} from "../Accounting/types";
import IndeterminateCheckbox from "../Reports/IndetermineCheckbox";
import {ColumnDef} from "@tanstack/react-table";
import FinancialAccountViewDetail from "./FinancialAccountViewDetail";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useSelector} from "react-redux";
import SelectAccountGroup from "./SelectAccountGroup";
import {toast, ToastContainer} from "react-toastify";
import axiosInstance from "../../helpers/axios_instance";
import {normalizeDjangoError} from "../../helpers/error";

interface Filters {
    name?: string;
    fullCode?: string;
    code?: string;
    parentGroup?: number;
}

const ManageFinancialAccounts = () => {
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [modal, setModal] = useState<boolean>(false);
    const [activeFinancialAccount, setActiveFinancialAccount] = useState<FinancialAccount | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [itemsChanged, setItemsChanged] = useState<boolean>(false);

    const [name, setName] = useState(undefined);
    const [fullCode, setFullCode] = useState(undefined);
    const [code] = useState(undefined);
    // const [parentGroup] = useState<AccountGroup | undefined>(undefined);

    const accountGroups = useSelector((state: any) => state.InitialData.accountGroups);

    const [info, setInfo] = useState<FinancialAccount | null>(null);

    const findAccountGroupById = useCallback((id: any): AccountGroup => {
        return accountGroups.find((accountGroup: AccountGroup) => accountGroup.id === id)
    }, [accountGroups]);

    const validation: any = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            id: (activeFinancialAccount && activeFinancialAccount.id) || '',
            // profilePhoto: (activeFinancialAccount && activeFinancialAccount.profile_photo) || '',
            name: (activeFinancialAccount && activeFinancialAccount.name) || '',
            parentGroup: (activeFinancialAccount && findAccountGroupById(activeFinancialAccount.parent_group)) || null,
            customer: null,
            isConfidential: false,
        },
        validationSchema: Yup.object({
            name: Yup.string().required(t("Please Enter Name")),
            parentGroup: Yup.mixed().required(t("Please select parent group")),
        }),
        onSubmit: (values) => {
            if (isEdit) {
                // @ts-ignore
                // handleEditUser(updatedUserProfile);
                validation.resetForm();
            } else {
                handleAddFinancialAccount({
                    name: values.name,
                    parent_group: values.parentGroup?.id,
                    is_confidential: values.isConfidential,
                });
            }
        },
    });

    const toggle = useCallback(() => {
        if (modal) {
            setModal(false);
            setActiveFinancialAccount(null);
        } else {
            setModal(true);
        }
    }, [modal]);

    const filters : Filters = useMemo(() => {
        return {
            name: name,
            full_code: fullCode,
            code: code,
            // parent_group: parentGroup?.id,
        }
    }, [code, fullCode, name])

    const onAccountGroupChange = useCallback((selectionOption: AccountGroup) => {
        validation.setFieldValue("parentGroup", selectionOption);
    }, []);

    const handleAddFinancialAccount = useCallback((data: any) => {
        axiosInstance.post("/accounts/financial-accounts/create/", data)
            .then(response => {
                toast.success(t("Financial account created successfully"));
                toggle();
                setItemsChanged(!itemsChanged);
            })
            .catch(error => {
                toast.error(normalizeDjangoError(error))
            })
    }, [])

    const onClickEdit = useCallback((financialAccount: FinancialAccount) => {
        setActiveFinancialAccount(financialAccount);
        setIsEdit(true);
        toggle();
    }, []);

    const onClickDelete = useCallback((financialAccount: FinancialAccount) => {
        setActiveFinancialAccount(financialAccount);
        setDeleteModal(true);
        setItemsChanged(!itemsChanged);
    }, [itemsChanged]);

    const handleDeleteFinancialAccount = useCallback((id: any) => {
        axiosInstance.delete(`/accounts/financial-accounts/${id}/`).then(response => {
            toast.success(t('Financial account delete success'))
            setDeleteModal(false);
            setItemsChanged(!itemsChanged)
        }).catch(error => {
            toast.error(t("Financial account delete failed"))
        })
    }, [itemsChanged]);

    const columns = useMemo<ColumnDef<FinancialAccount>[]>(() => {
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
                    accessorKey: 'name',
                    cell: info => info.getValue(),
                    header: () =>
                        <div className='header-item-container'>
                            <span>{t("Account Name")}</span>
                            {/*<DebouncedInput*/}
                            {/*    className='filter-component'*/}
                            {/*    value={name}*/}
                            {/*    onChange={(e: any) => setName(e.target.value)} />*/}
                        </div>
                },
                {
                    accessorKey: 'full_code',
                    cell: info => info.getValue(),
                    header: () =>
                        <div className='header-item-container'>
                            <span>{t("Financial Account Code")}</span>
                            {/*<DebouncedInput*/}
                            {/*    className='filter-component'*/}
                            {/*    value={fullCode}*/}
                            {/*    onChange={(e: any) => setFullCode(e.target.value)} />*/}
                        </div>
                },
                {
                    header: t("Action"),
                    cell: (cellProps: any) => {
                        return (
                            <ul className="list-inline hstack gap-2 mb-0">
                                <li className="list-inline-item">
                                    <UncontrolledDropdown>
                                        <DropdownToggle
                                            href="#"
                                            className="btn btn-soft-primary btn-sm dropdown"
                                            tag="button"
                                        >
                                            <i className="ri-more-fill align-middle"></i>
                                        </DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-end">
                                            <DropdownItem className="dropdown-item" href="#"
                                                          onClick={() => { setInfo(cellProps.row.original); }}
                                            >
                                                <i className="ri-eye-fill align-bottom me-2 text-muted"></i>{" "}
                                                {t("View")}
                                            </DropdownItem>
                                            <DropdownItem
                                                className="dropdown-item edit-item-btn"
                                                href="#"
                                                onClick={() => { onClickEdit(cellProps.row.original); }}
                                            >
                                                <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{" "}
                                                {t("Edit")}
                                            </DropdownItem>
                                            <DropdownItem
                                                className="dropdown-item remove-item-btn"
                                                href="#"
                                                onClick={() => { onClickDelete(cellProps.row.original); }}
                                            >
                                                <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
                                                {t("Delete")}
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </li>
                            </ul>
                        );
                    },
                },
            ]
        )
    }, [])

    return (
        <React.Fragment>
            <div className='page-content'>
                <DeleteModal
                    show={deleteModal}
                    onDeleteClick={() => handleDeleteFinancialAccount(activeFinancialAccount?.id)}
                    onCloseClick={() => setDeleteModal(false)}
                />

                <Container fluid>
                    <BreadCrumb title={t("Manage Financial Accounts")} pageTitle={t("Manage Financial Accounts")} />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <div className="d-flex align-items-center flex-wrap gap-2">
                                        <div className="flex-grow-1">
                                            <button
                                                className="btn btn-primary add-btn"
                                                onClick={() => {
                                                    setActiveFinancialAccount(null);
                                                    setIsEdit(false);
                                                    setModal(true);
                                                }}
                                            >
                                                <i className="ri-add-fill me-1 align-bottom"></i> {t("Add financial account")}
                                            </button>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Col>
                        <Col xxl={9}>
                            <Card className='currencies-list'>
                                <CardBody>
                                    <CustomTableContainer loadItemsApi={'/accounts/financial-accounts/'}
                                                          loadMethod={"POST"}
                                                          columns={columns}
                                                          itemsChanged={itemsChanged}
                                                          setItemsChanged={setItemsChanged}
                                                          filters={filters}
                                    />

                                    <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                                        <ModalHeader className="bg-primary-subtle p-3" toggle={toggle}>
                                            {isEdit ? t("Edit financial account") : t("Add financial account")}
                                        </ModalHeader>

                                        <Form className="tablelist-form" onSubmit={validation.handleSubmit}>
                                            <ModalBody>
                                                <Input type="hidden" id="id-field" />
                                                <Row className="g-3">
                                                    <Col lg={12}>
                                                        <Label
                                                            htmlFor="name-field"
                                                            className="form-label"
                                                        >
                                                            {t("Financial Account Name")}
                                                        </Label>
                                                        <Input
                                                            name="name"
                                                            id="name-field"
                                                            className="form-control"
                                                            placeholder={t("Enter financial account name")}
                                                            type="text"
                                                            validate={{
                                                                required: { value: true },
                                                            }}
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.name || ""}
                                                            invalid={
                                                                validation.touched.name && validation.errors.name ? true : false
                                                            }
                                                        />
                                                        {validation.touched.name && validation.errors.name ? (
                                                            <FormFeedback type="invalid">{validation.errors.name}</FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                    <Col lg={12}>
                                                        <Label
                                                            htmlFor="parentgroup-field"
                                                            className="form-label"
                                                        >
                                                            {t("Financial Account Group")}
                                                        </Label>
                                                        <SelectAccountGroup accountGroup={validation.parentGroup}
                                                                            onChangeAccountGroup={onAccountGroupChange}
                                                        />
                                                        {validation.touched.parentGroup &&
                                                        validation.errors.parentGroup ? (
                                                            <FormFeedback type="invalid">
                                                                {validation.errors.parentGroup}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                </Row>
                                            </ModalBody>
                                            {!isEdit &&
                                            <div>

                                            </div>}
                                            <ModalFooter>
                                                <div className="hstack gap-2 justify-content-end">
                                                    <button type="button" className="btn btn-light" onClick={() => {
                                                        setModal(false);
                                                    }}> {t("Close")} </button>
                                                    <button type="submit" className="btn btn-success" id="add-btn">
                                                        {isEdit ? t("Edit financial account") : t("Add financial account")}
                                                    </button>
                                                </div>
                                            </ModalFooter>
                                        </Form>
                                    </Modal>
                                    <ToastContainer closeButton={false} limit={1} />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xxl={3}>
                            <FinancialAccountViewDetail financialAccount={info} />
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ManageFinancialAccounts;