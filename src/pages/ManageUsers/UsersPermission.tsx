import axiosInstance from 'helpers/axios_instance';
import { t } from 'i18next';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {Card, CardBody, Col, Container, Row, Input, CardHeader, Label} from 'reactstrap';

export interface Permission {
    id: number;
    codename: string;
    model: string;
    app_label: string;
}

interface Props {
    setPermissionsId: any;
    permissionsId: number[];
}

const UsersPermission: React.FC<Props> = ({ setPermissionsId, permissionsId }) => {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const userProfileData = useSelector((state: any) => state.InitialData.userProfileData);
    
    // Store checked permissions
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

    useEffect(() => {
        axiosInstance.get("/users/permissions/")
            .then(response => {
                setPermissions(response?.data?.data);
                // Initialize selectedPermissions with user's existing permissions
                setSelectedPermissions(userProfileData?.user?.user_permissions || []);
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
        setSelectedPermissions((prev) => 
            prev.includes(permissionId) 
                ? prev.filter(id => id !== permissionId)  // Remove if already selected
                : [...prev, permissionId]                // Add if not selected
        );
    };

    return (
        <Container fluid>
            <Card>
                <CardHeader className={'table-light p-2'}><Label>{t("User Permissions")}</Label></CardHeader>
                <CardBody >
                    <Row>
                        {Object.entries(groupedPermissions).map(([model, perms]) => (
                            <Col md={3} key={model} className="mb-3">
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
                                                checked={selectedPermissions.includes(perm.id)}
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
        </Container>
    );
};

export default UsersPermission;
