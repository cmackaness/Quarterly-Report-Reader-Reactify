import PropTypes from "prop-types";
import ColliersLogo from "../../images/ColliersLogo.svg"
import { useState, useEffect } from "react";

import Q1 from "../../images/QuarterGraphics/Q1.png"
import Q2 from "../../images/QuarterGraphics/Q2.png"
import Q3 from "../../images/QuarterGraphics/Q3.png"
import Q4 from "../../images/QuarterGraphics/Q4.png"

function CoverPageSummary({ image, year, quarter, propertyType, marketName, summary}) {
  
  return(
    <div className="coverPageSummaryContainer" style={{position:"relative", height: "9.5in", width: "11in", marginInline:'auto', marginBottom:"5px", backgroundColor:"white"}}>
      <div className="coverPageContentBlock" style={{position:"absolute", left:"2.92in", backgroundColor:"#000759", height:"9.5in", width:"5.17in", zIndex:"2"}}>
        <img className="ColliersLogo" style={{position:"absolute", left:"50%", transform:"translateX(-50%)", top:".84in", height:".57in", width:"1in", zIndex:"3"}} src={ColliersLogo} alt="" />
        <div className="CoverTopText" style={{position:"absolute", left:"50%", transform:"translateX(-50%)", top:"2.12in", backgroundColor:"#4D92FF", height:".4in", width:"2in", zIndex:"3", color:"white", textAlign:"center", alignContent:"center"}}>
          <span style={{color:"white", textAlign:"center", fontFamily:"Open Sans", fontSize:"20px", verticalAlign:"middle"}}>{propertyType}</span>
        </div>
        <div className="QuarterContainer"style={{position:"absolute", top:"2.61in", height:"1.42in", width:"5.17in", zIndex:"3"}}>
          <div style={{display:"flex", flexDirection:"row", width:"100%", height:"100%", alignContent:"center", justifyContent:"center"}}>
            {quarter &&(
              <img className="QuarterNumber" src={quarter} style={{objectFit:"contain", height:"0.83in",  width:"1.42in", marginTop:".34in", marginRight:"1%"}} alt="" />
            )}
            <div className="Year" style={{fontFamily:"Open Sans", fontSize:"90px", color:"#4D92FF", marginLeft:"1%"}}>{year}</div>
          </div>
        </div>
        {/* <div className="VerticalLine" style={{position:"absolute", left:"50%", transform:"translateX(-50%)", top:"4.03in", height:"1.37in", width:"1.5px", zIndex:"3", backgroundColor:"white"}}></div> */}
        <div className="MarketName" style={{position:"absolute", left:"50%", transform:"translateX(-50%)", top:"5.66in", height:".4in", width:"5.5in", zIndex:"3", color:"white", textAlign:"center", fontFamily:"Open Sans", fontSize:"20px"}}>{marketName}</div>
      </div>
      <div className="backgroundImage" style={{position:"absolute", top:"0.25in", left:"0.25in", backgroundColor:"#C3E6FF", height:"8.75in", width:"10.5in", zIndex:"1"}}>
        {image &&(
          <img src={image} style={{height:"100%", width:"100%", objectFit:"cover"}} alt=""></img>
        )}
      </div>
      <div className="SummaryText" style={{position:"absolute", top:"4.3in", left:"50%", transform:"translateX(-50%)", height:"0.82in", width:"6.46in", zIndex:'2', color:"#55638F", textAlign:"center", alignContent:"center"}}>
        <button id="ConfigureReportButton" style={{backgroundColor:"#4D92FF", borderRadius:"15px", color:"white", fontSize:"18px", border:"2px outset white", padding:"10px"}}>Configure Report</button>
      </div>
    </div>
  );
};

CoverPageSummary.propTypes = {
  image: PropTypes.string.isRequired,
  year:PropTypes.string.isRequired,
  quarter: PropTypes.string.isRequired,
  propertyType: PropTypes.string.isRequired,
  marketName: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
};

export default CoverPageSummary;
