 
import PropTypes from "prop-types";
import ColliersLogo from "../../images/ColliersLogo.svg"
import MarketSummaryChart from "../Configure/MarketSummaryChart";
import { formatter, intFormatter, nFormatter } from "../../helpers/utils";
import { useState, useEffect, useRef } from "react";
import { useSiteSelection } from "../../contexts/SiteSelectionContext";
import { onScroll, animate, stagger, splitText } from 'animejs';

import buildings from "../../images/ColliersIcons/Buildings.png"
import marketSize from "../../images/ColliersIcons/marketSize.png"
import askingRate from "../../images/ColliersIcons/AskingRate.png"
import vacancyRate from "../../images/ColliersIcons/VacancyRate.png"
import Absorption from "../../images/ColliersIcons/Absorption.png"
import underConstruction from "../../images/ColliersIcons/UnderConstruction.png"
import newSupply from "../../images/ColliersIcons/NewSupply.png"
import VacancyRentChart from "../Configure/SubTypeVacancyRentChart";

const MarketSubtypePages = ({ image, year, quarter, quarterVal, propertyType, marketName, submarkets, subtype, marketData, chartData }) => {
  const { marketType } = useSiteSelection()
  const pageRef = useRef()
  const imageRef = useRef()
  const statRef = useRef()
  const leftChartRef = useRef()
  const rightChartRef = useRef()

  useEffect(() => {
    [imageRef, statRef, leftChartRef, rightChartRef].forEach(ref => {
      if (ref.current) ref.current.classList.remove("animate");
    });
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      // Fallback: immediately animate everything
      [imageRef, statRef, leftChartRef, rightChartRef].forEach(ref => {
        if (ref.current) ref.current.classList.add("animate");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            [imageRef, statRef, leftChartRef, rightChartRef].forEach(ref => {
              if (ref.current) ref.current.classList.add("animate");
            });
          } 
          // else {
          //   [imageRef, statRef, leftChartRef, rightChartRef].forEach(ref => {
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
  }, [image, year, quarter, quarterVal, propertyType, marketName, submarkets, subtype, marketData, chartData]);


  return(
        <div ref={pageRef} key={subtype} className="coverPageSummaryContainer" style={{position:"relative", height: "8.5in", width: "11in", backgroundColor:"white", marginInline:'auto', marginBottom:"2px", marginTop:"2px"}}>
        <div className="QuarterDatePropertyTypeContainer" style={{display:"flex", flexDirection:"row", position:"absolute", left:"0.5in", top:"0.25in", height:".43in", width:"4in", zIndex:"3", color:"#4D92FF", alignContent:"center"}}>
          <div style={{display:"flex", flexDirection:"row", height:"100%", alignContent:"center"}}>
            <div style={{width:"100%", fontSize:"25px", fontWeight:"lighter", marginRight:"10px", display:"flex", flexDirection:"row"}}>
              <img src={quarter} alt="" style={{width:"50%", height:"20px", objectFit:"contain", marginTop:"auto", marginBottom:"auto", marginRight:"5px", paddingBottom:"2px"}}></img>
              <span style={{width:"50%", fontSize:"25px", fontWeight:"lighter", marginRight:"10px"}}>{year}</span>
            </div>
          </div>
          <div style={{width:"2px",height:"80%", backgroundColor:"#4D92FF"}}></div>
          <div style={{width:"49.5%", height:"100%", marginLeft:"10px", fontSize:"15px", marginTop:"7px", fontWeight:"bold"}}>{propertyType}</div>
        </div>
        <div className="CoverTopText" style={{position:"absolute", left:"0.5in", top:"0.6in", backgroundColor:"white", height:".43in", width:"8.51in", zIndex:"3", color:"white", alignContent:"center"}}>
          {propertyType === "Office" && (
            <>
              <span style={{color:"#000759", fontFamily:"Merriweather", fontSize:"20px"}}>{`${marketName} `} </span>
              {submarkets && submarkets.map((submarket, index) => (
                <span key={submarket}>
                  {index === 0 && (<span style={{color:"#000759", fontFamily:"Merriweather", fontSize:"20px", justifyContent:"center", paddingLeft:"10px"}}> {submarket}</span>)}
                  {index > 0 && (<span style={{color:"#000759", fontFamily:"Merriweather", fontSize:"20px", justifyContent:"center"}}> | {submarket}</span>)}
                </span>
              ))}
              <span style={{color:"#000759", fontFamily:"Merriweather", fontSize:"20px"}}>{` | Class ${subtype}`} </span>
            </>
          )}
          {(propertyType === "Industrial" && subtype === "WD") && (
            <>
              <span style={{color:"#000759", fontFamily:"Merriweather", fontSize:"20px"}}>{`${marketName}`} </span>
              {submarkets && submarkets.map((submarket, index) => (
                <span key={submarket}>
                  {index === 0 && (<span style={{color:"#000759", fontFamily:"Merriweather", fontSize:"20px", justifyContent:"center", paddingLeft:"10px"}}> {submarket}</span>)}
                  {index > 0 && (<span style={{color:"#000759", fontFamily:"Merriweather", fontSize:"20px", justifyContent:"center"}}> | {submarket}</span>)}
                </span>
              ))}
              <span style={{color:"#000759", fontFamily:"Merriweather", fontSize:"20px"}}>{` | Warehouse / Distribution`} </span>
            </>
          )}
          {(propertyType === "Industrial" && subtype === "MF") && (
            <>
              <span style={{color:"#000759", fontFamily:"Merriweather", fontSize:"20px"}}>{`${marketName}`} </span>
              {submarkets && submarkets.map((submarket, index) => (
                <span key={submarket}>
                  {index === 0 && (<span style={{color:"#000759", fontFamily:"Merriweather", fontSize:"20px", justifyContent:"center", paddingLeft:"10px"}}> {submarket}</span>)}
                  {index > 0 && (<span style={{color:"#000759", fontFamily:"Merriweather", fontSize:"20px", justifyContent:"center"}}> | {submarket}</span>)}
                </span>
              ))}
              <span style={{color:"#000759", fontFamily:"Merriweather", fontSize:"20px"}}>{` | Manufacturing`} </span>
            </>
          )}
          {(propertyType === "Industrial" && subtype === "OS") && (
            <>
              <span style={{color:"#000759", fontFamily:"Merriweather", fontSize:"20px"}}>{`${marketName}`} </span>
              {submarkets && submarkets.map((submarket, index) => (
                <span key={submarket}>
                  {index === 0 && (<span style={{color:"#000759", fontFamily:"Merriweather", fontSize:"20px", justifyContent:"center", paddingLeft:"10px"}}> {submarket}</span>)}
                  {index > 0 && (<span style={{color:"#000759", fontFamily:"Merriweather", fontSize:"20px", justifyContent:"center"}}> | {submarket}</span>)}
                </span>
              ))}
              <span style={{color:"#000759", fontFamily:"Merriweather", fontSize:"20px"}}>{` | Flex`} </span>
            </>
          )}
        </div>
        <img className="ColliersLogo" style={{position:"absolute", left:"9.51in", top:"0.35in", height:"0.55in", width:".97in"}} src={ColliersLogo} alt="" />
        {image && (
          <img ref={imageRef} className="marketImage" src={image} alt='' style={{ position:"absolute", left:".25in", top:"1.25in", height: "3.5in", width: "4.8in", objectFit:"fill"}}/>
        )}
        <div ref={statRef} className="summarySubStatsContainer"  style={{position:"absolute",left:"5.5in", top:"1.2in", height: "3.5in", width: "5.5in", display:"flex", flexDirection:"row"}}>
          <div style={{width:"45%", height:"100%", display:"flex", flexDirection:"column"}}>
            <div className="SummaryStat" style={{height:"33%", width:"100%", display:"flex", flexDirection:"row"}}>
              <div style={{width:"30%", height:"100%", paddingTop:"5px"}}>
                <img src={marketSize} alt="" style={{width:"100%", height:"90%", objectFit:"contain"}}/>
              </div>
              <div style={{width:"70%", height:"100%", display:"flex", flexDirection:"column", alignContent:"center"}}>
                <div style={{height:"60%", paddingLeft:"10px", color:"#000759", fontSize:"25px", fontWeight:"bold", alignContent:"end"}}>{`${formatter.format((marketData.sum_of_inventory/1000000))} MSF`}</div>
                <div style={{height:"30%", paddingLeft:"10px", fontSize:"12px"}}>Total Inventory</div>
              </div>
            </div>
            <div className="SummaryStat" style={{height:"33%", width:"100%", display:"flex", flexDirection:"row"}}>
              <div style={{width:"30%", height:"100%", justifyContent:"center", alignContent:"center"}}>
                <img src={askingRate} alt="" style={{width:"100%", height:"90%", objectFit:"contain"}}/>
              </div>
              <div style={{width:"70%", height:"100%", display:"flex", flexDirection:"column", alignContent:"center"}}>
                <div style={{height:"60%", paddingLeft:"10px", color:"#000759", fontSize:"25px", fontWeight:"bold", alignContent:"end"}}>{`$${formatter.format(marketData.weightedaveragerent)}`}</div>
                {(propertyType === "Industrial") && (
                  <div style={{height:"30%", paddingLeft:"10px", fontSize:"12px"}}>Asking Rate PSF (NNN)</div>
                )}
                {(propertyType === "Office") && (
                  <div style={{height:"30%", paddingLeft:"10px", fontSize:"12px"}}>Asking Rate PSF (FSG)</div>
                )}
              </div>
            </div>
            <div className="SummaryStat" style={{height:"33%", width:"100%", display:"flex", flexDirection:"row"}}>
              <div style={{width:"30%", height:"100%", paddingTop:"9px"}}>
                <img src={vacancyRate} alt="" style={{width:"80%", height:"80%", marginTop:"5px", marginLeft:"5px", objectFit:"contain"}}/>
              </div>
              <div style={{width:"70%", height:"100%", display:"flex", flexDirection:"column", alignContent:"center"}}>
                <div style={{height:"60%", paddingLeft:"10px", color:"#000759", fontSize:"25px", fontWeight:"bold", alignContent:"end"}}>{`${formatter.format((marketData.sum_of_directvacantspace/marketData.sum_of_inventory)*100)}%`}</div>
                <div style={{height:"30%", paddingLeft:"10px", fontSize:"12px"}}>Vacancy Rate</div>
              </div>
            </div>
          </div>
          <div style={{width:"50%", height:"100%", display:"flex", flexDirection:"column"}}>
            <div className="SummaryStat" style={{height:"33%", width:"100%", display:"flex", flexDirection:"row"}}>
              <div style={{width:"30%", height:"100%", paddingTop:"6px"}}>
                <img src={Absorption} alt="" style={{width:"80%", height:"80%", marginTop:"5px", marginLeft:"5px", objectFit:"contain"}}/>
              </div>
              <div style={{width:"70%", height:"100%", display:"flex", flexDirection:"column", alignContent:"center"}}>
                <div style={{height:"60%", color:"#000759", fontSize:"23px", fontWeight:"bold", alignContent:"end"}}>{`${formatter.format((marketData.sum_of_absorptionytd/1000000))} MSF`}</div>
                <div style={{height:"30%", fontSize:"12px"}}>Net Absorption YTD</div>
              </div>
            </div>
            <div className="SummaryStat" style={{height:"33%", width:"100%", display:"flex", flexDirection:"row"}}>
              <div style={{width:"35%", height:"100%", paddingTop:"13px"}}>
                <img src={underConstruction} alt="" style={{width:"80%", height:"80%", marginTop:"5px", marginLeft:"5px", objectFit:"contain"}}/>
              </div>
              <div style={{width:"100%", height:"110%", display:"flex", flexDirection:"column"}}>
                <div style={{height:"60%", color:"#000759", fontSize:"23px", fontWeight:"bold", alignContent:"end"}}>{`${formatter.format((marketData.sum_of_underconstruction/1000000))} MSF`}</div>
                <div style={{height:"30%", fontSize:"12px"}}>Under Construction</div>
              </div>
            </div>
            <div className="SummaryStat" style={{height:"33%", width:"100%", display:"flex", flexDirection:"row"}}>
              <div style={{width:"35%", height:"100%", paddingTop:"8px"}}>
                <img src={newSupply} alt="" style={{width:"80%", height:"80%", marginTop:"5px", marginLeft:"5px", objectFit:"contain"}}/>
              </div>
              <div style={{width:"100%", height:"110%", display:"flex", flexDirection:"column"}}>
                <div style={{height:"60%", color:"#000759", fontSize:"23px", fontWeight:"bold", alignContent:"end"}}>{`${formatter.format((marketData.sum_of_newsupply/1000000))} MSF`}</div>
                <div style={{height:"30%", fontSize:"12px"}}>New Supply</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{position:"absolute", top:"5in", height: "3.6in", width: "11in", display:"flex", flexDirection:"row"}}>
          <div ref={leftChartRef} className="vacancyGraphContainer" style={{height:"100%", width:"45%", marginRight:"2.5%", marginLeft:"2.5%"}}>
            <div style={{height:"4%", marginBottom:"5%", fontSize:"14px", letterSpacing:".75px"}}><strong>VACANCY AND RENTAL RATE TREND</strong></div>
            <div style={{height:"95%", width:"100%"}}>
              {chartData && (
                <VacancyRentChart
                  chartData={chartData[subtype]}
                />
              )}
            </div>
          </div>
          <div ref={rightChartRef} className="subMarketGraphContainer" style={{height:"100%", width:"45%", marginLeft:"2.5%", marginRight:"2.5%"}}>
            <div style={{height:"4%", marginBottom:"5%", fontSize:"14px", letterSpacing:".75px"}}><strong>NEW SUPPLY, NET ABSORPTION AND VACANCY TREND</strong></div>
            <div style={{height:"95%", width:"100%"}}>
              {chartData && (
                <MarketSummaryChart
                  chartData={chartData[subtype]}
                />
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

MarketSubtypePages.propTypes = {
  image: PropTypes.string.isRequired,
  quarter: PropTypes.string.isRequired,
  quarterVal: PropTypes.string.isRequired,
  propertyType: PropTypes.string.isRequired,
  marketName: PropTypes.string.isRequired,
  subtype: PropTypes.string.isRequired,
  marketData: PropTypes.object.isRequired,
  chartData:  PropTypes.object.isRequired,
};

export default MarketSubtypePages;
