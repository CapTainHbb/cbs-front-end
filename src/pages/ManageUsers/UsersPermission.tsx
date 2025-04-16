import React, {useState} from 'react';
import {Card, CardBody, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane} from 'reactstrap';
import classnames from "classnames";
import GeneralPermissions from "./GeneralPermissions";
import {t} from "i18next";
import ViewBillingPermissions from "./ViewBillingPermissions";
import {UserProfile} from "./types";
import {FinancialAccount} from "../Accounting/types";


interface Props {
    activeUserProfile: UserProfile | null;
    activeUserPermissions:  number[];
    setActiveUserPermissions: any;
    selectedFinancialAccounts: FinancialAccount[];
    setSelectedFinancialAccounts: any;
    isEdit: boolean;
}

const UsersPermission: React.FC<Props> = ({ activeUserProfile, activeUserPermissions,
                                              setActiveUserPermissions, isEdit,
                                          setSelectedFinancialAccounts, selectedFinancialAccounts}) => {

    const [pillsTab, setPillsTab] = useState<string>("1");
    const pillsToggle = (tab : any) => {
        if (pillsTab !== tab) {
            setPillsTab(tab);
        }
    };

    return (
        <Container fluid>
            <Row>
                <h5 className="mb-3">{t("User Permissions")}</h5>
                <div>
                    <CardBody className={'p-0 m-0'}>
                        <Nav pills className="nav-custom-light mb-2">
                            <NavItem>
                                <NavLink style={{ cursor: "pointer" }} className={classnames({ active: pillsTab === "1", })} onClick={() => { pillsToggle("1"); }} >
                                    {t("General Permissions")}
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink style={{ cursor: "pointer" }} className={classnames({ active: pillsTab === "2", })} onClick={() => { pillsToggle("2"); }} >
                                    {t("View Billing Permissions")}
                                </NavLink>
                            </NavItem>
                        </Nav>


                        <TabContent activeTab={pillsTab} className="text-muted">
                            <TabPane tabId="1" id="home-1">
                                <GeneralPermissions activeUserPermissions={activeUserPermissions}
                                                    setActiveUserPermissions={setActiveUserPermissions} />
                            </TabPane>

                            <TabPane tabId="2" id="profile-1">
                                <ViewBillingPermissions
                                    setSelectedFinancialAccounts={setSelectedFinancialAccounts}
                                    selectedFinancialAccounts={selectedFinancialAccounts}
                                />
                            </TabPane>
                        </TabContent>
                    </CardBody>
                </div>
            </Row>
        </Container>
    );
};

export default UsersPermission;
