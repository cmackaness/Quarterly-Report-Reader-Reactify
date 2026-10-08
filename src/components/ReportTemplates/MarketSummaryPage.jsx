 
import PropTypes from "prop-types";
import ColliersLogo from "../../images/ColliersLogo.svg"
import MarketSummaryChart from "../Configure/MarketSummaryChart";
import { formatter, intFormatter, nFormatter, negativeToParentheses, numFormatter } from "../../helpers/utils";
import { useState, useEffect, useRef } from "react";
import { useSiteSelection } from "../../contexts/SiteSelectionContext";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-placement";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import MapComponent from "../map";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { onScroll, animate, stagger, splitText } from 'animejs';
import { sum } from "d3";
const MarketSummaryPage = ({ year, quarter, quarterVal, propertyType, marketName, submarkets, marketData, chartData, tableData }) => {
  const pageRef = useRef();
  const sumStatsRef = useRef();
  const mapRef = useRef();
  const chartRef = useRef();
  const tableRef = useRef();

  const csvConfig = mkConfig({
    filename: `${marketName} Q${quarterVal} ${year} ${propertyType} Report Data`,
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const handleExportData = () => {
    const outData = [];
    for (const submarket in tableData) {
      for (const feature in tableData[submarket]) {
        outData.push(tableData[submarket][feature]);
      }
    }
    const csv = generateCsv(csvConfig)(outData);
    download(csvConfig)(csv);
  };


useEffect(() => {
  [sumStatsRef, tableRef, chartRef, mapRef].forEach(ref => {
    if (ref.current) ref.current.classList.remove("animate");
  });
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    // Fallback: immediately animate everything
    [sumStatsRef, tableRef, chartRef, mapRef].forEach(ref => {
      if (ref.current) ref.current.classList.add("animate");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          [sumStatsRef, tableRef, chartRef, mapRef].forEach(ref => {
            if (ref.current) ref.current.classList.add("animate");
          });
        } 
        // else {
        //   [sumStatsRef, tableRef, chartRef, mapRef].forEach(ref => {
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
}, [year, quarter, quarterVal, propertyType, marketName, marketData, chartData, tableData]);


  return(
    <div ref={pageRef} className="marketSummaryPageContainer" style={{position:"relative", height: "8.5in", width: "11in", backgroundColor:"white", marginInline:'auto', marginBottom:"2px", marginTop:"2px"}}>
      <div className="QuarterDatePropertyTypeContainer" style={{display:"flex", flexDirection:"row", position:"absolute", left:"0.5in", top:"0.25in", height:".43in", width:"4in", zIndex:"3", color:"#4D92FF", alignContent:"center"}}>
        <div style={{display:"flex", flexDirection:"row", height:"100%", alignContent:"center"}}>
          <div style={{width:"100%", fontSize:"25px", fontWeight:"lighter", marginRight:"10px", display:"flex", flexDirection:"row"}}>
            <img src={quarter} alt="" style={{width:"50%", height:"20px", objectFit:"contain", marginTop:"auto", marginBottom:"auto", marginRight:"5px", paddingBottom:"2px"}}></img>
            <span style={{width:"50%", fontSize:"25px", fontWeight:"lighter", marginRight:"10px"}}>{year}</span>
          </div>
        </div>
        <div style={{width:"2px", height:"80%", backgroundColor:"#4D92FF"}}></div>
        <div style={{width:"49.5%", height:"100%", marginLeft:"10px", fontSize:"18px", marginTop:"7px", fontWeight:"bold"}}>{propertyType}</div>
        {/* <button className="downloadButton" onClick={() => {handleExportData()}}>Download Report Data</button> */}
      </div>
      <div className="CoverTopText" style={{position:"absolute", left:"0.5in", top:"0.6in",height:".43in", width:"8.51in", zIndex:"3", color:"white", alignContent:"center"}}>
        <span style={{color:"#000759", fontFamily:"Merriweather", fontSize:"30px"}}>{marketName}</span>
        {submarkets && submarkets.map((submarket, index) => (
          <span key={submarket}>
            {index === 0 && (<span style={{color:"#000759", fontFamily:"Merriweather", fontSize:"20px", justifyContent:"center", paddingLeft:"10px"}}> {submarket}</span>)}
            {index > 0 && (<span style={{color:"#000759", fontFamily:"Merriweather", fontSize:"20px", justifyContent:"center"}}> | {submarket}</span>)}
          </span>
        ))}
      </div>
      <img className="ColliersLogo" style={{position:"absolute", left:"9.51in", top:"0.3in", height:"0.55in", width:".97in", zIndex:"3"}} src={ColliersLogo} alt="" />
      <div ref={sumStatsRef} className="summaryStatsContainer"  style={{position:"absolute", top:"1.3in", height: "1in", width: "10.5in", display:"flex", flexDirection:"row", gap:"60px", marginInline:".25in"}}>
        <div className="SummaryStat" style={{position:"relative", height:"100%", width:"25%"}}>
          <div className="StatisticName" style={{position:"absolute", width:"100%", textAlign:"left", color:"#000579", fontSize:"15px"}}><strong>Overall Vacancy Rate</strong></div>
          <div className="StatisticValue" style={{position:"absolute", top:"30%", width:"70%", height:"70%", textAlign:"center", color:"#4D92FF", fontSize:"50px", fontWeight:"300", fontFamily:"Open Sans"}}>
            <span>{`${numFormatter(marketData.OverallVacancy, 1, 1)}%`}</span>
          </div>
          <div className="StatisticComparison" style={{display:"flex", flexDirection:"column", position:"absolute",  bottom:"10%", left:"85%", width:"35%", height:"0.38in", textAlign:"left", color:"#7A8ABC", fontSize:"10px"}}>
            {marketData.OverallVacancy > marketData.VacancyPrevYr && (
              <span style={{height:"50%"}}>&#9650; YOY</span>
            )}
            {marketData?.OverallVacancy < marketData.VacancyPrevYr  &&(
              <span style={{height:"50%"}}>&#9660; YOY</span>
            )}
            {marketData?.VacancyForecast?.includes("Up") && (
              <span style={{height:"50%"}}>&#9650; Forecast</span>
            )}
            {marketData?.VacancyForecast?.includes("Down") &&(
              <span style={{height:"50%"}}>&#9660; Forecast</span>
            )}
            {marketData?.VacancyForecast?.includes("Same")&&(
              <span style={{height:"50%"}}>- Forecast</span>
            )}
          </div>
        </div>
        <div className="SummaryStat" style={{position:"relative", height:"100%", width:"25%"}}>
          <div className="StatisticName" style={{position:"absolute", width:"100%", textAlign:"left", color:"#000579", fontSize:"15px"}}><strong>Net Absorption (SF)</strong></div>
          <div className="StatisticValue" style={{position:"absolute", top:"30%", width:"70%", height:"70%", left:"-2%", textAlign:"center", color:"#4D92FF", fontSize:"50px", fontWeight:"300", fontFamily:"Open Sans"}}>
            <span>{`${nFormatter(marketData?.AbsorptionSum, 1)}`}</span>
          </div>
          <div className="StatisticComparison" style={{display:"flex", flexDirection:"column", position:"absolute",  bottom:"10%", left:"80%", width:"35%", height:"0.38in", textAlign:"left", color:"#7A8ABC", fontSize:"10px"}}>
            {marketData?.AbsorptionSum > marketData?.AbsorptionSumPrevYr && (
              <span style={{height:"50%"}}>&#9650; YOY</span>
            )}
            {marketData?.AbsorptionSum < marketData?.AbsorptionSumPrevYr &&(
              <span style={{height:"50%"}}>&#9660; YOY</span>
            )}
            {marketData?.AbsorptionForecast?.includes("Positive") && (
              <span style={{height:"50%"}}>&#9650; Forecast</span>
            )}
            {marketData?.AbsorptionForecast?.includes("Negative") &&(
              <span style={{height:"50%"}}>&#9660; Forecast</span>
            )}
            {marketData?.AbsorptionForecast?.includes("Close to zero")&&(
              <span style={{height:"50%"}}>- Forecast</span>
            )}
          </div>
        </div>
        <div className="SummaryStat" style={{position:"relative", height:"100%", width:"25%"}}>
          <div className="StatisticName" style={{position:"absolute", width:"105%", textAlign:"left", color:"#000579", fontSize:"15px"}}><strong>Under Construction (SF)</strong></div>
          <div className="StatisticValue" style={{position:"absolute", top:"30%", width:"70%", height:"70%", textAlign:"center", color:"#4D92FF", fontSize:"50px", fontWeight:"300", fontFamily:"Open Sans"}}>
            <span>{`${nFormatter(marketData?.ConstructionSum, 1)}`}</span>
          </div>
          <div className="StatisticComparison" style={{display:"flex", flexDirection:"column", position:"absolute", bottom:"10%", left:"80%", width:"35%", height:"0.38in", textAlign:"left", color:"#7A8ABC", fontSize:"10px"}}>
            {marketData?.ConstructionSum > marketData?.ConstructionSumPrevYr && (
              <span style={{height:"50%"}}>&#9650; YOY</span>
            )}
            {marketData?.ConstructionSum < marketData?.ConstructionSumPrevYr &&(
              <span style={{height:"50%"}}>&#9660; YOY</span>
            )}
            {marketData?.ConstructionForecast?.includes("Likely") || marketData?.ConstructionForecast?.includes("Somewhat likely") || marketData?.ConstructionForecast?.includes("Very likely") && (
              <span style={{height:"50%"}}>&#9650; Forecast</span>
            )}
            {marketData?.ConstructionForecast?.includes("Not likely at all") &&(
              <span style={{height:"50%"}}>&#9660; Forecast</span>
            )}
          </div>
        </div>
        <div className="SummaryStat" style={{position:"relative", height:"100%", width:"25%"}}>
          {propertyType === "Office" && (
            <div className="StatisticName" style={{position:"absolute", width:"100%", top:"-15px", textAlign:"left", color:"#000579", fontSize:"14px"}}><strong>Overall Class A<br/>Asking Lease Rates (FSG)</strong></div>
          )}
          {propertyType === "Industrial" && (
            <div className="StatisticName" style={{position:"absolute", width:"100%", top:"-15px", textAlign:"left", color:"#000579", fontSize:"14px"}}><strong>Overall Warehouse<br/>Asking Lease Rates (NNN)</strong></div>
          )}
          <div className="StatisticValue" style={{position:"absolute", top:"30%", width:"70%", height:"70%", textAlign:"center", color:"#4D92FF", fontSize:"50px", fontWeight:"300", fontFamily:"Open Sans"}}>
            <span>{`$${numFormatter(marketData.LeaseRates, 2, 2)}`}</span>
          </div>
          <div className="StatisticComparison" style={{display:"flex", flexDirection:"column", position:"absolute", bottom:"10%", left:"80%", width:"35%", height:"0.38in", textAlign:"left", color:"#7A8ABC", fontSize:"10px"}}>
            {marketData?.RentTrend?.includes("Increasing") || marketData?.RentTrend?.includes("Peaking") && (
              <span style={{height:"50%"}}>&#9650; YOY</span>
            )}
            {marketData?.RentTrend?.includes("Declining") || marketData?.RentTrend?.includes("Bottoming") &&(
              <span style={{height:"50%"}}>&#9660; YOY</span>
            )}
            {marketData?.RentTrend?.includes("No Clear Direction") &&(
              <span style={{height:"50%"}}>- YOY</span>
            )}
            {marketData?.RentForecast?.includes("Up") && (
              <span style={{height:"50%"}}>&#9650; Forecast</span>
            )}
            {marketData?.RentForecast?.includes("Down") &&(
              <span style={{height:"50%"}}>&#9660; Forecast</span>
            )}
            {marketData?.RentForecast?.includes("Same") &&(
              <span style={{height:"50%"}}>- Forecast</span>
            )}
          </div>
        </div>
      </div>
      <div ref={tableRef} className="marketSumHistoricComparison"  style={{position:"absolute", left:"4.54in", top:"2.6in", height: "2.3in", width: "6.2in"}}>
        <table style={{width:"100%", borderCollapse:"collapse"}}>
          <thead style={{color:"#000759", borderBottom:"1px, solid #000759"}}>
            <tr>
              <th style={{fontSize:"18px", width:"50%", textAlign:"left", paddingBottom:"5px"}}>Historic Comparison</th>
              <th style={{width:"16%", textAlign:"center"}}>{`Q${quarterVal} ${year}`}</th>
              {quarterVal?.includes(1) &&(
                <th style={{width:"16%", textAlign:"center"}}>{`Q4 ${year-1}`}</th>
              )}
              {!quarterVal?.includes(1) &&(
                <th style={{width:"16%", textAlign:"center"}}>{`Q${quarterVal-1} ${year}`}</th>
              )}
              <th style={{width:"16%", textAlign:"center"}}>{`Q${quarterVal} ${year-1}`}</th>
            </tr>
          </thead>
          <tbody className="summaryStatsTableBody" >
            <tr style={{borderCollapse:"collapse", borderBottom:"2px, solid #C3E6FF"}}>
              <td style={{color:"#4D92FF", textAlign:"left", fontWeight:"bold", padding:"2px"}}>Total Inventory (in millions of SF)</td>
              <td style={{color:"#353E59", textAlign:"center", padding:"2px"}}>{negativeToParentheses(((marketData?.InventorySum)/1000000))}</td>
              <td style={{color:"#353E59", textAlign:"center", padding:"2px"}}>{negativeToParentheses((marketData?.InventoryLastQ/1000000))}</td>
              <td style={{color:"#353E59", textAlign:"center", padding:"2px"}}>{negativeToParentheses((marketData?.InventoryLastYr/1000000))}</td>
            </tr>
            <tr>
              <td style={{color:"#4D92FF", textAlign:"left", fontWeight:"bold", padding:"2px"}}>New Supply (in thousands of SF)</td>
              <td style={{color:"#353E59", textAlign:"center", padding:"2px"}}>{negativeToParentheses((marketData?.NewSupplySum/1000))}</td>
              <td style={{color:"#353E59", textAlign:"center", padding:"2px"}}>{negativeToParentheses((marketData?.NewSupplyPrevQ/1000))}</td>
              <td style={{color:"#353E59", textAlign:"center", padding:"2px"}}>{negativeToParentheses((marketData?.NewSupplyPrevYr/1000))}</td>
            </tr>
            <tr>
              <td style={{color:"#4D92FF", textAlign:"left", fontWeight:"bold", padding:"2px"}}>Net Absorption (in thousands of SF)</td>
              <td style={{color:"#353E59", textAlign:"center", padding:"2px"}}>{negativeToParentheses((marketData?.AbsorptionSum/1000))}</td>
              <td style={{color:"#353E59", textAlign:"center", padding:"2px"}}>{negativeToParentheses((marketData?.AbsorptionSumPrevQ/1000))}</td>
              <td style={{color:"#353E59", textAlign:"center", padding:"2px"}}>{negativeToParentheses((marketData?.AbsorptionSumPrevYr/1000))}</td>
            </tr>
            <tr>
              <td style={{color:"#4D92FF", textAlign:"left", fontWeight:"bold", padding:"2px"}}>Overall Vacancy Rate</td>
              <td style={{color:"#353E59", textAlign:"center", padding:"2px"}}>{`${formatter.format(marketData?.OverallVacancy)}%`}</td>
              <td style={{color:"#353E59", textAlign:"center", padding:"2px"}}>{`${formatter.format(marketData?.VacancyPrevQ)}%`}</td>
              <td style={{color:"#353E59", textAlign:"center", padding:"2px"}}>{`${formatter.format(marketData?.VacancyPrevYr)}%`}</td>
            </tr>
            <tr>
              <td style={{color:"#4D92FF", textAlign:"left", fontWeight:"bold", padding:"2px"}}>Under Construction (in thousands of SF)</td>
              <td style={{color:"#353E59", textAlign:"center", padding:"2px"}}>{intFormatter.format((marketData?.ConstructionSum/1000))}</td>
              <td style={{color:"#353E59", textAlign:"center", padding:"2px"}}>{intFormatter.format((marketData?.ConstructionSumPrevQ/1000))}</td>
              <td style={{color:"#353E59", textAlign:"center", padding:"2px"}}>{intFormatter.format((marketData?.ConstructionSumPrevYr/1000))}</td>
            </tr>
            <tr>
              <td style={{color:"#4D92FF", textAlign:"left", fontWeight:"bold", padding:"2px"}}>Overall Asking Lease Rates (NNN)</td>
              <td style={{color:"#353E59", textAlign:"center", padding:"2px"}}>{`$${formatter.format(marketData?.LeaseRates)}`}</td>
              <td style={{color:"#353E59", textAlign:"center", padding:"2px"}}>{`$${formatter.format(marketData?.LeaseRatesLastQ)}`}</td>
              <td style={{color:"#353E59", textAlign:"center", padding:"2px"}}>{`$${formatter.format(marketData?.LeaseRatePrevYr)}`}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div ref={chartRef} className="marketSumGraphContainer"  style={{position:"absolute", left:"4.54in", top:"4.7in", height: "3.75in", width: "6.2in"}}>
        <div style={{height:"4%", marginBottom:"5%", fontSize:"16px" }}><strong>Market Graph</strong></div>
        <div style={{height:"95%", width:"100%"}}>
          <MarketSummaryChart
            chartData={chartData}
          />
        </div>
      </div>
      <div ref={mapRef} className="mapContainer" style={{position:"absolute", top:"2.6in", height: "5.6in", left:"10px", width: "4.25in", backgroundColor:"#000759"}}>
        <MapComponent />
      </div>
    </div>
  );
};

MarketSummaryPage.propTypes = {
  quarter: PropTypes.string.isRequired,
  quarterVal: PropTypes.string.isRequired,
  propertyType: PropTypes.string.isRequired,
  marketName: PropTypes.string.isRequired,
  marketData: PropTypes.object.isRequired,
  chartData:  PropTypes.object.isRequired,
  tableData:  PropTypes.object.isRequired,
};

export default MarketSummaryPage;
