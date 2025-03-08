import React, {useEffect, useState} from 'react';
import {
    Button, Col,
    Container, Form, FormGroup, FormText, Input, Label,
    Row,
} from "reactstrap";
import {t} from "i18next";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {ErrorMessage, Field, Formik, useFormik} from "formik";
import ImageSelector from "../../Components/Common/ImageSelector";
import axiosInstance from "../../helpers/axios_instance";
import * as Yup from "yup";
import {toast} from "react-toastify";

// Validation schema using Yup
const validationSchema = Yup.object({
    textInput: Yup.string()
        .required("Text input is required")
        .min(3, "Text must be at least 3 characters long"),
    image: Yup.mixed().nullable(),
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
}

// Interface for backend data
interface BackendData {
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
}

const ManageCompanyProfile = () => {

    const initialValues: FormValues = {
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
    };

    // Load data from backend on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get<BackendData>(
                    "/company-profile/"
                );
                return {
                    name: response.data.name,
                    profile_photo: response.data.profile_photo,
                    country: response.data.country,
                    state: response.data.state,
                    city: response.data.city,
                    address: response.data.address,
                    phone: response.data.phone,
                    zip_code: response.data.phone,
                    fax: response.data.fax,
                    email: response.data.email,
                    website: response.data.website
                };
            } catch (error: any) {
                toast.error(error?.response?.data);
                return null;
            }
        };

        fetchData().then((data) => {
            if (data) {
                formik.setValues({
                    name: data.name,
                    profile_photo: data.profile_photo,
                    country: data.country,
                    state: data.state,
                    city: data.city,
                    address: data.address,
                    phone: data.phone,
                    zip_code: data.zip_code,
                    fax: data.fax,
                    email: data.email,
                    website: data.website

                });
                formik.setFieldValue("initialImageUrl", data.profile_photo);
            }
        });
    }, []);

    // Handle form submission
    const handleSubmit = async (values: FormValues) => {
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
            const response = await axiosInstance.post(
                "/company-profile/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            toast.success("Form submitted successfully:");
        } catch (error) {
            toast.error("Error submitting form");
        }
    };

    const formik = useFormik<FormValues>({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
    });

    document.title = "Manage Company Profile | ZALEX - Financial Software";

    return (
        <React.Fragment>
            <div className={'page-content'}>
                <Container fluid>
                    <BreadCrumb title={t("Manage Company Profile")} pageTitle={t("Manage Company Profile")} />
                    <Row>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ setFieldValue, values }) => (
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
                                                    invalid={!!formik.errors.name && formik.touched.name}
                                                />
                                                <ErrorMessage
                                                    name="name"
                                                    component={FormText}
                                                    // color="danger"
                                                />
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
                                                    invalid={!!formik.errors.country && formik.touched.country}
                                                />
                                                <ErrorMessage
                                                    name="country"
                                                    component={FormText}
                                                    // color="danger"
                                                />
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
                                                    invalid={!!formik.errors.state && formik.touched.state}
                                                />
                                                <ErrorMessage
                                                    name="state"
                                                    component={FormText}
                                                    // color="danger"
                                                />
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
                                                    invalid={!!formik.errors.city && formik.touched.city}
                                                />
                                                <ErrorMessage
                                                    name="city"
                                                    component={FormText}
                                                    // color="danger"
                                                />
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
                                                    invalid={!!formik.errors.address && formik.touched.address}
                                                />
                                                <ErrorMessage
                                                    name="address"
                                                    component={FormText}
                                                />
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
                                                    invalid={!!formik.errors.phone && formik.touched.phone}
                                                />
                                                <ErrorMessage
                                                    name="phone"
                                                    component={FormText}
                                                />
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
                                                    invalid={!!formik.errors.zip_code && formik.touched.zip_code}
                                                />
                                                <ErrorMessage
                                                    name="zip_code"
                                                    component={FormText}
                                                />
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
                                                    invalid={!!formik.errors.fax && formik.touched.fax}
                                                />
                                                <ErrorMessage
                                                    name="fax"
                                                    component={FormText}
                                                />
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
                                                    invalid={!!formik.errors.website && formik.touched.website}
                                                />
                                                <ErrorMessage
                                                    name="website"
                                                    component={FormText}
                                                />
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
                                                    invalid={!!formik.errors.email && formik.touched.email}
                                                />
                                                <ErrorMessage
                                                    name="email"
                                                    component={FormText}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col lg={4}>
                                            <ImageSelector
                                                name="image"
                                                label="Select Image"
                                                setFieldValue={setFieldValue}
                                                // initialImageUrl={values.initialImageUrl}
                                            />
                                        </Col>
                                    </Row>


                                    <Button type="submit" color="primary">
                                        Submit
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