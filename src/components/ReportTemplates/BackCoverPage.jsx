 
import PropTypes from "prop-types";
import ColliersLogo from "../../images/ColliersLogo.svg"
import SocialMediaLinks from "../../images/SocialMediaLinks.png"
import { formatter, intFormatter, nFormatter } from "../../helpers/utils";
import { useRef, useEffect } from "react";

const BackCoverPage = ({ year, quarter, quarterVal, propertyType, marketName, OfficeData }) => {
  const pageRef = useRef()
  const imageRef = useRef()
  const statRef = useRef()
  const disclaimerRef = useRef()
  const countryDisclaimerRef = useRef()
  const dividerRef = useRef()
  const officeInfoRef = useRef()

  useEffect(() => {
    if (OfficeData) {
      console.log('OfficeData',OfficeData)
    }
    [imageRef, statRef, disclaimerRef, countryDisclaimerRef, dividerRef, officeInfoRef].forEach(ref => {
      if (ref.current) ref.current.classList.remove("animate");
    });
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      // Fallback: immediately animate everything
      [imageRef, statRef, disclaimerRef, countryDisclaimerRef, dividerRef, officeInfoRef].forEach(ref => {
        if (ref.current) ref.current.classList.add("animate");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            [imageRef, statRef, disclaimerRef, countryDisclaimerRef, dividerRef, officeInfoRef].forEach(ref => {
              if (ref.current) ref.current.classList.add("animate");
            });
          } 
          // else {
          //   [imageRef, statRef, disclaimerRef, countryDisclaimerRef, dividerRef].forEach(ref => {
          //     if (ref.current) ref.current.classList.remove("animate");
          //   });
          // }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.5 }
    );

    if (pageRef.current) observer.observe(pageRef.current);

    return () => {
      if (pageRef.current) observer.unobserve(pageRef.current);
      observer.disconnect();
    };
  }, [year, quarter, quarterVal, propertyType, marketName, OfficeData]);
  
  

  return(
    <div ref={pageRef} className="BackCoverPageContainer" style={{position:"relative", height: "8.5in", width: "11in", backgroundColor:"white", marginInline:'auto', marginBottom:"2px", marginTop:"2px"}}>
      <img ref={imageRef} className="backCoverColliersLogo" style={{position:"absolute", left:"50%", transform:"translateX(-50%)", top:".35in", height:".57in", width:"1in", zIndex:"3"}} src={ColliersLogo} alt="" />
      <div className="ContentBlock" style={{position:"absolute", height:"7.75in", width:"11in", backgroundColor:"#000759"}}>
        <div ref={statRef} className="StatsBlock" 
          style={{
            position:"absolute", 
            height:"3in", 
            width:"8in", 
            top:"1.25in", 
            left:"50%", 
            transform:"translateX(-50%)",
            display:"grid",
            gridTemplateColumns:"repeat(3, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)"
          }}
        >
          <div className="topLeftStat" style={{display:"flex", flexDirection:"column", justifyContent:"center", alignContent:"center"}}>
            <div style={{marginTop:"15%", height:"40%", fontSize:"50px", fontWeight:"lighter", color:"white", textAlign:"center"}}>$5.5B+</div>
            <div style={{marginBottom:"15%", height:"30%", fontSize:"12px", color:"#4D92FF", fontWeight:"bold", textAlign:"center"}}>ANNUAL<br/>REVENUE</div>
          </div>
          <div className="middleRightStat" style={{display:"flex", flexDirection:"column", justifyContent:"center", alignContent:"center"}}>
            <div style={{marginTop:"15%", height:"40%", fontSize:"50px", fontWeight:"lighter", color:"white", textAlign:"center"}}>70</div>
            <div style={{marginBottom:"15%", height:"30%", fontSize:"12px", color:"#4D92FF", fontWeight:"bold", textAlign:"center"}}>COUNTRIES WE<br/>OPERATE IN</div>
          </div>
          <div className="topRightStat" style={{display:"flex", flexDirection:"column", justifyContent:"center", alignContent:"center"}}>
            <div style={{marginTop:"15%", height:"40%", fontSize:"50px", fontWeight:"lighter", color:"white", textAlign:"center"}}>$108B+</div>
            <div style={{marginBottom:"15%", height:"30%", fontSize:"12px", color:"#4D92FF", fontWeight:"bold", textAlign:"center"}}>ASSETS UNDER<br/>MANAGEMENT</div>
          </div>
          <div className="bottomLeftStat" style={{display:"flex", flexDirection:"column", justifyContent:"center", alignContent:"center"}}>
            <div style={{height:"40%", fontSize:"50px", fontWeight:"lighter", color:"white", textAlign:"center"}}>46,000</div>
            <div style={{marginBottom:"30%", height:"30%", fontSize:"12px", color:"#4D92FF", fontWeight:"bold", textAlign:"center"}}>LEASE AND SALE<br/>TRANSACTIONS</div>
          </div>
          <div className="bottomMiddleStat" style={{display:"flex", flexDirection:"column", justifyContent:"center", alignContent:"center"}}>
            <div style={{height:"40%", fontSize:"50px", fontWeight:"lighter", color:"white", textAlign:"center"}}>2B</div>
            <div style={{marginBottom:"30%", height:"30%", fontSize:"12px", color:"#4D92FF", fontWeight:"bold", textAlign:"center"}}>SQUARE FEET<br/>MANAGED</div>
          </div>
          <div className="bottomRightStat" style={{display:"flex", flexDirection:"column", justifyContent:"center", alignContent:"center"}}>
            <div style={{height:"40%", fontSize:"50px", fontWeight:"lighter", color:"white", textAlign:"center"}}>24,000</div>
            <div style={{marginBottom:"30%", height:"30%", fontSize:"12px", color:"#4D92FF", fontWeight:"bold", textAlign:"center"}}>PROFESSIONALS</div>
          </div>
        </div>
        <div ref={countryDisclaimerRef} className="countryDisclaimer" 
          style={{position:"absolute", left:"50%", transform:"translateX(-50%)", top:"4.5in", height:"0.4in", width:"2in", color:"white", fontSize:"9px", fontStyle:"italic", textAlign:"center", alignContent:"center"}}
        >
          Number of countries includes affiliates
        </div>
        <div ref={dividerRef} className="pageDivider" style={{position:"absolute", top:"5in", left:"50%", transform:"translateX(-50%)", height:"1px", width:"10in", backgroundColor:"white"}}></div>
        <div className="PageInfo" style={{position:"absolute", top:"5.1in", height:"1.8in", width:"11in", display:"flex", flexDirection:"row"}}>
          {OfficeData?.[0] && (
            <div ref={officeInfoRef} className="MarketContacts" style={{height:"2.5in", marginTop:"0in", width:"2in", display:"flex", flexDirection:"column"}}>
              <div style={{marginLeft:"20px", fontFamily:"Merriweather", fontSize:"16px", color:"white", textAlign:"left", marginTop:"5px", fontWeight:"bold"}}>Market Contacts</div>
              <div style={{fontFamily:"Open Sans", display:"flex", flexDirection:"column", marginTop:"auto", marginBottom:"auto", marginLeft:"23px"}}>
                <span style={{fontSize:"14px", color:"white", textAlign:"left"}}><strong>{OfficeData?.[0]?.attributes?.MarketLeaderName}</strong></span>
                <span style={{fontSize:"14px", color:"white", textAlign:"left"}}>Market Leader</span>
                <span style={{fontSize:"14px", color:"white", textAlign:"left"}}>{OfficeData?.[0]?.attributes?.MarketLeaderPhone}</span>
                <span style={{fontSize:"12px", color:"white", textAlign:"left"}}>{OfficeData?.[0]?.attributes?.MarketLeaderEmail}</span>
              </div>
              {OfficeData?.[0]?.attributes?.ResearcherName && (
                <div style={{fontFamily:"Open Sans", display:"flex", flexDirection:"column", marginTop:"auto", marginBottom:"auto", marginLeft:"23px"}}>
                  <span style={{fontSize:"14px", color:"white", textAlign:"left"}}><strong>{OfficeData?.[0]?.attributes?.ResearcherName}</strong></span>
                  <span style={{fontSize:"14px", color:"white", textAlign:"left"}}>{OfficeData?.[0]?.attributes?.ResearcherTitle}</span>
                  <span style={{fontSize:"14px", color:"white", textAlign:"left"}}>{OfficeData?.[0]?.attributes?.ResearcherPhone}</span>
                  <span style={{fontSize:"12px", color:"white", textAlign:"left"}}>{OfficeData?.[0]?.attributes?.ResearcherMail}</span>
                </div>
              )}
            </div>
          )}
          <div ref={disclaimerRef} className="Disclaimers" style={{ height:"2in", width:"8.5in", display:"flex", flexDirection:"column", marginInline:"auto"}}>
            <div style={{height:"0.3in", paddingLeft:"0.1in", marginTop:"-6px", fontSize:"14px", color:"white", alignContent:"center"}}><strong>Global Stats Boiler Plate</strong></div>
            <div style={{height:"0.55in", paddingInline:"0.1in", fontSize:"10px", fontWeight:"lighter", color:"white", alignContent:"center"}}>
              <div style={{height:"0.65", width:"100%", display:"flex", flexDirection:"column", fontSize:"11px", justifyContent:"center"}}>
                <span>
                  Colliers (NASDAQ, TSX: CIGI) is a global diversified professional services and investment management company. Operating through three industry-leading platforms – Real Estate Services, Engineering, and Investment Management – we have a proven business model, an enterprising culture, and a unique partnership philosophy that drives growth and value creation. For 30 years, Colliers has consistently delivered approximately 20% compound annual returns for shareholders, fuelled by visionary leadership, significant inside ownership and substantial recurring earnings. With $5.5 billion in annual revenues, a team of 24,000 professionals, and $108 billion in assets under management, Colliers remains committed to accelerating the success of our clients, investors, and people worldwide. Learn more at corporate.colliers.com, X @Colliers or LinkedIn.
                </span>
              </div>
            </div>
            <div style={{height:"0.25in", paddingTop:".4in", paddingLeft:"0.1in", fontSize:"14px", color:"white", alignContent:"center"}}><strong>Copyright</strong></div>
            <div style={{height:"0.55in", paddingInline:"0.1in", fontSize:"10px", fontWeight:"lighter", color:"white", alignContent:"center", display:"flex", flexDirection:"row", gap:"5%"}}>
              <div style={{height:"0.65", marginTop:".3in", width:"100%", display:"flex", flexDirection:"column", fontSize:"11px", justifyContent:"center"}}>
                <span> This document has been prepared by Colliers for advertising and general information only. Colliers makes no guarantees, representations, or warranties of any kind, expressed or implied, regarding the information, including but not limited to, warranties of content, accuracy, and reliability. Any interested party should undertake their own inquiries as to the accuracy of the information. Colliers excludes unequivocally all inferred or implied terms, conditions, and warranties arising out of this document and excludes all liability for loss and damages arising therefrom. This publication is the copyrighted property of Colliers and/or its licensor(s). © 2025. All rights reserved. This communication is not intended to cause or induce breach of an existing listing agreement. Colliers International, LLC. </span>
              </div>
            </div>
          </div>
        </div>
        {OfficeData?.[0] && (
          <div className="OfficeInfo" style={{position:"absolute", top:"8.1in", left:"0.25in", width:"7in", height:".2in", color:"#55638F", fontSize:"12px"}}>
            {`${OfficeData[0]?.attributes?.DisplayAddress} | ${OfficeData[0]?.attributes?.PhoneNumber}`}
          </div>
        )}
        <img src={SocialMediaLinks} alt="" className="socialMedia" style={{position:"absolute", top:"7.75in", left:"9.25in", width:"1.5in", height:".7in", objectFit:"contain"}} />
      </div>

    </div>
  );
};

BackCoverPage.propTypes = {
  quarter: PropTypes.string.isRequired,
  quarterVal: PropTypes.string.isRequired,
  propertyType: PropTypes.string.isRequired,
  marketName: PropTypes.string.isRequired,
  OfficeData: PropTypes.object
};

export default BackCoverPage;
