import {
  CalciteNavigation,
  CalciteNavigationLogo,
  CalciteNavigationUser,
} from "@esri/calcite-components-react";
import { NavLink } from "react-router-dom";

import { useUserAuthorization } from "../contexts/UserAuthorizationContext";

import styles from "./SiteSelectionAppNav.module.css";
import ColliersLogo from "../images/ColliersLogo.svg";

function SiteSelectionAppNav() {
  const { credential } = useUserAuthorization();

  const fullNameFromCredentialId = credential.userId
    .split("@")[0]
    .split(".")
    .join(" ");

  return (
    <CalciteNavigation slot="header">
      <CalciteNavigationLogo
        slot="logo"
        // Use imported asset so Vite handles the path during build
        thumbnail={ColliersLogo}
        heading="Quarterly Report Reader App"
        description="Colliers"
      ></CalciteNavigationLogo>
      <CalciteNavigationUser
        slot="user"
        full-name={fullNameFromCredentialId}
        username={credential.userId}
        userId={credential.userId}
      ></CalciteNavigationUser>
    </CalciteNavigation>
  );
}

export default SiteSelectionAppNav;
