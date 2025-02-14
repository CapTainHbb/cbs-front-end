import React, {useCallback, useMemo, useState} from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container, DropdownItem,
    DropdownMenu,
    DropdownToggle, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader,
    Row, Table,
    UncontrolledDropdown
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {t} from "i18next";
import CustomTableContainer from "../Reports/CustomTableContainer";
import {Currency} from "../Reports/utils";
import {ColumnDef} from "@tanstack/react-table";
import IndeterminateCheckbox from "../Reports/IndetermineCheckbox";
import CurrencyNameAndFlag from "../Reports/CurrencyNameAndFlag";
import {useFormik} from "formik";
import * as Yup from "yup";
import axiosInstance from "../../helpers/axios_instance";
import {toast, ToastContainer} from "react-toastify";
import {normalizeDjangoError} from "../../helpers/error";
import DeleteModal from "../../Components/Common/DeleteModal";
import ReferenceCurrencyModal from "./ReferenceCurrencyModal";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

const ManageCurrencies = () => {
    const [itemsChanged, setItemsChanged] = useState<boolean>(false);
    const [activeCurrency, setActiveCurrency] = useState<Currency | null>(null);
    const [modal, setModal] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [referenceCurrencyModal, setReferenceCurrencyModal] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const referenceCurrency = useSelector((state: any) => state.InitialData.referenceCurrency);

    const toggle = useCallback(() => {
        if (modal) {
            setModal(false);
            setActiveCurrency(null);
        } else {
            setModal(true);
        }
    }, [modal]);

    const validation: any = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,
        initialValues: {
            id: (activeCurrency && activeCurrency.id) || '',
            name: (activeCurrency && activeCurrency.name) || '',
            alternativeName: (activeCurrency && activeCurrency.alternative_name) || '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required(t("Please Enter Name")),
            alternativeName: Yup.string().required(t("Please Enter Alternative Name")),
        }),
        onSubmit: (values) => {
            if (isEdit) {
                const updatedCurrency: Currency = {
                    id: Number(values["id"]),
                    name: values["name"],
                    alternative_name: values["alternativeName"],
                }
                handleEditCurrency(updatedCurrency);
                validation.resetForm();
            } else {
                const newCurrency: Currency = {
                    name: values["name"],
                    alternative_name: values['alternativeName'],
                }
                handleAddCurrency(newCurrency);
            }
        },
    });

    const handleEditCurrency = useCallback(async (currency: Currency) => {
        axiosInstance.put(`/currencies/${currency?.id}/`, currency)
            .then(response => {
                toast.success(t("Currency Edit Successfully"));
                validation.resetForm();
                toggle();
                setItemsChanged(!itemsChanged);
            })
            .catch(error => {
                toast.error(normalizeDjangoError(error))
            })
    }, [itemsChanged, toggle, validation]);

    const handleAddCurrency = useCallback(async (currency: Currency) => {
        axiosInstance.post("/currencies/create/", currency)
            .then(response => {
                toast.success(t("Currency Created Successfully"));
                validation.resetForm();
                toggle();
                setItemsChanged(!itemsChanged);
            })
            .catch(error => {
                toast.error(normalizeDjangoError(error))
            })
    }, [itemsChanged, toggle, validation])

    const onClickEdit = useCallback((currency: Currency) => {
        setActiveCurrency(currency);
        setIsEdit(true);
        toggle();
    }, []);

    const onClickDelete = useCallback((currency: Currency) => {
        setActiveCurrency(currency);
        setDeleteModal(true);
    }, [itemsChanged]);

    const handleDeleteCurrency = useCallback(async (id: number | undefined) => {
        axiosInstance.delete(`/currencies/${id}/`).then(response => {
            toast.success(t('Currency Delete Success'));
            setItemsChanged(!itemsChanged);
            setDeleteModal(false);
        }).catch(error => {
            toast.error(t("Currency Delete Failed"))
        })
    }, [setItemsChanged, itemsChanged]);

    const columns = useMemo<ColumnDef<Currency>[]>(() => {
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
                        <span>{t("Currency Type")}</span>,
                },
                {
                    id: "flag",
                    cell: (info) => <CurrencyNameAndFlag currencyId={info.row.original?.id} /> ,
                    header: () => <span>{t("Flag")}</span>,
                    size: 10
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
    }, [t])

    return (
        <React.Fragment>
            <div className='page-content'>
                <DeleteModal
                    show={deleteModal}
                    onDeleteClick={() => handleDeleteCurrency(activeCurrency?.id)}
                    onCloseClick={() => setDeleteModal(false)}
                />
                <ReferenceCurrencyModal show={referenceCurrencyModal} onCloseClick={() => setReferenceCurrencyModal(false)} />

                <Container fluid>
                    <BreadCrumb title={t("Manage Currencies")} pageTitle={t("Manage Currencies")} />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <div className="d-flex align-items-center flex-wrap gap-2">
                                        <div className="flex-grow-1">
                                            <button
                                                className="btn btn-primary add-btn"
                                                onClick={() => {
                                                    setActiveCurrency(null);
                                                    setIsEdit(false);
                                                    setModal(true);
                                                }}
                                            >
                                                <i className="ri-add-fill me-1 align-bottom"></i> {t("Add Currency")}
                                            </button>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Col>
                        <Col xxl={9}>
                            <Card className='currencies-list'>
                                <CardBody>
                                    <CustomTableContainer loadItemsApi={'/currencies/'}
                                                          loadMethod={"GET"}
                                                          columns={columns}
                                                          itemsChanged={itemsChanged}
                                                          setItemsChanged={setItemsChanged} />

                                    <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                                        <ModalHeader className="bg-primary-subtle p-3" toggle={toggle}>
                                            {isEdit ? t("Edit Currency") : t("Add Currency")}
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
                                                            {t("Currency Name")}
                                                        </Label>
                                                        <Input
                                                            name="name"
                                                            id="name-field"
                                                            className="form-control"
                                                            placeholder={t("Enter Currency Name")}
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
                                                            htmlFor="alternativename-field"
                                                            className="form-label"
                                                        >
                                                            {t("Alternative Name")}
                                                        </Label>
                                                        <Input
                                                            name="alternativeName"
                                                            id="alternativename-field"
                                                            className="form-control"
                                                            placeholder={t("Enter Alternative Name")}
                                                            type="text"
                                                            validate={{
                                                                required: { value: true },
                                                            }}
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.alternativeName || ""}
                                                            invalid={
                                                                !!(validation.touched.alternativeName && validation.errors.alternativeName)
                                                            }
                                                        />
                                                        {validation.touched.alternativeName && validation.errors.alternativeName ? (
                                                            <FormFeedback type="invalid">{validation.errors.alternativeName}</FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                </Row>
                                            </ModalBody>
                                            <ModalFooter>
                                                <div className="hstack gap-2 justify-content-end">
                                                    <button type="button" className="btn btn-light" onClick={() => {
                                                        setModal(false);
                                                    }}> {t("Close")} </button>
                                                    <button type="submit" className="btn btn-success" id="add-btn"> {isEdit ? t("Edit Currency") : t("Add Currency")} </button>
                                                </div>
                                            </ModalFooter>
                                        </Form>
                                    </Modal>
                                    <ToastContainer closeButton={false} limit={1} />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xxl={3}>
                            <Card id="contact-view-detail">
                                <CardBody className="text-center">
                                    <div className="position-relative d-inline-block">
                                        <img
                                            src={`/flags/${referenceCurrency.name}.svg`}
                                            alt=""
                                            className="avatar-lg  img-thumbnail"
                                        />
                                        <span className="contact-active position-absolute bg-success">
                                            <span className="visually-hidden"></span>
                                        </span>
                                    </div>
                                    <h5 className="mt-4 mb-2">{t("Reference Currency")}</h5>
                                    <ul className="list-inline mb-0">
                                        <li className="list-inline-item avatar-xs">
                                            <Link
                                                to="#"
                                                className="avatar-title bg-warning-subtle text-warning fs-15 rounded"
                                                onClick={() => {setReferenceCurrencyModal(true)}}
                                            >
                                                <i className="ri-pencil-fill"></i>
                                            </Link>
                                        </li>
                                    </ul>
                                </CardBody>
                                <CardBody>
                                    <div className="table-responsive table-card">
                                        <Table className="table table-borderless mb-0">
                                            <tbody>
                                            <tr>
                                                <td className="fw-medium">
                                                    {t("Currency Name")}
                                                    </td>
                                                    <td>{referenceCurrency?.name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-medium">
                                                        {t("Currency Alternative Name")}
                                                    </td>
                                                    <td>{referenceCurrency?.alternative_name}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ManageCurrencies;