import React, {useEffect, useMemo, useState} from "react";
import {
    Button, Card, CardBody, CardHeader,
    Col,
    Container,
    Form,
    FormGroup,
    FormText,
    Input,
    Label,
    Row,
} from "reactstrap";
import { t } from "i18next";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useFormik } from "formik";
import axiosInstance, {backendResourceApi} from "../../helpers/axios_instance";
import * as Yup from "yup";
import { toast } from "react-toastify";

// Validation schema using Yup
const validationSchema = Yup.object({
    name: Yup.string()
        .required("Name is required")
        .min(3, "Name must be at least 3 characters long"),
    email: Yup.string().email("Invalid email"),
    country: Yup.string(),
    state: Yup.string(),
    city: Yup.string(),
    address: Yup.string(),
    phone: Yup.string(),
    zip_code: Yup.string(),
    fax: Yup.string(),
    website: Yup.string(),
    profile_photo: Yup.mixed()
        .nullable()
        .test('fileSize', t('File too large, file size must be under 5MB'), (value: any) => {
            if (!value) return true; // Allow null/undefined values
            return value.size <= 5 * 1024 * 1024; // Max 5MB
        })
        .test('fileType', t('Unsupported file type, please only select png or jpeg file!'), (value: any) => {
            if (!value) return true; // Allow null/undefined values
            const acceptedTypes = ['image/jpeg', 'image/png']; // Add more types as needed
            return acceptedTypes.includes(value.type); // Check if the file's MIME type is in the accepted list
        }),
});

// Interface for form values
interface FormValues {
    name: string;
    profile_photo: File | null;
    country: string;
    state: string;
    city: string;
    address: string;
    phone: string;
    zip_code: string;
    fax: string;
    website: string;
    email: string;
    initialProfilePhoto?: string;
}

