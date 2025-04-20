import {t} from 'i18next';
import React, {useCallback, useMemo, useState} from 'react'
import {toast, ToastContainer} from 'react-toastify';
import axiosInstance from 'helpers/axios_instance';
import {ColumnDef} from '@tanstack/react-table';
import {Link} from 'react-router-dom';

import dummyImg from "../../assets/images/users/user-dummy-img.jpg";

import {
  Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Row,
    Table,
    UncontrolledDropdown
} from 'reactstrap';

import DeleteModal from 'Components/Common/ConfirmModal';
import BreadCrumb from 'Components/Common/BreadCrumb';
import IndeterminateCheckbox from 'pages/Reports/IndetermineCheckbox';


import CustomTableContainer from 'pages/Reports/CustomTableContainer';
import ResetPasswordModal from "./ResetPasswordModal";
import {handleValidDate, handleValidTime} from "../../helpers/date";
import {UserProfile} from "./types";
import UserProfileFormModal from './UserProfileForm';
import {normalizeDjangoError} from "../../helpers/error";



const UsersList = () => {
  const [activeUserProfile, setActiveUserProfile] = useState<UserProfile | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [itemsChanged, setItemsChanged] = useState<boolean>(false);

  const [modal, setModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [resetPasswordModal, setResetPasswordModal] = useState<boolean>(false);

  const [activeUserPermissions, setActiveUserPermissions] = useState([])

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setActiveUserProfile(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  const handleDeleteUserProfile = useCallback(async (id: number | undefined) => {
      axiosInstance.delete(`/users/${id}/`).then(response => {
          toast.success(t('UserDeleteSuccess'));
          setItemsChanged(!itemsChanged);
          setDeleteModal(false);
      }).catch(error => {
          toast.error(normalizeDjangoError(error))
      })
    }, [setItemsChanged, itemsChanged]);

  const onClickEditUser = useCallback(async (user: UserProfile) => {
      setActiveUserPermissions(user.user.user_permissions);
      setActiveUserProfile(user);
      setIsEdit(true);
      toggle();
  }, [toggle]);

  const onClickResetPassword = useCallback(async (user: UserProfile) => {
      setActiveUserProfile(user);
      setResetPasswordModal(true);
  }, [])

  const onClickDelete = useCallback(async (user: UserProfile) => {
      setActiveUserProfile(user);
      setDeleteModal(true);
  }, [itemsChanged]);

  const onClickAddUser = useCallback(async () => {
      setActiveUserPermissions([])
      setActiveUserProfile(null);
      setIsEdit(false);
      setModal(true);
  }, []);


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
                <ul className="list-inline hstack gap-2 m-1">
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
          isConfirm={false}
          show={deleteModal}
          onConfirmClick={() => handleDeleteUserProfile(activeUserProfile?.id)}
          onCloseClick={() => setDeleteModal(false)}
        />

        <ResetPasswordModal show={resetPasswordModal}
                            onCloseClick={() => setResetPasswordModal(false)}
                            activeUserProfile={activeUserProfile}/>

        <UserProfileFormModal 
          activeUserProfile={activeUserProfile}
          isEdit={isEdit}
          toggle={toggle}
          isModalOpen={modal}
          setIsModalOpen={setModal}
          activeUserPermissions={activeUserPermissions}
          setActiveUserPermissions={setActiveUserPermissions}
          onSubmitSuccessfully={() => setItemsChanged(!itemsChanged)}
        />
        <Container fluid>
          <BreadCrumb title={t("Users List")} pageTitle={t('Users List')}/>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="align-items-center flex-wrap gap-2">
                      <Col md={3} sm={12}>
                        <Button
                          color='primary'
                          onClick={onClickAddUser}
                        >
                          <i className="ri-add-fill me-1 align-bottom"></i> {t("Add User")}
                        </Button>
                      </Col>
                  </Row>
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
