import React, {useEffect, useMemo, useState} from 'react';
import {Card, CardBody, CardHeader, Col, Input, Label, Row} from "reactstrap";
import {t} from "i18next";
import {Permission} from "./types";
import {useSelector} from "react-redux";
import axiosInstance from "../../helpers/axios_instance";

interface Props {
    activeUserPermissions:  number[];
    setActiveUserPermissions: any;
}

const GeneralPermissions: React.FC<Props> = ({ activeUserPermissions, setActiveUserPermissions }) => {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const userProfileData = useSelector((state: any) => state.InitialData.userProfileData);

    useEffect(() => {
        axiosInstance.get("/users/permissions/")
            .then(response => {
                setPermissions(response?.data?.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [userProfileData]); // Depend on userProfileData to initialize only once

    const groupedPermissions = useMemo(() => {
        return permissions.reduce((acc, perm) => {
            if (!acc[perm.model]) {
                acc[perm.model] = [];
            }
            acc[perm.model].push(perm);
            return acc;
        }, {} as Record<string, Permission[]>);
    }, [permissions]);

    // Handle checkbox toggle
    const handlePermissionToggle = (permissionId: number) => {
        setActiveUserPermissions((prev: any) =>
            prev.includes(permissionId)
                ? prev.filter((id: number) => id !== permissionId)  // Remove if already selected
                : [...prev, permissionId]                // Add if not selected
        );
    };

    return (
        <React.Fragment>
            <Card>
                <CardBody style={{maxHeight: "300px", overflowY: "scroll", display: "block"}}>
                    <Row>
                        {Object.entries(groupedPermissions).map(([model, perms]) => (
                            <Col md={12} key={model} className="mb-3 bg-body-tertiary">
                                <Row>
                                    <Col>
                                        <strong>{t(model)}</strong>
                                    </Col>
                                </Row>
                                {perms.map((perm) => (
                                    <Row key={perm.id} className="ml-3 align-items-center">
                                        <Col xs="auto">
                                            <Input
                                                type="checkbox"
                                                checked={activeUserPermissions.includes(perm.id)}
                                                onChange={() => handlePermissionToggle(perm.id)}
                                            />
                                        </Col>
                                        <Col>{t(perm.codename)}</Col>
                                    </Row>
                                ))}
                            </Col>
                        ))}
                    </Row>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default GeneralPermissions;