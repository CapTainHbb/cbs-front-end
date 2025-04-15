import { t } from 'i18next'
import React, { useCallback, useMemo, useState } from 'react'
import { Card, CardBody, CardHeader, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import { roleOptions, statusOptions, UserProfile } from './types';
import { useFormik } from 'formik';
import * as Yup from "yup";
import Select from "react-select";
import UsersPermission from './UsersPermission';
import axiosInstance from 'helpers/axios_instance';
import { normalizeDjangoError } from 'helpers/error';
import { toast } from 'react-toastify';
import CustomTableContainer from 'pages/Reports/CustomTableContainer';
import ViewFinancialAccountsPermissions from './ViewFinancialAccountsPermissions';



interface Props {
    activeUserProfile: UserProfile | null;
    isEdit: boolean;
    toggle: any;
    isModalOpen: boolean;
    setIsModalOpen: any;
    activeUserPermissions: any;
    setActiveUserPermissions: any;
    onSubmitSuccessfully: any;
}

const UserProfileFormModal: React.FC<Props> = ({ activeUserProfile, isEdit, 
    toggle, isModalOpen, setIsModalOpen, 
    activeUserPermissions, setActiveUserPermissions, onSubmitSuccessfully }) => {

    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    const [repeatPasswordShow, setRepeatPasswordShow] = useState<boolean>(false);
        
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
          role: (activeUserProfile && activeUserProfile.role) || 'level_1_employee',
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

      const createPermissions = useCallback(async (createdUser: UserProfile) => {
        axiosInstance.post(`/users/permissions/${createdUser.user.id}/`,
            {ids: Object.values(activeUserPermissions)}
        ).then(response => {
            toast.success(t('User Permissions Created Successfully'));
            validation.resetForm();
            toggle();
            onSubmitSuccessfully();
        }).catch(error => toast.error(t("Failed to create user permissions")))
    },  [activeUserPermissions, toggle, validation])
    
    const handleAddUser = useCallback(async (user: UserProfile) => {
          axiosInstance.post("/users/create/", user)
          .then(response => {
              createPermissions(response.data);
              toast.success(t("User Created Successfully"));
              validation.resetForm();
              toggle();
              onSubmitSuccessfully();
          })
          .catch(error => {
              toast.error(normalizeDjangoError(error))
          })
      }, [createPermissions, toggle, validation])

    
    
      const handleEditUser = useCallback(async (user: UserProfile) => {
          axiosInstance.put(`/users/${user?.id}/`, user)
              .then(response => {
                  toast.success(t("User Edited Successfully"));
                  createPermissions(response.data);
              })
              .catch(error => {
                  toast.error(normalizeDjangoError(error))
              })
      }, [createPermissions]);

    const onSelectRoleChange = useCallback((selectedOption: any) => {
          validation.setFieldValue('role', selectedOption?.value);
      }, [validation]);
    
    const onSelectStatusChange = useCallback((selectedOption: any) => {
        validation.setFieldValue('isActive', selectedOption?.value);
    }, [validation])  
    
    const isSelectedRoleCustomer = useMemo(() => {
        return validation.values.role === "customer"
    }, [validation.values.role]);

    return (
        <Modal id="showModal" isOpen={isModalOpen} toggle={toggle} className={'modal-xl'} centered>
            <ModalHeader className="bg-primary-subtle p-3" toggle={toggle}>
                {isEdit ? t("Edit User") : t("Add User")}
            </ModalHeader>

            <Form className="tablelist-form" onSubmit={validation.handleSubmit}>
            <ModalBody>
                <Input type="hidden" id="id-field" />
                <Row>
                <Col md={12} className="g-3">
                    <Card>
                        <CardHeader className={'p-2'} ><Label>{t("User Profile")}</Label></CardHeader>
                        <CardBody>
                            <Row>
                            <Col lg={4}>
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
                            <Col lg={4}>
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
                            <Col lg={4}>
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
                            </Row>
                            <Row>
                            <Col lg={4}>
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
                            <Col lg={4}>
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
                            <Col lg={4}>
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
                            </Row>
                            <Row>
                            {!isEdit && <Col md={6}>
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
                                {!isEdit && <Col md={6}>
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
                            <Row>

                            </Row>
                        </CardBody>
                    </Card>
                </Col>

                {!isSelectedRoleCustomer && <Col md={12}>
                    <UsersPermission  activeUserPermissions={activeUserPermissions}
                                        setActiveUserPermissions={setActiveUserPermissions} />
                </Col>}
                {isSelectedRoleCustomer && <Col md={12}>
                    <ViewFinancialAccountsPermissions 
                        activeUserProfile={activeUserProfile}
                        isEdit={isEdit}
                    />
                </Col>}
                </Row>
            </ModalBody>
                <ModalFooter>
                    <div className="hstack gap-2 justify-content-end">
                        <button type="button" className="btn btn-light" onClick={() => {
                            setIsModalOpen(false);
                        }}> {t("Close")} </button>
                <button type="submit" className="btn btn-success" id="add-btn"> {isEdit ? t("Edit User") : t("Add User")} </button>
                </div>
            </ModalFooter>
            </Form>
        </Modal>
  )
}

export default UserProfileFormModal;
