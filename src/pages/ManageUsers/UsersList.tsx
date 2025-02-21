import {t} from 'i18next';
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {toast, ToastContainer} from 'react-toastify';
import axiosInstance from 'helpers/axios_instance';
import {ColumnDef} from '@tanstack/react-table';
import {Link} from 'react-router-dom';

import dummyImg from "../../assets/images/users/user-dummy-img.jpg";

import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Form,
    FormFeedback,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Table,
    UncontrolledDropdown
} from 'reactstrap';
import Select from "react-select";

import DeleteModal from 'Components/Common/DeleteModal';
import BreadCrumb from 'Components/Common/BreadCrumb';
import IndeterminateCheckbox from 'pages/Reports/IndetermineCheckbox';

import * as Yup from "yup";
import {useFormik} from 'formik';
import CustomTableContainer from 'pages/Reports/CustomTableContainer';
import {normalizeDjangoError} from "../../helpers/error";
import ResetPasswordModal from "./ResetPasswordModal";
import {handleValidDate, handleValidTime} from "../../helpers/date";

const statusOptions = [
  {label: t("Active"), value: true},
  {label: t("Inactive"), value: false}
]

const roleOptions = [
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

interface Filters {
  username: string | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  email: string | undefined;
  is_active: boolean | undefined;
  role: string | undefined;
}

const UsersList = () => {
  const [activeUserProfile, setActiveUserProfile] = useState<UserProfile | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [itemsChanged, setItemsChanged] = useState<boolean>(false);

  const [modal, setModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [repeatPasswordShow, setRepeatPasswordShow] = useState<boolean>(false)
  const [resetPasswordModal, setResetPasswordModal] = useState<boolean>(false);

  // profile photo Validation
  const [profilePhotoStore, setProfilePhotoStore] = useState<any>();
  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState<any>();

    const handleClick = useCallback((item: any) => {
        setProfilePhotoStore((prev: any) => {
            const newData = [...prev, item];
            validation.setFieldValue('profilePhoto', newData);
            return newData;
        });
    }, []);

    useEffect(() => {
        setProfilePhotoStore((activeUserProfile && activeUserProfile?.profile_photo) || []);
    }, [activeUserProfile]);
    const handleImageChange = (event: any) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            validation.setFieldValue('profilePhoto', result);
            setSelectedProfilePhoto(result);
        };
        reader.readAsDataURL(file);
    };

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setActiveUserProfile(null);
      setSelectedProfilePhoto('');
      setProfilePhotoStore('');
    } else {
      setModal(true);
    }
  }, [modal]);

  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      id: (activeUserProfile && activeUserProfile.id) || '',
      // profilePhoto: (activeUserProfile && activeUserProfile.profile_photo) || '',
      userName: (activeUserProfile && activeUserProfile.user?.username) || '',
      firstName: (activeUserProfile && activeUserProfile.user?.first_name) || '',
      lastName: (activeUserProfile && activeUserProfile.user?.last_name) || '',
      email: (activeUserProfile && activeUserProfile.user?.email) || '',
      isActive: (activeUserProfile && activeUserProfile.user?.is_active) || false,
      role: (activeUserProfile && activeUserProfile.role) || '',
      password: '',
      repeatPassword: ''
    },
    validationSchema: Yup.object({
      userName: Yup.string().required(t("Please Enter User Name")),
      firstName: Yup.string().required(t("Please Enter First Name")),
      lastName: Yup.string().required(t("Please Enter Last Name")),

      // profilePhoto: Yup.string().required(t("Please Select Profile Photo")),
      role: Yup.string().required(t("Please Select Role")),
      email: Yup.string().required(t("Please Enter Email")),
      isActive: Yup.bool().required(t("Please Select User Status")),
        password: isEdit
            ? Yup.string().notRequired()
            : Yup.string()
                .required(t("Please Enter Password"))
                .min(8, t("Password must be at least 8 character")),
        repeatPassword: isEdit
            ? Yup.string().notRequired()
            : Yup.string()
                .required(t("Please Enter Password Again"))
                .oneOf([Yup.ref('password')], t("Passwords must match"))
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updatedUserProfile = {
          id: activeUserProfile?.id,
          // profilePhoto: values.profilePhoto,
          user: {
            ...activeUserProfile?.user,
            username: values.userName,
            first_name: values.firstName,
            lastName: values.lastName,
            email: values.email,
            is_active: values.isActive,
          },
          role: values.role,
        };
        // @ts-ignore
        handleEditUser(updatedUserProfile);
        validation.resetForm();
      } else {
        const newUserProfile = {
          role: values['role'],
          // profilePhoto: values['profilePhoto'],
          user: {
            username: values['userName'],
            first_name: values['firstName'],
            last_name: values['lastName'],
            is_active: values['isActive'],
            email: values["email"],
            password: values['password']
          },
        };
        // save new Contact
        // @ts-ignore
        handleAddUser(newUserProfile);
      }
    },
  });

  const handleDeleteUserProfile = useCallback(async (id: number | undefined) => {
      axiosInstance.delete(`/users/${id}/`).then(response => {
          toast.success(t('UserDeleteSuccess'));
          setItemsChanged(!itemsChanged);
          setDeleteModal(false);
      }).catch(error => {
          toast.error(t("UserDeleteFailed"))
      })
    }, [setItemsChanged, itemsChanged]);

  const onClickEditUser = useCallback(async (user: UserProfile) => {
      setActiveUserProfile(user);
      setIsEdit(true);
      toggle();
  }, [toggle]);

  const handleEditUser = useCallback(async (user: UserProfile) => {
      axiosInstance.put(`/users/${user?.id}/`, user)
          .then(response => {
              toast.success(t("User Edited Successfully"));
              validation.resetForm();
              toggle();
              setItemsChanged(!itemsChanged);
          })
          .catch(error => {
              toast.error(normalizeDjangoError(error))
          })
  }, [itemsChanged, toggle, validation]);

  const onClickResetPassword = useCallback(async (user: UserProfile) => {
      setActiveUserProfile(user);
      setResetPasswordModal(true);
  }, [])

  const handleAddUser = useCallback(async (user: UserProfile) => {
      axiosInstance.post("/users/create/", user)
      .then(response => {
          toast.success(t("User Created Successfully"));
          validation.resetForm();
          toggle();
          setItemsChanged(!itemsChanged);
      })
      .catch(error => {
          toast.error(normalizeDjangoError(error))
      })
  }, [itemsChanged, toggle, validation])

  const onClickDelete = useCallback(async (user: UserProfile) => {
      setActiveUserProfile(user);
      setDeleteModal(true);
      setItemsChanged(!itemsChanged);
  }, [itemsChanged]);



  const onSelectRoleChange = useCallback((selectedOption: any) => {
      validation.setFieldValue('role', selectedOption?.value);
  }, [validation]);

  const onSelectStatusChange = useCallback((selectedOption: any) => {
      validation.setFieldValue('isActive', selectedOption?.value);
  }, [validation])

  // SideBar Contact Deatail
  const [info, setInfo] = useState<UserProfile | null>(null);

  document.title = "Users List | ZalEX - Admin & Dashboard";

  const defaultColumns = useMemo<ColumnDef<UserProfile>[]>(() => {
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
               id: 'username',
               cell: info => info.row.original?.user?.username,
               header: () => <div className='header-item-container'>
                   <span>{t("User Name")}</span>
               </div>
           },
            {
                id: 'first_name',
                cell: info => info.row.original?.user?.first_name,
                header: () => <div className='header-item-container'>
                    <span>{t("First Name")}</span>
                </div>

            },
           {
               id: 'last_name',
               cell: info => info.row.original?.user?.last_name,
               header: () => <div className='header-item-container'>
                    <span>{t("Last Name")}</span>
               </div>
           },
           {
               id: 'email',
               cell: info => info.row.original?.user.email,
               header: () => <div className='header-item-container'>
                   <span>{t("Email")}</span>
               </div>
           },
           {
               id: 'is_active',
               cell: info => <span className={`badge bg-${info.row.original?.user?.is_active? 'success': 'danger'}-subtle text-${info.row.original.user?.is_active? 'success': 'danger'} me-1`}>
                            {t(info.row.original.user.is_active? "Active": "Inactive")}
                        </span>,
               header: () => <span>{t("User Status")}</span>,
           },
           {
               accessorKey: 'role',
               cell: info =>
                            t(String(info.getValue())),
                   header: () => <span>{t("Role")}</span>,
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
                          onClick={() => { onClickEditUser(cellProps.row.original); }}
                        >
                          <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{" "}
                          {t("Edit")}
                        </DropdownItem>
                          <DropdownItem
                              className="dropdown-item edit-item-btn"
                              href="#"
                              onClick={() => { onClickResetPassword(cellProps.row.original); }}>
                              <i className=" ri-lock-password-fill align-bottom me-2 text-muted"></i>{" "}
                              {t("Reset Password")}
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
}, [onClickDelete, onClickEditUser, onClickResetPassword])


  return (
    <React.Fragment>
      <div className='page-content'>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={() => handleDeleteUserProfile(activeUserProfile?.id)}
          onCloseClick={() => setDeleteModal(false)}
        />

        <ResetPasswordModal show={resetPasswordModal}
                            onCloseClick={() => setResetPasswordModal(false)}
                            activeUserProfile={activeUserProfile}/>

        <Container fluid>
          <BreadCrumb title={t("Users List")} pageTitle={t('Users List')}/>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <div className="flex-grow-1">
                      <button
                        className="btn btn-primary add-btn"
                        onClick={() => {
                          setActiveUserProfile(null);
                          setIsEdit(false);
                          setModal(true);
                        }}
                      >
                        <i className="ri-add-fill me-1 align-bottom"></i> {t("Add User")}
                      </button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Col>
            <Col xxl={9}>
              <Card id="users-list">
                  <CardBody className='pt-0'>
                    <div>
                      <CustomTableContainer
                          loadItemsApi='/users/'
                          loadMethod='GET'
                          columns={defaultColumns}
                          itemsChanged={itemsChanged}
                          setItemsChanged={setItemsChanged}
                      />
                    </div>
                    <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                      <ModalHeader className="bg-primary-subtle p-3" toggle={toggle}>
                        {isEdit ? t("Edit User") : t("Add User")}
                      </ModalHeader>

                      <Form className="tablelist-form" onSubmit={validation.handleSubmit}>
                        <ModalBody>
                          <Input type="hidden" id="id-field" />
                          <Row className="g-3">
                            {/*<Col lg={12}>*/}
                            {/*  <div className="text-center">*/}
                            {/*    <div className="position-relative d-inline-block">*/}
                            {/*      <div className="position-absolute  bottom-0 end-0">*/}
                            {/*        <Label htmlFor="user-profile-phoro-input" className="mb-0">*/}
                            {/*          <div className="avatar-xs cursor-pointer">*/}
                            {/*            <div className="avatar-title bg-light border rounded-circle text-muted">*/}
                            {/*              <i className="ri-image-fill"></i>*/}
                            {/*            </div>*/}
                            {/*          </div>*/}
                            {/*        </Label>*/}
                            {/*        <Input className="form-control d-none" id="user-profile-photo-input" type="file"*/}
                            {/*          accept="image/png, image/gif, image/jpeg" onChange={handleImageChange}*/}
                            {/*          invalid={*/}
                            {/*            validation.touched.profilePhoto && validation.errors.profilePhoto ? true : false*/}
                            {/*          }*/}
                            {/*        />*/}
                            {/*      </div>*/}
                            {/*      <div className="avatar-lg p-1" onClick={(item: any) => handleClick(item)}>*/}
                            {/*        <div className="avatar-title bg-light rounded-circle">*/}
                            {/*          <img src={selectedProfilePhoto || validation.values.profilePhoto} alt="dummyImg" id="user-profile-photo" className="avatar-md rounded-circle object-fit-cover" />*/}
                            {/*        </div>*/}
                            {/*      </div>*/}
                            {/*    </div>*/}
                            {/*    {validation.errors.profilePhoto && validation.touched.profilePhoto ? (*/}
                            {/*      <FormFeedback type="invalid" className='d-block'> {validation.errors.profilePhoto} </FormFeedback>*/}
                            {/*    ) : null}*/}
                            {/*  </div>*/}
                            {/*</Col>*/}
                            <Col lg={12}>
                                  <Label
                                    htmlFor="username-field"
                                    className="form-label"
                                  >
                                  {t("User Name")} 
                                  </Label>
                                  <Input
                                    name="userName"
                                    id="username-field"
                                    className="form-control"
                                    placeholder={t("Enter User Name")}
                                    type="text"
                                    validate={{
                                      required: { value: true },
                                    }}
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.userName || ""}
                                    invalid={
                                      validation.touched.userName && validation.errors.userName ? true : false
                                    }
                                  />
                                  {validation.touched.userName && validation.errors.userName ? (
                                    <FormFeedback type="invalid">{validation.errors.userName}</FormFeedback>
                                  ) : null}
                            </Col>
                            <Col lg={12}>
                                  <Label
                                    htmlFor="firstname-field"
                                    className="form-label"
                                  >
                                  {t("First Name")} 
                                  </Label>
                                  <Input
                                    name="firstName"
                                    id="firstname-field"
                                    className="form-control"
                                    placeholder={t("Enter First Name")}
                                    type="text"
                                    validate={{
                                      required: { value: true },
                                    }}
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.firstName || ""}
                                    invalid={
                                      !!(validation.touched.firstName && validation.errors.firstName)
                                    }
                                  />
                                  {validation.touched.firstName && validation.errors.firstName ? (
                                    <FormFeedback type="invalid">{validation.errors.firstName}</FormFeedback>
                                  ) : null}
                            </Col>
                            <Col lg={12}>
                            <div>
                                <Label
                                  htmlFor="lastname-field"
                                  className="form-label"
                                >
                                 {t("Last Name")} 
                                </Label>
                                <Input
                                  name="lastName"
                                  id="lastname-field"
                                  className="form-control"
                                  placeholder={t("Enter Last Name")}
                                  type="text"
                                  validate={{
                                    required: { value: true },
                                  }}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.lastName || ""}
                                  invalid={
                                    !!(validation.touched.lastName && validation.errors.lastName)
                                  }
                                />
                                {validation.touched.lastName && validation.errors.lastName ? (
                                  <FormFeedback type="invalid">{validation.errors.lastName}</FormFeedback>
                                ) : null}

                              </div>
                            </Col>
                            
                            <Col lg={12}>
                                <Label
                                  htmlFor="role-field"
                                  className="form-label"
                                >
                                  {t("Role")}
                                </Label>

                                <Select
                                  isClearable
                                  value={roleOptions.find(option => option.value === validation.values.role)}
                                  onChange={onSelectRoleChange}
                                  
                                  className="mb-0"
                                  options={roleOptions.filter((option: any) => option.value !== 'admin')}
                                  id="roleinput-choices"
                                />
                                {validation.touched.role &&
                                  validation.errors.role ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.role}
                                  </FormFeedback>
                                ) : null}
                            </Col>

                            <Col lg={12}>
                                <Label
                                  htmlFor="email-field"
                                  className="form-label"
                                >
                                  {t("Email")}
                                </Label>

                                <Input
                                  name="email"
                                  id="email-field"
                                  className="form-control"
                                  placeholder={t("Enter Email")}
                                  type="text"
                                  validate={{
                                    required: { value: true },
                                  }}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.email || ""}
                                  invalid={
                                    validation.touched.email && validation.errors.email ? true : false
                                  }
                                />
                                {validation.touched.email && validation.errors.email ? (
                                  <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                                ) : null}
                            </Col>
                            <Col lg={12}>
                                <Label
                                  htmlFor="status-choices"
                                  className="form-label font-size-13 text-muted"
                                >
                                  {t("Status")}
                                </Label>
                                <Select
                                  isClearable
                                  value={statusOptions.find(option => option.value === validation.values.isActive)}
                                  onChange={onSelectStatusChange}
                                  className="mb-0"
                                  options={statusOptions}
                                  id="statusinput-choices"
                                >
                                </Select>

                                {validation.touched.isActive &&
                                  validation.errors.isActive ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.isActive}
                                  </FormFeedback>
                                ) : null}
                            </Col>
                            {!isEdit && <Col lg={12}>
                                <Label
                                    htmlFor="password-field"
                                    className="form-label"
                                >
                                    {t("Password")}
                                </Label>
                                <div className='position-relative auth-pass-inputgroup mb-3'>
                                    <Input
                                        name="password"
                                        id="password-field"
                                        className="form-control"
                                        placeholder={t("Enter password")}
                                        type={passwordShow ? "text" : "password"}
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.password || ""}
                                        invalid={
                                            validation.touched.password && validation.errors.password ? true : false
                                        }
                                    />
                                    <button
                                        className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                        type="button" id="password-addon" onClick={() => setPasswordShow(!passwordShow)}><i
                                        className="ri-eye-fill align-middle"></i></button>
                                    {validation.touched.password && validation.errors.password ? (
                                        <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                                    ) : null}

                                </div>
                            </Col>}
                              {!isEdit && <Col lg={12}>
                                  <Label
                                      htmlFor="repeatpassword-field"
                                      className="form-label"
                                  >
                                      {t("Repeat Password")}
                                  </Label>
                                  <div className='position-relative auth-pass-inputgroup mb-3'>
                                      <Input
                                          name="repeatPassword"
                                          id="repeatpassword-field"
                                          className="form-control"
                                          placeholder={t("Enter Repeat Password")}
                                          type={repeatPasswordShow ? "text" : "password"}
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={validation.values.repeatPassword || ""}
                                          invalid={
                                              validation.touched.repeatPassword && validation.errors.repeatPassword ? true : false
                                          }
                                      />
                                      <button
                                          className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                          type="button" id="password-addon"
                                          onClick={() => setRepeatPasswordShow(!repeatPasswordShow)}><i
                                          className="ri-eye-fill align-middle"></i></button>
                                      {validation.touched.repeatPassword && validation.errors.repeatPassword ? (
                                          <FormFeedback type="invalid">{validation.errors.repeatPassword}</FormFeedback>
                                      ) : null}
                                  </div>
                              </Col>}
                          </Row>
                        </ModalBody>
                          <ModalFooter>
                              <div className="hstack gap-2 justify-content-end">
                                  <button type="button" className="btn btn-light" onClick={() => {
                                      setModal(false);
                                  }}> {t("Close")} </button>
                            <button type="submit" className="btn btn-success" id="add-btn"> {isEdit ? t("Edit User") : t("Add User")} </button>
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
                          src={info?.profile_photo || dummyImg}
                          // process.env.REACT_APP_API_URL + "/images/users/" +
                          alt=""
                          className="avatar-lg rounded-circle img-thumbnail"
                        />
                        <span className="contact-active position-absolute rounded-circle bg-success">
                          <span className="visually-hidden"></span>
                        </span>
                      </div>
                      <h5 className="mt-4 mb-1">{info?.user.first_name} {info?.user.last_name}</h5>
                      <ul className="list-inline mb-0">
                        <li className="list-inline-item avatar-xs">
                          <Link
                            to="#"
                            className="avatar-title bg-warning-subtle text-warning fs-15 rounded"
                          >
                            <i className="ri-question-answer-line"></i>
                          </Link>
                        </li>
                      </ul>
                    </CardBody>
                    <CardBody>
                      <div className="table-responsive table-card">
                        <Table className="table table-borderless mb-0">
                            {info && <tbody>
                            <tr>
                              <td className="fw-medium">
                                {t("User Name")}
                              </td>
                              <td>{info?.user?.username}</td>
                            </tr>
                            <tr>
                              <td className="fw-medium">
                                {t("Role")}
                              </td>
                              <td>{t(info?.role)}</td>
                            </tr>
                            <tr>
                              <td className="fw-medium">
                                {t("Email")}
                              </td>
                              <td>{info?.user?.email}</td>
                            </tr>
                            <tr>
                              <td className="fw-medium">
                                {t("Status")}
                              </td>
                              <td>
                                {<span className={`badge bg-${info?.user?.is_active? 'success': 'danger'}-subtle text-${info?.user?.is_active? 'success': 'danger'} me-1`}>
                                  {info?.user?.is_active? t("Active"): t("Inactive")}
                                  </span>}
                              </td>
                            </tr>
                            <tr>
                              <td className="fw-medium">
                                {t("Date Joined")}
                              </td>
                              {info?.user?.date_joined &&
                                  <td>
                                    {handleValidDate(info?.user?.date_joined)}{" "}
                                    <small className="text-muted">{handleValidTime(info?.user?.date_joined)}</small>
                                  </td>
                              }
                            </tr>
                          </tbody>}
                        </Table>
                      </div>
                    </CardBody>
                </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default UsersList
