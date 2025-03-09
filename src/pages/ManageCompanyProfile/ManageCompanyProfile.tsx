import React, { useEffect, useState } from "react";
import {
    Button,
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
import { ErrorMessage, Field, Formik } from "formik";
import ImageSelector from "../../Components/Common/ImageSelector";
import axiosInstance from "../../helpers/axios_instance";
import * as Yup from "yup";
import { toast } from "react-toastify";

// Validation schema using Yup
const validationSchema = Yup.object({
    name: Yup.string()
        .required("Name is required")
        .min(3, "Name must be at least 3 characters long"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    country: Yup.string(),
    state: Yup.string(),
    city: Yup.string(),
    address: Yup.string(),
    phone: Yup.string(),
    zip_code: Yup.string(),
    fax: Yup.string(),
    website: Yup.string(),
    profile_photo: Yup.mixed().nullable(),
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
    initialImageUrl?: string;
}

const ManageCompanyProfile = () => {
    // State to hold fetched data as initial values
    const [initialValues, setInitialValues] = useState<FormValues>({
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
        initialImageUrl: "",
    });

    // Load data from backend on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get("/company/company-profile/");
                const data = response.data;
                setInitialValues({
                    name: data.name || "",
                    profile_photo: null, // We don't set the file here; use initialImageUrl for display
                    country: data.country || "",
                    state: data.state || "",
                    city: data.city || "",
                    address: data.address || "",
                    phone: data.phone || "",
                    zip_code: data.zip_code || "",
                    fax: data.fax || "",
                    email: data.email || "",
                    website: data.website || "",
                    initialImageUrl: data.profile_photo || "", // For ImageSelector to display the existing image
                });
            } catch (error: any) {
                toast.error(error?.response?.data || "Error fetching data");
            }
        };

        fetchData();
    }, []);

    // Handle form submission
    const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
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
            const response = await axiosInstance.put(
                "/company/company-profile/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            toast.success("Form submitted successfully");
        } catch (error: any) {
            toast.error(error?.response?.data || "Error submitting form");
        } finally {
            setSubmitting(false);
        }
    };

    document.title = "Manage Company Profile | ZALEX - Financial Software";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb
                        title={t("Manage Company Profile")}
                        pageTitle={t("Manage Company Profile")}
                    />
                    <Row>
                        <Formik
                            enableReinitialize // Allow reinitializing when initialValues change
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, values, errors, touched, isSubmitting }) => (
                                <Form>
                                    <Row>
                                        <Col lg={4}>
                                            <FormGroup>
                                                <Label for="name">{t("Name")}</Label>
                                                <Field
                                                    as={Input}
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    placeholder={t("Enter company name")}
                                                    invalid={!!errors.name && touched.name}
                                                />
                                                <ErrorMessage name="name" component={FormText} />
                                            </FormGroup>
                                        </Col>
                                        <Col lg={4}>
                                            <FormGroup>
                                                <Label for="country">{t("Country")}</Label>
                                                <Field
                                                    as={Input}
                                                    type="text"
                                                    name="country"
                                                    id="country"
                                                    placeholder={t("Enter country name")}
                                                    invalid={!!errors.country && touched.country}
                                                />
                                                <ErrorMessage name="country" component={FormText} />
                                            </FormGroup>
                                        </Col>
                                        <Col lg={4}>
                                            <FormGroup>
                                                <Label for="state">{t("State")}</Label>
                                                <Field
                                                    as={Input}
                                                    type="text"
                                                    name="state"
                                                    id="state"
                                                    placeholder={t("Enter some state")}
                                                    invalid={!!errors.state && touched.state}
                                                />
                                                <ErrorMessage name="state" component={FormText} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={4}>
                                            <FormGroup>
                                                <Label for="city">{t("City")}</Label>
                                                <Field
                                                    as={Input}
                                                    type="text"
                                                    name="city"
                                                    id="city"
                                                    placeholder={t("Enter city name")}
                                                    invalid={!!errors.city && touched.city}
                                                />
                                                <ErrorMessage name="city" component={FormText} />
                                            </FormGroup>
                                        </Col>
                                        <Col lg={4}>
                                            <FormGroup>
                                                <Label for="address">{t("Address")}</Label>
                                                <Field
                                                    as={Input}
                                                    type="text"
                                                    name="address"
                                                    id="address"
                                                    placeholder={t("Enter address")}
                                                    invalid={!!errors.address && touched.address}
                                                />
                                                <ErrorMessage name="address" component={FormText} />
                                            </FormGroup>
                                        </Col>
                                        <Col lg={4}>
                                            <FormGroup>
                                                <Label for="phone">{t("Phone")}</Label>
                                                <Field
                                                    as={Input}
                                                    type="text"
                                                    name="phone"
                                                    id="phone"
                                                    placeholder={t("Enter phone number")}
                                                    invalid={!!errors.phone && touched.phone}
                                                />
                                                <ErrorMessage name="phone" component={FormText} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={4}>
                                            <FormGroup>
                                                <Label for="zip_code">{t("Zip Code")}</Label>
                                                <Field
                                                    as={Input}
                                                    type="text"
                                                    name="zip_code"
                                                    id="zip_code"
                                                    placeholder={t("Enter zip code")}
                                                    invalid={!!errors.zip_code && touched.zip_code}
                                                />
                                                <ErrorMessage name="zip_code" component={FormText} />
                                            </FormGroup>
                                        </Col>
                                        <Col lg={4}>
                                            <FormGroup>
                                                <Label for="fax">{t("Fax")}</Label>
                                                <Field
                                                    as={Input}
                                                    type="text"
                                                    name="fax"
                                                    id="fax"
                                                    placeholder={t("Enter fax number")}
                                                    invalid={!!errors.fax && touched.fax}
                                                />
                                                <ErrorMessage name="fax" component={FormText} />
                                            </FormGroup>
                                        </Col>
                                        <Col lg={4}>
                                            <FormGroup>
                                                <Label for="website">{t("Website")}</Label>
                                                <Field
                                                    as={Input}
                                                    type="text"
                                                    name="website"
                                                    id="website"
                                                    placeholder={t("Enter website URL")}
                                                    invalid={!!errors.website && touched.website}
                                                />
                                                <ErrorMessage name="website" component={FormText} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={4}>
                                            <FormGroup>
                                                <Label for="email">{t("Email")}</Label>
                                                <Field
                                                    as={Input}
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    placeholder={t("Enter email address")}
                                                    invalid={!!errors.email && touched.email}
                                                />
                                                <ErrorMessage name="email" component={FormText} />
                                            </FormGroup>
                                        </Col>
                                        <Col lg={4}>
                                            <ImageSelector
                                                name="profile_photo" // Match the name used in handleSubmit
                                                label={t("Select Image")}
                                                setFieldValue={setFieldValue}
                                                initialImageUrl={values.initialImageUrl}
                                            />
                                        </Col>
                                    </Row>

                                    <Button type="submit" color="primary" disabled={isSubmitting}>
                                        {t("Submit")}
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ManageCompanyProfile;