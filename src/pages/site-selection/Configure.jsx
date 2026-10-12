
import { useEffect, useState, lazy } from "react";
import PropTypes from "prop-types";
import TxDOT_Logo from "../../images/TxDOT_Logo.png"

import { useSiteSelection } from "../../contexts/SiteSelectionContext";
function Configure() {
  const { setupComplete } = useSiteSelection();

  return (
    <div style={{width:"100%", height:"100%"}}>
      <div style={{display:"flex", width:"100%", height:"10%", background:"linear-gradient(to right, #0056a9, #002e69)", color:"white", flexDirection:"row"}}>
        <img src={TxDOT_Logo} alt="TxDOT Logo" style={{ width: "8%", height: "80%", marginTop: "auto", marginBottom: "auto", objectFit: "contain", marginRight: "10px" }} />
        <span style={{display:"flex", marginTop:"auto", marginBottom:"auto", fontSize: "2rem", fontWeight:"bold" }}>Configure</span>
      </div>
    </div>
  );
}

Configure.propTypes = {
  children: PropTypes.element,
};

export default Configure;