const ManageCompanyProfile = () => {
    // Initialize formik
    const formik = useFormik<FormValues>({
        initialValues: {
            name: "",
            profile_photo: null,
            country: "",
            state: "",
            city: "",
            address: "",
            phone: "",
            zip_code: "",
            fax: "",
            website: "",
            email: "",
            initialProfilePhoto: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("country", values.country);
            formData.append("state", values.state);
            formData.append("city", values.city);
            formData.append("address", values.address);
            formData.append("phone", values.phone);
            formData.append("zip_code", values.zip_code);
            formData.append("fax", values.fax);
            formData.append("email", values.email);
            formData.append("website", values.website);
            if (values.profile_photo) {
                formData.append("profile_photo", values.profile_photo);
            }

            try {
                await axiosInstance.put(
                    "/company/company-profile/",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                toast.success(t("Form submitted successfully"));
            } catch (error: any) {
                toast.error(error?.response?.data || "Error submitting form");
            } finally {
                setSubmitting(false);
            }
        },
        enableReinitialize: true, // Allow reinitializing when initialValues change
    });

    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

    // Load data from backend on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get("/company/company-profile/");
                const data = response.data;
                formik.setValues({
                    name: data.name || "",
                    profile_photo: null,
                    country: data.country || "",
                    state: data.state || "",
                    city: data.city || "",
                    address: data.address || "",
                    phone: data.phone || "",
                    zip_code: data.zip_code || "",
                    fax: data.fax || "",
                    email: data.email || "",
                    website: data.website || "",
                    initialProfilePhoto: data.profile_photo || "",
                });
            } catch (error: any) {
                toast.error(error?.response?.data || "Error fetching data");
            }
        };

        fetchData();
    }, []); // Empty dependency array since formik is stable

    const handleProfilePhotoChange = (e: any) => {
        const file = e.currentTarget.files[0];
        if (file) {
            // Create a temporary URL for the file
            const tempUrl = URL.createObjectURL(file);
            setImageUrl(tempUrl);
            formik.setFieldValue('profile_photo', file);
        }
    };

    const previewImageUrl = useMemo(() => {
        return imageUrl? imageUrl: (String(backendResourceApi) + formik.values.initialProfilePhoto);
    }, [imageUrl, formik.values.initialProfilePhoto])

    document.title = "Manage Company Profile | ZALEX - Financial Software";

    const { values, errors, touched, handleSubmit, handleChange, setFieldValue, isSubmitting } = formik;

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb
                        title={t("Manage Company Profile")}
                        pageTitle={t("Manage Company Profile")}
                    />
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xxl={9}>
                                <Card>
                                    <CardBody>
                                            <Row>
                                                <Col lg={4}>
                                                    <FormGroup>
                                                        <Label for="name">{t("Name")}</Label>
                                                        <Input
                                                            type="text"
                                                            name="name"
                                                            id="name"
                                                            placeholder={t("Enter company name")}
                                                            value={values.name}
                                                            onChange={handleChange}
                                                            invalid={!!errors.name && touched.name}
                                                        />
                                                        {errors.name && touched.name && (
                                                            <FormText>{errors.name}</FormText>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                                <Col lg={4}>
                                                    <FormGroup>
                                                        <Label for="country">{t("Country")}</Label>
                                                        <Input
                                                            type="text"
                                                            name="country"
                                                            id="country"
                                                            placeholder={t("Enter country name")}
                                                            value={values.country}
                                                            onChange={handleChange}
                                                            invalid={!!errors.country && touched.country}
                                                        />
                                                        {errors.country && touched.country && (
                                                            <FormText>{errors.country}</FormText>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                                <Col lg={4}>
                                                    <FormGroup>
                                                        <Label for="state">{t("State")}</Label>
                                                        <Input
                                                            type="text"
                                                            name="state"
                                                            id="state"
                                                            placeholder={t("Enter some state")}
                                                            value={values.state}
                                                            onChange={handleChange}
                                                            invalid={!!errors.state && touched.state}
                                                        />
                                                        {errors.state && touched.state && (
                                                            <FormText>{errors.state}</FormText>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={4}>
                                                    <FormGroup>
                                                        <Label for="city">{t("City")}</Label>
                                                        <Input
                                                            type="text"
                                                            name="city"
                                                            id="city"
                                                            placeholder={t("Enter city name")}
                                                            value={values.city}
                                                            onChange={handleChange}
                                                            invalid={!!errors.city && touched.city}
                                                        />
                                                        {errors.city && touched.city && (
                                                            <FormText>{errors.city}</FormText>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                                <Col lg={4}>
                                                    <FormGroup>
                                                        <Label for="address">{t("Address")}</Label>
                                                        <Input
                                                            type="text"
                                                            name="address"
                                                            id="address"
                                                            placeholder={t("Enter address")}
                                                            value={values.address}
                                                            onChange={handleChange}
                                                            invalid={!!errors.address && touched.address}
                                                        />
                                                        {errors.address && touched.address && (
                                                            <FormText>{errors.address}</FormText>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                                <Col lg={4}>
                                                    <FormGroup>
                                                        <Label for="phone">{t("Phone")}</Label>
                                                        <Input
                                                            type="text"
                                                            name="phone"
                                                            id="phone"
                                                            placeholder={t("Enter phone number")}
                                                            value={values.phone}
                                                            onChange={handleChange}
                                                            invalid={!!errors.phone && touched.phone}
                                                        />
                                                        {errors.phone && touched.phone && (
                                                            <FormText>{errors.phone}</FormText>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={4}>
                                                    <FormGroup>
                                                        <Label for="zip_code">{t("Zip Code")}</Label>
                                                        <Input
                                                            type="text"
                                                            name="zip_code"
                                                            id="zip_code"
                                                            placeholder={t("Enter zip code")}
                                                            value={values.zip_code}
                                                            onChange={handleChange}
                                                            invalid={!!errors.zip_code && touched.zip_code}
                                                        />
                                                        {errors.zip_code && touched.zip_code && (
                                                            <FormText>{errors.zip_code}</FormText>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                                <Col lg={4}>
                                                    <FormGroup>
                                                        <Label for="fax">{t("Fax")}</Label>
                                                        <Input
                                                            type="text"
                                                            name="fax"
                                                            id="fax"
                                                            placeholder={t("Enter fax number")}
                                                            value={values.fax}
                                                            onChange={handleChange}
                                                            invalid={!!errors.fax && touched.fax}
                                                        />
                                                        {errors.fax && touched.fax && (
                                                            <FormText>{errors.fax}</FormText>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                                <Col lg={4}>
                                                    <FormGroup>
                                                        <Label for="website">{t("Website")}</Label>
                                                        <Input
                                                            type="text"
                                                            name="website"
                                                            id="website"
                                                            placeholder={t("Enter website URL")}
                                                            value={values.website}
                                                            onChange={handleChange}
                                                            invalid={!!errors.website && touched.website}
                                                        />
                                                        {errors.website && touched.website && (
                                                            <FormText>{errors.website}</FormText>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={4}>
                                                    <FormGroup>
                                                        <Label for="email">{t("Email")}</Label>
                                                        <Input
                                                            type="email"
                                                            name="email"
                                                            id="email"
                                                            placeholder={t("Enter email address")}
                                                            value={values.email}
                                                            onChange={handleChange}
                                                            invalid={!!errors.email && touched.email}
                                                        />
                                                        {errors.email && touched.email && (
                                                            <FormText>{errors.email}</FormText>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <Button type="submit" color="primary" disabled={isSubmitting}>
                                                {t("Submit")}
                                            </Button>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg={3}>
                                <Card>
                                    <CardHeader>
                                        <Row className={'text-center'}>
                                            <Col lg={12} >
                                                <div className="profile-user">
                                                    <img src={previewImageUrl}
                                                         className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                                         alt="user-profile"/>
                                                    <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                                        <Input id="profile-img-file-input" type="file"
                                                               onChange={handleProfilePhotoChange}
                                                               className="profile-img-file-input"/>
                                                        <Label htmlFor="profile-img-file-input"
                                                               className="profile-photo-edit avatar-xs">
                                                            <span
                                                                className="avatar-title rounded-circle bg-light text-body">
                                                                <i className="ri-camera-fill"></i>
                                                            </span>
                                                        </Label>

                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                {formik.errors?.profile_photo && (
                                                    <div className={'text-danger'}>{formik.errors?.profile_photo}</div>
                                                )}
                                            </Col>
                                        </Row>
                                        <Row className={'text-center'}>
                                            <Label>{t("Company Logo")}</Label>
                                        </Row>
                                    </CardHeader>
                                </Card>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ManageCompanyProfile;