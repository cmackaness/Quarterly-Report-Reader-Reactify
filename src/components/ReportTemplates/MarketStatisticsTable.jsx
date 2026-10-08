import React from 'react'; 
import {CalciteLabel, CalciteCombobox, CalciteComboboxItem} from "@esri/calcite-components-react";
import PropTypes from "prop-types";
import { formatter, intFormatter, nFormatter, negativeToParentheses } from "../../helpers/utils";
import { useState, useEffect, useRef, fragment} from "react";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { onScroll, animate, stagger, splitText } from 'animejs';

const MarketStatisticsTable = ({ year, quarter, quarterVal, propertyType, marketName, marketData }) => {
  const containerRefs = useRef([]);
  const headerRefsByChunk = useRef([]);
  
  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const submarketChunks = chunkArray(Object.keys(marketData), 4);

  const csvConfig = mkConfig({
    filename: `${marketName} Q${quarterVal} ${year} ${propertyType} Report Data`,
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const handleExportData = () => {
    const outData = [];
    for (const submarket in marketData) {
      for (const feature in marketData[submarket]) {
        outData.push(marketData[submarket][feature]);
      }
    }
    const csv = generateCsv(csvConfig)(outData);
    download(csvConfig)(csv);
  };

  useEffect(() => {
    headerRefsByChunk.current.forEach((tbodies) => {
      tbodies.forEach((tbody) => {
        if (!tbody) return;
        tbody.classList.remove("animate");
      });
    });
    // Guard for SSR / old browsers
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      // Fallback: immediately animate all headers & cells
      headerRefsByChunk.current.forEach((tbodies) => {
        tbodies.forEach((tbody) => {
          if (!tbody) return;
          tbody.classList.add("animate");
        });
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const chunkIndexAttr = entry.target?.dataset?.chunkIndex;
          if (chunkIndexAttr == null) return;
          const chunkIndex = Number(chunkIndexAttr);

          // All tbodies for this chunk
          const tbodiesForChunk = headerRefsByChunk.current[chunkIndex] ?? [];

          if (entry.isIntersecting) {
            // Entering view: animate the chunk's tbodies + their cells
            tbodiesForChunk.forEach((tbody) => {
              if (!tbody) return;

              // Add block-level animate (optional styling on the whole <tbody>)
              tbody.classList.add("animate"); // ★
            });
          } 
          // else {
          //   // Leaving view: remove animation classes and inline delay
          //   tbodiesForChunk.forEach((tbody) => {
          //     if (!tbody) return;
          //     tbody.classList.remove("animate");
          //   });
          // }
        });
      },
      {
        root: null,      // viewport
        rootMargin: "0px",
        threshold: 0.25, // adjust trigger sensitivity
      }
    );

    // Observe every container we have
    containerRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [year, quarter, quarterVal, propertyType, marketName, marketData]);

  // IMPORTANT: reset refs so React callback refs re-populate each render
  containerRefs.current = [];
  headerRefsByChunk.current = [];


  
  return (
    <>
      {submarketChunks.map((chunk, chunkIndex) => {
        // Ensure we have an inner array for this chunk’s headers
        headerRefsByChunk.current[chunkIndex] = headerRefsByChunk.current[chunkIndex] || [];

        return (
          <section
            key={`chunk-${chunkIndex}`}
            ref={(el) => (containerRefs.current[chunkIndex] = el)}
            data-chunk-index={chunkIndex}
            className="market-stats-container"
			      style={{position:"relative", height: "8.5in", width: "11in", marginInline:'auto', marginBottom:"5px", marginTop:"5px", backgroundColor:"white"}}
          >
            <div className="CoverTopText" style={{position:"absolute", left:"0.2in", top:"0.33in", backgroundColor:"white", height:".43in", width:"9in", zIndex:"3", color:"white", alignContent:"center", fontWeight:"300"}}>
              <span style={{color:"#000759", fontFamily:"Merriweather", fontSize:"28px"}}>{`${marketName} | Q${quarterVal} ${year} | ${propertyType} | Market Statistics`}</span>
            </div>
            <div className="QuarterDatePropertyTypeContainer" style={{display:"flex", flexDirection:"row", position:"absolute", left:"8.75in", top:"0.34in", height:".43in", width:"2.5in", zIndex:"3", color:"#4D92FF", alignContent:"center"}}>
            <div style={{display:"flex", flexDirection:"row", height:"100%", alignContent:"center"}}>
              <div style={{width:"100%", fontSize:"25px", fontWeight:"lighter", marginRight:"10px", display:"flex", flexDirection:"row"}}>
              <img src={quarter} alt="" style={{width:"50%", height:"20px", objectFit:"contain", marginTop:"auto", marginBottom:"auto", marginRight:"5px", paddingBottom:"2px"}}></img>
              <span style={{width:"50%", fontSize:"25px", fontWeight:"lighter", marginRight:"10px"}}>{year}</span>
              </div>
            </div>
            <div style={{width:"2px", height:"70%", paddingTop:"5px", backgroundColor:"#4D92FF"}}></div>
            <div style={{width:"49.5%", height:"100%", marginLeft:"10px", fontSize:"15px", marginTop:"7px", fontWeight:"bold"}}>{propertyType}</div>
            </div>
            {/* <button className="tableDownloadButton" onClick={() => {handleExportData()}}>Download Report Data</button> */}
            <div className="historicComparisonContainer"  style={{position:"absolute", left:".25in", top:"1in", height: "6.5in", width: "10.5in", backgroundColor:"white"}}>
              <table style={{width:"100%", borderCollapse:"collapse"}}>
                <thead style={{color:"#000759", borderBottom:"1px, solid #000759"}}>
                <tr className="HeaderRow">
                  <th style={{fontSize:"12px", width:"9%", textAlign:"left"}}>SUBMARKET/<br/>CLASS</th>
                  <th className="headerText">TOTAL<br/>INVENTORY SF</th>
                  <th className="headerText">DIRECT<br/>AVAILABILITY<br/>RATE</th>
                  <th className="headerText">SUBLEASE<br/>AVAILABILITY<br/>RATE</th>
                  <th className="headerText">TOTAL<br/>AVAILABILITY<br/>RATE</th>
                  <th className="headerText">VACANCY RATE</th>
                  <th className="headerText">VACANCY<br/>RATE<br/>PREVIOUS</th>
                  <th className="headerText">NET<br/>ABSORPTION<br/>CURRENT</th>
                  <th className="headerText">NET<br/>ABSORPTION<br/>YTD</th>
                  <th className="headerText">UNDER<br/>CONSTRUCTION</th>
                  <th className="headerText">DELIVERIES<br/>YTD</th>
                  <th className="headerText">AVG DIRECT<br/>ASKING RATE<br/>(FSG)</th>
                </tr>
                </thead>
                {chunk.map((submarket, submarketIndex) => (
                  <React.Fragment key={`${submarket}-${submarketIndex}`}>
                    <tbody 
                        className="subMarketRow"
                        ref={(el) => {
                          // double guard inside the callback in case of React detaching refs
                          if (!headerRefsByChunk.current[chunkIndex]) {
                            headerRefsByChunk.current[chunkIndex] = [];
                          }
                          headerRefsByChunk.current[chunkIndex][submarketIndex] = el;
                        }}
                    >
                      <tr style={{textAlign:"left", paddingLeft:"10px", paddingBottom:"3px", backgroundColor:"#000759", color:"white", fontSize:"14px"}}>
                        <th
                        colSpan={12}
                        style={{textAlign:"left", paddingLeft:"10px", paddingBottom:"3px", backgroundColor:"#000759", color:"white", fontSize:"14px"}}
                        >
                        {submarket}
                        </th>
                      </tr>
                      {Array.isArray(marketData[submarket]) ? marketData[submarket].map((feature, index) => (
                        <tr className="statRow" key={`${chunkIndex}${submarketIndex}${index}`}>
                        {feature.class !== "Total" && (
                        <>
                          {propertyType === "Office" &&(
                          <td id="class" style={{textAlign:"left", fontSize:"13px", padding:"2px", color:"#1C54F4"}}><strong>{feature.class}</strong></td>
                          )}
                          {propertyType === "Industrial" &&(
                          <td id="class" style={{textAlign:"left", fontSize:"12px", padding:"5px", color:"#1C54F4"}}><strong>{feature.industrialsubtype}</strong></td>
                          )}
                          <td id="SumInventory" className="marketDataTableText">{negativeToParentheses(feature.sum_of_inventory)}</td>
                          {propertyType === "Office" &&(
                          <td id="DirectAvailRate" className="marketDataTableText">{`${formatter.format((feature.sum_of_directavailablespace / feature.sum_of_inventory) * 100)}%`}</td>
                          )}
                          {(propertyType === "Industrial") &&(
                          <td id="DirectAvailRate" className="marketDataTableText">{`${formatter.format((feature.sum_of_directvacantspace / feature.sum_of_inventory) * 100)}%`}</td>
                          )}
                          <td id="SubleaseAvailRate" className="marketDataTableText">{`${formatter.format((feature.sum_of_subletvacantspace / feature.sum_of_inventory) * 100)}%`}</td>
                          {propertyType === "Office" &&(
                          <td id="TotalAvailRate" className="marketDataTableText">{`${formatter.format((feature.sum_of_directavailablespace / feature.sum_of_inventory) * 100)}%`}</td>
                          )}
                          {propertyType === "Industrial" &&(
                          <td id="TotalAvailRate" className="marketDataTableText">{`${formatter.format((feature.sum_of_directvacantspace / feature.sum_of_inventory) * 100)}%`}</td>
                          )}
                          <td id="VacancyRate" className="marketDataTableText">{`${formatter.format((feature.sum_of_totalvacantspace / feature.sum_of_inventory) * 100)}%`}</td>
                          <td id="VacancyRatePrev" className="marketDataTableText">{`${formatter.format((feature.sum_of_totalvacantspaceprevquarter / feature.sum_of_inventoryprevquarter) * 100)}%`}</td>
                          <td id="AbsorptionCurrent" className="marketDataTableText">{negativeToParentheses(feature.sum_of_absorption)}</td>
                          <td id="AbsorptionYTD" className="marketDataTableText">{negativeToParentheses(feature.sum_of_absorptionytd)}</td>
                          <td id="UnderConstruction" className="marketDataTableText">{negativeToParentheses(feature.sum_of_underconstruction)}</td>
                          <td id="Deliveries YTD" className="marketDataTableText">{negativeToParentheses(feature.sum_of_newsupply)}</td>
                          <td id="DirectAskingRate" className="marketDataTableText">{'$'}<>{negativeToParentheses(feature.weightedaveragerent)}</></td>
                        </>
                        )}
                        {feature.class === "Total" && (
                        <>
                          <td id="class" style={{textAlign:"left", fontSize:"13px", padding:"2px", color:"#353E59", fontWeight:"bold"}}><strong>{feature.class}</strong></td>
                          <td id="SumInventory" className="marketDataTableTotal">{negativeToParentheses(feature.sum_of_inventory)}</td>
                          {propertyType === "Office" &&(
                          <td id="DirectAvailRate" className="marketDataTableTotal">{`${formatter.format((feature.sum_of_directavailablespace / feature.sum_of_inventory) * 100)}%`}</td>                          
                          )}
                          {propertyType === "Industrial" &&(
                          <td id="DirectAvailRate" className="marketDataTableTotal">{`${formatter.format((feature.sum_of_directvacantspace / feature.sum_of_inventory) * 100)}%`}</td>
                          )}
                          <td id="SubleaseAvailRate" className="marketDataTableTotal">{`${formatter.format((feature.sum_of_subletvacantspace / feature.sum_of_inventory) * 100)}%`}</td>
                          {propertyType === "Office" &&(
                          <td id="TotalAvailRate" className="marketDataTableTotal">{`${formatter.format((feature.sum_of_directavailablespace / feature.sum_of_inventory) * 100)}%`}</td>
                          )}
                          {propertyType === "Industrial" &&(
                          <td id="TotalAvailRate" className="marketDataTableTotal">{`${formatter.format((feature.sum_of_directvacantspace / feature.sum_of_inventory) * 100)}%`}</td>
                          )}                          
                          <td id="VacancyRate" className="marketDataTableTotal">{`${formatter.format((feature.sum_of_totalvacantspace / feature.sum_of_inventory) * 100)}%`}</td>
                          <td id="VacancyRatePrev" className="marketDataTableTotal">{`${formatter.format((feature.sum_of_totalvacantspaceprevquarter / feature.sum_of_inventoryprevquarter) * 100)}%`}</td>
                          <td id="AbsorptionCurrent" className="marketDataTableTotal">{negativeToParentheses(feature.sum_of_absorption)}</td>
                          <td id="AbsorptionYTD" className="marketDataTableTotal">{negativeToParentheses(feature.sum_of_absorptionytd)}</td>
                          <td id="UnderConstruction" className="marketDataTableTotal">{negativeToParentheses(feature.sum_of_underconstruction)}</td>
                          <td id="Deliveries YTD" className="marketDataTableTotal">{negativeToParentheses(feature.sum_of_newsupply)}</td>
                          <td id="DirectAskingRate" className="marketDataTableTotal">{'$'}<>{negativeToParentheses(feature.weightedaveragerent)}</></td>
                        </>
                        )}
                        </tr>
                      )) : null }
                    </tbody>
                  </React.Fragment>
                ))}
              </table>
            </div>
          </section>
        );
      })}
    </>
  );
};

MarketStatisticsTable.propTypes = {
  year: PropTypes.string.isRequired,
  quarter: PropTypes.string.isRequired,
  quarterVal: PropTypes.string.isRequired,
  propertyType: PropTypes.string.isRequired,
  marketName: PropTypes.string.isRequired,
  marketData: PropTypes.object.isRequired,
};

export default MarketStatisticsTable;
