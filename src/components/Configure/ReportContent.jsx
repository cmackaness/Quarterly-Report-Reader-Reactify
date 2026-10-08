import { React, useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  CalcitePanel,
  CalciteBlock,
  CalciteLabel,
  CalciteCombobox,
  CalciteComboboxItem,
  CalciteList,
  CalciteListItem,
  CalciteButton,
  CalciteAction,
  CalciteShellPanel,
  CalciteActionBar,
  CalciteActionGroup,
  CalcitePopover,
 } from "@esri/calcite-components-react";
import { useSiteSelection } from "../../contexts/SiteSelectionContext";

import CoverPageSummary from "../ReportTemplates/CoverPageSummary";
import MarketSummaryPage from "../ReportTemplates/MarketSummaryPage";
import MarketStatisticsTable from "../ReportTemplates/MarketStatisticsTable";
import BackCoverPage from "../ReportTemplates/BackCoverPage";
import MarketSubtypePages from "../ReportTemplates/MarketTypeSubgroupPages";

import backgroundImage from "../../images/CitySkyView.png"
import Q1 from "../../images/QuarterGraphics/Q1.png"
import Q2 from "../../images/QuarterGraphics/Q2.png"
import Q3 from "../../images/QuarterGraphics/Q3.png"
import Q4 from "../../images/QuarterGraphics/Q4.png"



function ReportContent() {
  const { market, metroArea, quarter, year, marketType, reportConfig, chartData, tableData, officeData, subTypeData, subTypeChartData, imageURL, 
    marketSummaryVisible, marketSubtypeSummaryVisible, marketStatsTableVisible, backCoverPageVisible, submarkets, dispatcherSiteSelection } = useSiteSelection();

  const [quarterImage, setQuarterImage] = useState(null)

  useEffect(() => {
    if (quarter) {
      DefineQuarterImage(quarter)
    }
  }, [quarter]);

  async function DefineQuarterImage(quarter) {
    if (quarter.includes(1)) {
      setQuarterImage(Q1)
    } else if (quarter.includes(2)) {
      setQuarterImage(Q2)
    } else if (quarter.includes(3)) {
      setQuarterImage(Q3)
    } else if (quarter.includes(4)) {
      setQuarterImage(Q4)
    }
  }


  return (
      <CalcitePanel>
          <div>
            <CoverPageSummary 
              image={imageURL !== null ? imageURL : backgroundImage}
              year={year !== null ? year : "year"}
              quarter={quarterImage !== null ? quarterImage : Q1}
              propertyType={marketType !== null ? marketType : "Property Type"}
              marketName={metroArea !== null ? metroArea : market}
              summary="Summary"
            />
          </div>
        {(reportConfig && chartData && tableData) &&(
          <>
          <div>
            {marketSummaryVisible && (
              <MarketSummaryPage 
                year={year}
                quarter={quarterImage}
                quarterVal ={quarter}
                propertyType={marketType}
                marketName={metroArea !== null ? metroArea : market}
                submarkets={submarkets}
                marketData={reportConfig}
                chartData={chartData}
                tableData={tableData}
              />
            )}
          </div>
          <div>
            {marketSubtypeSummaryVisible && (
              <>
                {subTypeData && Object.entries(subTypeData).map(([subtype, value]) =>(
                  <MarketSubtypePages 
                    key={subtype}
                    image={imageURL !== null ? imageURL : backgroundImage}
                    year={year}
                    quarter={quarterImage}
                    quarterVal ={quarter}
                    propertyType={marketType}
                    marketName={metroArea !== null ? metroArea : market}
                    submarkets={submarkets}
                    subtype={subtype}
                    marketData={value}
                    chartData={subTypeChartData}
                  />
                ))}
              </>
            )}
          </div>
          <div>
            {marketStatsTableVisible && (
              <MarketStatisticsTable 
                year={year}
                quarter={quarterImage}
                quarterVal ={quarter}
                propertyType={marketType}
                marketName={metroArea !== null ? metroArea : market}
                marketData={tableData}
              />
            )}
          </div>          
          <div>
            {backCoverPageVisible && (
              <BackCoverPage 
                year={year}
                quarter={quarterImage}
                quarterVal ={quarter}
                propertyType={marketType}
                marketName={metroArea !== null ? metroArea : market}
                OfficeData={officeData}
              />
            )}
          </div>
          </>
        )}
      </CalcitePanel>
  );
};

export default ReportContent;
