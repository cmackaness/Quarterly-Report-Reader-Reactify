import { CalciteShell } from "@esri/calcite-components-react";
import { useEffect, useState, lazy } from "react";
import PropTypes from "prop-types";

import { useSiteSelection } from "../../contexts/SiteSelectionContext";
// import ReportConfig from "../../components/Configure/ReportConfig";
import ConfigPopover from "../../components/Configure/ConfigPopover";
import ReportContent from "../../components/Configure/ReportContent";

function Configure() {
  const { setupComplete } = useSiteSelection();

  return (
    <CalciteShell>
      {/* <ReportConfig /> */}
      <ConfigPopover />
      <ReportContent />
    </CalciteShell>
  );
}

Configure.propTypes = {
  children: PropTypes.element,
};

export default Configure;
