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
import Query from "@arcgis/core/rest/support/Query.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

// import { AggregateChartData } from "../../helpers/DataFormatting.js"
import { AggregateChartData, AggregateReportData, FormatMarketStatisticsData } from "../../helpers/DataFormatting";

import CoverPageSummary from "../ReportTemplates/CoverPageSummary";
import MarketSummaryPage from "../ReportTemplates/MarketSummaryPage";
import MarketStatisticsTable from "../ReportTemplates/MarketStatisticsTable";
import BackCoverPage from "../ReportTemplates/BackCoverPage";

import backgroundImage from "../../images/CitySkyView.png"
import Q1 from "../../images/QuarterGraphics/Q1.png"
import Q2 from "../../images/QuarterGraphics/Q2.png"
import Q3 from "../../images/QuarterGraphics/Q3.png"
import Q4 from "../../images/QuarterGraphics/Q4.png"



function ReportConfig() {
  const { reportTable, market, metroArea, marketId, quarter, year, submarkets, marketType, SubmarketLayer, officeLayer,
    //  reportConfig, chartData, tableData, 
     dispatcherSiteSelection } = useSiteSelection();
  const [isDisabled, setIsDisabled] = useState(true);
  const [metroIsDisabled, setMetroIsDisabled] = useState(false);
  const [marketIsDisabled, setMarketIsDisabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true)
  const [reportConfig, setReportConfig] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [marketStatsTableData, setMarketStatsTableData] = useState(null)


  const [markets, setMarkets] = useState([]);
  const [subMarketsList, setSubMarketsList] = useState([]);
  const [years, setYears] = useState([]);
  const [metroAreas, setMetroAreas] = useState([]);
  const [quarters, setQuarters] = useState([]);
  const [officeData, setOfficeData] = useState(null);
  const [quarterImage, setQuarterImage] = useState(null)

  const [searchParams, setSearchParams] = useSearchParams();
  
  useEffect(() => {
    if (searchParams.get("marketType")) {
      dispatcherSiteSelection({
        type: "SET_MARKET_TYPE",
        payload: searchParams.get("marketType"),
      });
    }
    
    if (searchParams.get("market")) {      
      dispatcherSiteSelection({
        type: "SET_MARKET",
        payload: [searchParams.get("market")],
      });
      if (Object.entries(markets).length > 0) {
      dispatcherSiteSelection({
        type: "SET_MARKET_ID",
        payload: [markets[searchParams.get("market")].id],
      });
    }
    }
    if (searchParams.get("quarter")) {
      dispatcherSiteSelection({
        type: "SET_QUARTER",
        payload: searchParams.get("quarter"),
      });
      DefineQuarterImage(searchParams.get("quarter"))
    }
    if (searchParams.get("year")) {
      dispatcherSiteSelection({
        type: "SET_YEAR",
        payload: searchParams.get("year"),
      });
    }
  }, [markets, years, quarters]);
  
  useEffect(() => {
    console.log(market, marketId, quarter, year)
    GenerateReportData()
  }, [marketId]);


  async function getSubmarkets(market) {
    dispatcherSiteSelection({
      type: "SET_SUBMARKETS",
      payload: [],
    });
    const query = new Query();
    let queryWhere
    // console.log(market)
    if (market) {
      if (market.length > 1) {
        queryWhere = `marketid in (${market})`
      } else if (market.length === 1) {
        queryWhere = `marketid = '${market[0]}'`
      }
    }
    // console.log(queryWhere)
    query.where = queryWhere
    query.outFields = ['submarket'];
    query.returnGeometry = false;
    query.returnDistinctValues = true;

    const results = await reportTable.queryFeatures(query);
    const values = [];

    results?.features.forEach((feature) => {
      const value = feature?.attributes.submarket;
      if (value != null && !values.includes(value)) {
        values.push(value);
      }
    });
    setSubMarketsList(values)
  }
  
  useEffect(() => {
    if ((year !== null  && quarter !== null)  && (market !== null || metroArea !== null) ) {
      setIsDisabled(false)
    }
  }, [year, market, quarter, metroArea]);

  async function getMarkets(metroArea) {
    // console.log("getting Markets")
    const query = new Query();
    let queryWhere = `type = '${marketType}'`;
    if (metroArea !== null) {
      // console.log("setting Metro Area")
      queryWhere = queryWhere + ` AND metroarea = '${metroArea}'`
    }
    // console.log(queryWhere)
    query.where = queryWhere
    query.returnGeometry = false;
    query.returnDistinctValues = true;
    const marketList = []
    query.outFields = ["market", "marketid", "colliersofficeid"];
    const results = await SubmarketLayer.queryFeatures(query);
    const values = {};
    results?.features.forEach((feature) => {
      if (feature?.attributes.market != null && !marketList.includes(feature?.attributes.market)) {
        marketList.push(feature?.attributes.market)
        values[feature.attributes.market] = {id: feature.attributes.marketid, officeID: feature.attributes.colliersofficeid}
      }
    });
    console.log(values)
    setMarkets(values)
  }
  
  useEffect(() => {
    if (reportTable) {
      getMarkets(null)
      const fieldList = ["year_", "quarter", "metroarea"];
      fieldList.map(async (field) => {
        const query = new Query();
        query.where = "1=1";
        query.returnGeometry = false;
        query.returnDistinctValues = true;
        const values = [];
        query.outFields = [field];
        const results = await reportTable.queryFeatures(query);
        results?.features.forEach((feature) => {
          const value = feature?.attributes[field];
          if (value != null && !values.includes(value)) {
            values.push(value);
          }
        });

        if (field === "metroarea") {
          setMetroAreas(values)
        } else if (field === "year_") {
          setYears(values)
        } else if (field === "quarter") {
          setQuarters(values)
        }
      })
    }
  }, [reportTable]);

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

  async function writeReportTableQuery() {
    const query = new Query();
    query.outFields = ["*"];
    query.returnGeometry = false;
    let queryWhere = `year_ = '${year}' AND quarter = '${quarter}'`
    if (metroArea) {
      queryWhere = queryWhere + ` AND metroarea = '${metroArea}'`
    }
    if (marketId) {
      queryWhere = queryWhere + ` AND marketid in (${marketId})`
    }
    if (submarkets.length > 0) {
      const quotedAndCommaSeparated = submarkets.map(item => `'${item}'`).join(', ')
      queryWhere = queryWhere + ` AND submarket in (${quotedAndCommaSeparated})`;
    }
    console.log("Report Table QueryWhere", queryWhere)
    query.where = queryWhere
    const results = await reportTable.queryFeatures(query);
    // console.log(query.where)
    if (results.features) {
      console.log("report Table Data", results.features)
      setIsExpanded(false)
      const marketStatsData = await FormatMarketStatisticsData(results.features)
      setMarketStatsTableData(marketStatsData)
      // dispatcherSiteSelection({
      //   type: "SET_TABLE_DATA",
      //   payload: marketStatsData
      // })
      const AggReportData = await AggregateReportData(results.features)
      setReportConfig(AggReportData)
      
      // dispatcherSiteSelection({
      //   type: "SET_REPORT_CONFIG",
      //   payload: AggReportData,
      // });
    }
  }

  async function writeOfficeTableQuery() {
    if (market) {
      const marketList = []
      market.forEach((marketName) => {
        marketList.push(markets[marketName].officeID)
      })
      const officeQuery = new Query();
        officeQuery.objectIds = [marketList]
        officeQuery.outFields = ["*"];
        officeQuery.returnGeometry = false;
      const officeResults = await officeLayer.queryFeatures(officeQuery);
      if (officeResults.features) {
        setOfficeData(officeResults.features)
        console.log("Office Data",officeResults.features)
      }
    }
  }

  async function writeChartQuery() {
    const chartQuery = new Query();
    chartQuery.outFields = ["*"];
    chartQuery.returnGeometry = false;
    let queryWhere = `year_ >= '${year -2}' AND year_ <= '${year}'`
    if (metroArea) {
      queryWhere = queryWhere + ` AND metroarea = '${metroArea}'`
    }
    if (marketId) {
        queryWhere = queryWhere + ` AND marketid in (${marketId})`
    }
    if (submarkets.length > 0) {
      const quotedAndCommaSeparated = submarkets.map(item => `'${item}'`).join(', ')
      queryWhere = queryWhere + ` AND submarket in (${quotedAndCommaSeparated})`;
    }
    console.log("Chart QueryWhere", queryWhere)
    chartQuery.where = queryWhere
    const chartResults = await reportTable.queryFeatures(chartQuery);
    console.log("chartResults", chartResults)
    const chartConfig = await AggregateChartData(chartResults.features)
    // console.log("chartData", chartData)
    setChartData(chartConfig)
    
    // dispatcherSiteSelection({
    //   type: "SET_CHART_DATA",
    //   payload: chartConfig,
    // });
    }


  async function GenerateReportData() {
    writeChartQuery()
    writeReportTableQuery()
    writeOfficeTableQuery()
  }


  return (
    <>    
        <CalcitePopover
          label={"Report Config"}
          id="report-config-panel"
          flipDisabled
          referenceElement={"ConfigureReportButton"}
          overlayPositioning="fixed"
          scale="l"
          open={isExpanded}
          onClick={() => {setIsExpanded(true)}}
        >
          <CalciteBlock heading="Configure Reports to View" iconStart="table" expanded="true">
              <CalciteList>
                <CalciteListItem>
                  <CalciteLabel slot="content"  layout="block"> Select Property Type
                    <CalciteCombobox placeholder="Select Property Type" 
                      selectionMode="single"
                      overlayPositioning="fixed"
                      value={marketType}
                      onCalciteComboboxChange={(e) => {
                        dispatcherSiteSelection({
                          type: "SET_MARKET_TYPE",
                          payload: e.target.value,
                        });
                      }}
                      >
                      <CalciteComboboxItem key={"Office"} value={"Office"} heading={"Office"} />
                      <CalciteComboboxItem key={"Industrial"} value={"Industrial"} heading={"Industrial"} />
                    </CalciteCombobox>
                  </CalciteLabel>
                </CalciteListItem>
                {Object.entries(markets).length >0 && years.length > 0 && quarters.length > 0 && (
                  <>
                    {marketType !== null && (
                      <>
                        <CalciteListItem>
                          <div slot="content" style={{display:"flex", flexDirection:"row", gap:"10px"}}>
                            <div>
                              <CalciteLabel slot="content"  layout="block"> Select Metro Area
                                <CalciteCombobox placeholder="Select Metro Area" 
                                  selectionMode="single"
                                  overlayPositioning="fixed"
                                  value={metroArea}
                                  disabled = {metroIsDisabled}
                                  onCalciteComboboxChange={(e) => {
                                    if (e.target.value) {
                                      setMarketIsDisabled(true)
                                      dispatcherSiteSelection({
                                        type: "SET_METRO_AREA",
                                        payload: e.target.value,
                                      });
                                      getMarkets(e.target.value)
                                    } else {
                                      setMarketIsDisabled(false)
                                      dispatcherSiteSelection({
                                        type: "SET_METRO_AREA",
                                        payload: null,
                                      });
                                    }
                                    getMarkets(null)
                                  }}
                                >
                                  {metroAreas.map((metro) => (
                                    <CalciteComboboxItem key={metro} value={metro} heading={metro} />
                                  ))}
                                </CalciteCombobox>
                              </CalciteLabel>
                            </div>
                            <div style={{alignContent:"center"}}>OR</div>
                            <div>
                              <CalciteLabel slot="content"  layout="block"> Select Market
                                <CalciteCombobox placeholder="Select Market" 
                                  selectionMode="single"
                                  overlayPositioning="fixed"
                                  value={market}
                                  disabled = {marketIsDisabled}
                                  onCalciteComboboxChange={(e) => {
                                    if (e.target.value) {
                                      // setSearchParams(`marketID=${markets[e.target.value].id}`)
                                      setMetroIsDisabled(true)
                                      dispatcherSiteSelection({
                                        type: "SET_MARKET",
                                        payload: [e.target.value],
                                      });
                                      dispatcherSiteSelection({
                                        type: "SET_MARKET_ID",
                                        payload:[markets[e.target.value].id],
                                      });
                                      getSubmarkets([markets[e.target.value].id])
                                    } else {
                                      setMetroIsDisabled(false)
                                      dispatcherSiteSelection({
                                        type: "SET_MARKET",
                                        payload: null,
                                      });
                                      dispatcherSiteSelection({
                                        type: "SET_MARKET_ID",
                                        payload: null,
                                      });
                                    }                                    
                                  }}
                                >
                                  {Object.entries(markets).map(([market, id]) => (
                                    <CalciteComboboxItem key={market} value={market} heading={market} />
                                  ))}
                                </CalciteCombobox>
                              </CalciteLabel>
                            </div>
                          </div>
                        </CalciteListItem>
                        {metroArea && (
                          <CalciteListItem>
                            <CalciteLabel slot="content"  layout="block"> (Optional) Select Markets
                                <CalciteCombobox placeholder="(Optional) Select Markets" 
                                  selectionMode="multiple"
                                  overlayPositioning="fixed"
                                  value={market}
                                  selectionDisplay="single"
                                  onCalciteComboboxChange={(e) => {
                                    if (e.target.value) {
                                      console.log(e.target.value)
                                      if (Array.isArray(e.target.value)) {
                                        dispatcherSiteSelection({
                                          type: "SET_MARKET",
                                          payload: e.target.value,
                                        });
                                        const marketIDList = []
                                        e.target.value.forEach((selected) => {
                                          // console.log(selected)
                                          // console.log(markets)
                                          // console.log(markets[selected].id)
                                          marketIDList.push(markets[selected].id)
                                        })
                                        dispatcherSiteSelection({
                                          type: "SET_MARKET_ID",
                                          payload:marketIDList,
                                        });
                                        getSubmarkets(marketIDList)
                                      } else {
                                        dispatcherSiteSelection({
                                          type: "SET_MARKET",
                                          payload: [e.target.value],
                                        });
                                        dispatcherSiteSelection({
                                          type: "SET_MARKET_ID",
                                          payload:[markets[e.target.value].id],
                                        });
                                        getSubmarkets([markets[e.target.value].id])
                                      }
                                    } else {
                                      dispatcherSiteSelection({
                                        type: "SET_MARKET",
                                        payload: null,
                                      });
                                      dispatcherSiteSelection({
                                        type: "SET_MARKET_ID",
                                        payload: null,
                                      });
                                    }                                    
                                  }}
                                >
                                  {Object.entries(markets).map(([market, id]) => (
                                    <CalciteComboboxItem key={market} value={market} heading={market} />
                                  ))}
                              </CalciteCombobox>
                            </CalciteLabel>
                          </CalciteListItem>
                        )}
                        <CalciteListItem>
                          <CalciteLabel slot="content"  layout="block"> Select Year
                            <CalciteCombobox placeholder="Select Year" 
                              selectionMode="single"
                              overlayPositioning="fixed"
                              value={year}
                              onCalciteComboboxChange={(e) => {
                                dispatcherSiteSelection({
                                  type: "SET_YEAR",
                                  payload: e.target.value,
                                });
                              }}
                            >
                              {years.map((year) => (
                                <CalciteComboboxItem key={year} value={year} heading={year} />
                              ))}
                            </CalciteCombobox>
                          </CalciteLabel>
                        </CalciteListItem>
                        <CalciteListItem>
                          <CalciteLabel slot="content" layout="block"> Select Quarter
                            <CalciteCombobox placeholder="Select Quarter" 
                              selectionMode="single"
                              overlayPositioning="fixed"
                              value={quarter}
                              onCalciteComboboxChange={(e) => {
                                dispatcherSiteSelection({
                                  type: "SET_QUARTER",
                                  payload: e.target.value,
                                });
                                DefineQuarterImage(e.target.value)
                              }}
                            >
                              {quarters.map((quarter) => (
                                <CalciteComboboxItem key={quarter} value={quarter} heading={quarter} />
                              ))}
                            </CalciteCombobox>
                          </CalciteLabel>
                        </CalciteListItem>
                        {subMarketsList.length > 0 && (
                          <CalciteListItem>
                            <CalciteLabel slot="content" layout="block">Select Submarkets - (Optional)
                              <CalciteCombobox placeholder="Select Submarkets" 
                                selectionMode="multiple"
                                selectionDisplay="fit"
                                selectAllEnabled
                                value={submarkets}
                                overlayPositioning="fixed"
                                onCalciteComboboxChange={(e) => {
                                  dispatcherSiteSelection({
                                    type: "SET_SUBMARKETS",
                                    payload: e.target.value,
                                  });
                                }}
                              >
                                {subMarketsList.map((submarket) => (
                                  <CalciteComboboxItem key={submarket} value={submarket} heading={submarket} />
                                ))}
                              </CalciteCombobox>
                            </CalciteLabel>
                          </CalciteListItem>
                        )}
                      </>
                    )}
                  </>
                )}
              </CalciteList>
            <CalciteButton width="full" style={{marginInline:"auto"}} disabled={isDisabled}
              onClick={() => {GenerateReportData()}}
            >
              Generate Report
            </CalciteButton>
          </CalciteBlock>
        </CalcitePopover>
      <CalcitePanel>
          <div>
            <CoverPageSummary 
              image={backgroundImage}
              year={year !== null ? year : "year"}
              quarter={quarterImage !== null ? quarterImage : Q1}
              propertyType={marketType !== null ? marketType : "Market Type"}
              marketName={metroArea !== null ? metroArea : market}
              summary="Summary"
            />
          </div>
        {ReportConfig && chartData && marketStatsTableData &&(
          <>
          <div>
            <MarketSummaryPage 
              year={year}
              quarter={quarterImage}
              quarterVal ={quarter}
              propertyType={marketType}
              marketName={metroArea !== null ? metroArea : market}
              marketData={reportConfig}
              chartData={chartData}
            />
          </div>
          <div>
            <MarketStatisticsTable 
              year={year}
              quarter={quarterImage}
              quarterVal ={quarter}
              propertyType={marketType}
              marketName={metroArea !== null ? metroArea : market}
              marketData={marketStatsTableData}
            />
          </div>
          <div>
            <BackCoverPage 
              year={year}
              quarter={quarterImage}
              quarterVal ={quarter}
              propertyType={marketType}
              marketName={metroArea !== null ? metroArea : market}
              OfficeData={officeData}
            />
          </div>
          </>
        )}
      </CalcitePanel>
    </>
  );
};

export default ReportConfig;
