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
  CalcitePopover,
  CalciteAlert, 
 } from "@esri/calcite-components-react";
import { useSiteSelection } from "../../contexts/SiteSelectionContext";
import Query from "@arcgis/core/rest/support/Query.js";
import AttachmentQuery from "@arcgis/core/rest/support/AttachmentQuery.js";

// import { AggregateChartData } from "../../helpers/DataFormatting.js"
import { writeReportTableQuery, writeChartQuery } from "../../helpers/DataFormatting";


import backgroundImage from "../../images/CitySkyView.png"
import Q1 from "../../images/QuarterGraphics/Q1.png"
import Q2 from "../../images/QuarterGraphics/Q2.png"
import Q3 from "../../images/QuarterGraphics/Q3.png"
import Q4 from "../../images/QuarterGraphics/Q4.png"
import { queryAllFeatures } from "@arcgis/charts-components";



function ConfigPopover() {
  const { reportTable, market, metroArea, marketId, quarter, year, submarkets, submarketIds, marketType, SubmarketLayer, officeLayer, subtypes, imageLayer, dispatcherSiteSelection } = useSiteSelection();
  const [isDisabled, setIsDisabled] = useState(true);
  const [metroIsDisabled, setMetroIsDisabled] = useState(false);
  const [marketIsDisabled, setMarketIsDisabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true)
  const [alertVisible, setAlertVisible] = useState(false);
  const [marketTypeSet, setMarketTypeSet] = useState(false);
  const [reportVisibility, setReportVisibility] = useState(null);

  const [markets, setMarkets] = useState({});
  const [subMarketsList, setSubMarketsList] = useState({});
  const [years, setYears] = useState([]);
  const [metroAreas, setMetroAreas] = useState([]);
  const [quarters, setQuarters] = useState([]);
  const [subTypesList, setSubTypesList] = useState([]);
  const [quarterImage, setQuarterImage] = useState(null)

  const [marketLocal, setMarketLocal] = useState(null);
  const [marketIdLocal, setMarketIdLocal] = useState(null);
  const [submarketLocal, setSubmarketLocal] = useState(null);
  const [subMarketIdLocal, setSubmarketIdLocal] = useState(null);
  const [metroAreaLocal, setMetroAreaLocal] = useState(null);
  const [yearLocal, setYearLocal] = useState(null);
  const [quarterLocal, setQuarterLocal] = useState(null);
  const [subtypeLocal, setSubtypeLocal] = useState(null);


  const [searchParams, setSearchParams] = useSearchParams();
  
  useEffect(() => {
    if (searchParams.get("marketType")) {
      dispatcherSiteSelection({
        type: "SET_MARKET_TYPE",
        payload: searchParams.get("marketType"),
      });
    }
  }, []);

  
  useEffect(() => {
    if (Object.entries(markets).length > 0) {
      if (searchParams.get("market") !== null) {  
        // console.log("market Search Param Set")    
        // console.log(searchParams.getAll("market"))
        if (searchParams.getAll("market").length === 1) {
          // dispatcherSiteSelection({
          //   type: "SET_MARKET",
          //   payload: [searchParams.getAll("market")],
          // });
          setMarketLocal([searchParams.getAll("market")])
          // dispatcherSiteSelection({
          //   type: "SET_MARKET_ID",
          //   payload: [markets[searchParams.get("market")].id],
          // });
          setMarketIdLocal([markets[searchParams.get("market")].id])
        } else if (searchParams.getAll("market").length > 1) {
          const marketIDList = []
          // dispatcherSiteSelection({
          //   type: "SET_MARKET",
          //   payload: searchParams.getAll("market"),
          // });
          setMarketLocal(searchParams.getAll("market"))
          searchParams.getAll("market").forEach((market) => {
            marketIDList.push(markets[market].id)
          })
          // dispatcherSiteSelection({
          //   type: "SET_MARKET_ID",
          //   payload:marketIDList,
          // });
          setMarketIdLocal(marketIDList)
        }
      }
      if (searchParams.get("metroArea")) {
        // console.log("metroArea Search Param Set")
        // dispatcherSiteSelection({
        //   type: "SET_METRO_AREA",
        //   payload: searchParams.get("metroArea"),
        // });
        setMetroAreaLocal(searchParams.get("metroArea"))
        getMarkets(searchParams.get("metroArea"))
      }
      if (searchParams.get("submarkets")) {
        // console.log("submarket Search Param Set")
        // dispatcherSiteSelection({
        //   type: "SET_SUBMARKETS",
        //   payload: searchParams.get("submarkets"),
        // });
        setSubmarketLocal(searchParams.get("submarkets"))
      }
      if (searchParams.get("quarter")) {
        // console.log("Quarter Search Param Set")
        // dispatcherSiteSelection({
        //   type: "SET_QUARTER",
        //   payload: searchParams.get("quarter"),
        // });
        setQuarterLocal(searchParams.get("quarter"))
        DefineQuarterImage(searchParams.get("quarter"))
      }
      if (searchParams.get("year")) {
        // console.log("Year Search Param Set")
        // dispatcherSiteSelection({
        //   type: "SET_YEAR",
        //   payload: searchParams.get("year"),
        // });
        setYearLocal(searchParams.get("year"))
      }
      if (searchParams.get("subtype")) {
        // console.log("subtype Search Param Set")
        // dispatcherSiteSelection({
        //   type: "SET_SUBTYPE",
        //   payload: searchParams.get("subtype"),
        // });
        setSubtypeLocal(searchParams.get("subtype"))
      }
    }
  }, [markets]);
  
  useEffect(() => {
    if (((marketLocal, marketIdLocal, searchParams.get("market")) || metroAreaLocal, searchParams.get("metroArea")), quarterLocal, searchParams.get("quarter"), yearLocal, searchParams.get("year")) {
      // console.log(market, marketId, quarter, year)
      GenerateReportData()
    }
  }, [marketIdLocal]);

  async function getSubmarkets(market) {
    setSubMarketsList([])
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
    query.outFields = ['submarket', 'submarket_id'];
    query.returnGeometry = false;
    query.returnDistinctValues = true;

    const results = await reportTable.queryFeatures(query);
    const values = {};
    const submarketList = []
    results?.features.forEach((feature) => {
      const value = feature?.attributes.submarket;
      if (feature.attributes.submarket != null && !submarketList.includes(feature.attributes.submarket)) {
        submarketList.push(value);
        values[feature.attributes.submarket] = feature.attributes.submarket_id
      }
    });
    // console.log("Submarkets", values)
    setSubMarketsList(values)
  }
  
  useEffect(() => {
    if ((yearLocal !== null  && quarterLocal !== null)  && (marketLocal !== null || metroAreaLocal !== null) ) {
      setIsDisabled(false)
    }
  }, [yearLocal, marketLocal, quarterLocal, metroAreaLocal]);
  
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
    // console.log("Market Results", results)
    results?.features.forEach((feature) => {
      if (!marketList.includes(feature?.attributes.market)) {
        marketList.push(feature?.attributes.market)
        values[feature.attributes.market] = {id: feature.attributes.marketid, officeID: feature.attributes.colliersofficeid}
      }
    });
    // console.log("Markets", values)
    setMarkets(values)
  }
  
  useEffect(() => {
    if (reportTable && marketType) {
      setMarketTypeSet(false)
      getMarkets(null)
      const fieldList = ["year_", "quarter", "metroarea"];
      if (marketType === "Office") {fieldList.push("class")}
      if (marketType === "Industrial") {fieldList.push("industrialsubtype")}
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
        } else if (field === "class" || field === "industrialsubtype") {
          setSubTypesList(values)
        }
      })
      // console.log(markets, quarters, years, metroAreas)
      setMarketTypeSet(true)
    }
  }, [reportTable]);

  useEffect(() => {
      if (metroAreaLocal) {
        getMarkets(metroAreaLocal)
      }
  }, [metroAreaLocal]);

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

  async function writeReportConfig() {
    const [subTypeStatsData, marketStatsData, AggReportData] = await writeReportTableQuery(yearLocal, quarterLocal, metroAreaLocal, marketIdLocal, submarketLocal, subtypeLocal, marketType, reportTable)
    if (AggReportData) {
      setIsExpanded(false)
    } else {
      setAlertVisible(true)
    }
    return [subTypeStatsData, marketStatsData, AggReportData]
  }

  
  async function writeOfficeTableQuery() {
    try {
      const marketList = []
      if (marketLocal) {
        marketLocal.forEach((marketName) => {
          marketList.push(markets[marketName].officeID)
        })
        const officeQuery = new Query();
          officeQuery.objectIds = [marketList]
          officeQuery.outFields = ["*"];
          officeQuery.returnGeometry = false;
        const officeResults = await officeLayer.queryFeatures(officeQuery);
        if (officeResults.features) {
          // setOfficeData(officeResults.features)
          return officeResults.features
          // dispatcherSiteSelection({
          //   type: "SET_OFFICE_DATA",
          //   payload: officeResults.features
          // })
          // console.log("Office Data",officeResults.features)
        }
      }
    } catch (e) {
      // const offices = await officeLayer.load()
      // console.log(offices)
      console.log(e)
      return(null)
    }
  }


  async function writeImageQuery() {
    const imageQuery = new AttachmentQuery();
    let queryWhere = ''
    if (metroAreaLocal) {
      queryWhere = queryWhere + `metroarea = '${metroAreaLocal}'`
      if (marketIdLocal) {
          queryWhere = queryWhere + ` AND marketid in (${marketIdLocal})`
      }
    } else if (marketIdLocal) {
        queryWhere = queryWhere + `marketid in (${marketIdLocal})`
    }
    imageQuery.where = queryWhere
    const imageResults = await imageLayer.queryAttachments(imageQuery);
    let imageURL = null
    Object.entries(imageResults).forEach((result) => {
      // console.log(result[1][0].url)
      imageURL = result[1][0].url
      // dispatcherSiteSelection({
      //   type: "SET_IMAGE_URL",
      //   payload: result[1][0].url
      // });
    })
    return imageURL
  }

  async function GenerateReportData() {
      const [chartConfig, subtypeChartConfig] = await writeChartQuery(metroAreaLocal, marketIdLocal, submarketLocal, subtypeLocal, marketType, reportTable, yearLocal)
      const imageURL = await writeImageQuery()
      const [subTypeStatsData, marketStatsData, AggReportData] = await writeReportConfig()
      const officeResults = await writeOfficeTableQuery(metroAreaLocal, marketIdLocal, submarketLocal, subtypeLocal, marketType, reportTable, yearLocal)
      dispatcherSiteSelection({
        type: "SET_MARKET",
        payload: marketLocal
      })
      dispatcherSiteSelection({
        type: "SET_MARKET_ID",
        payload: marketIdLocal
      })      
      dispatcherSiteSelection({
        type: "SET_SUBMARKETS",
        payload: submarketLocal
      })  
      dispatcherSiteSelection({
        type: "SET_SUBMARKET_IDS",
        payload: subMarketIdLocal
      }) 
      dispatcherSiteSelection({
        type: "SET_METRO_AREA",
        payload: metroAreaLocal
      })
      dispatcherSiteSelection({
        type: "SET_YEAR",
        payload: yearLocal
      })
      dispatcherSiteSelection({
        type: "SET_QUARTER",
        payload: quarterLocal
      })
      dispatcherSiteSelection({
        type: "SET_SUBTYPES",
        payload: subtypeLocal
      })
      dispatcherSiteSelection({
        type: "SET_OFFICE_DATA",
        payload: officeResults
      })
      console.log("Report Config", AggReportData)
      dispatcherSiteSelection({
        type: "SET_REPORT_CONFIG",
        payload: AggReportData,
      });
      dispatcherSiteSelection({
        type: "SET_TABLE_DATA",
        payload: marketStatsData
      })
      dispatcherSiteSelection({
        type: "SET_SUBTYPE_DATA",
        payload: subTypeStatsData
      })

      dispatcherSiteSelection({
        type: "SET_SUBTYPE_CHART_DATA",
        payload: subtypeChartConfig
      });
      dispatcherSiteSelection({
        type: "SET_CHART_DATA",
        payload: chartConfig
      });
      dispatcherSiteSelection({
        type: "SET_IMAGE_URL",
        payload: imageURL
      });
  }

  async function ClearReportGlobal() {dispatcherSiteSelection({
        type: "SET_MARKET",
        payload: null
      })
      dispatcherSiteSelection({
        type: "SET_MARKET_ID",
        payload: null
      })      
      dispatcherSiteSelection({
        type: "SET_SUBMARKETS",
        payload: null
      })  
      dispatcherSiteSelection({
        type: "SET_SUBMARKET_IDS",
        payload: null
      }) 
      dispatcherSiteSelection({
        type: "SET_METRO_AREA",
        payload: null
      })
      dispatcherSiteSelection({
        type: "SET_YEAR",
        payload: null
      })
      dispatcherSiteSelection({
        type: "SET_QUARTER",
        payload: null
      })
      dispatcherSiteSelection({
        type: "SET_SUBTYPES",
        payload: null
      })
      dispatcherSiteSelection({
        type: "SET_OFFICE_DATA",
        payload: null
      })
      dispatcherSiteSelection({
        type: "SET_REPORT_CONFIG",
        payload: null,
      });
      dispatcherSiteSelection({
        type: "SET_TABLE_DATA",
        payload: null
      })
      dispatcherSiteSelection({
        type: "SET_SUBTYPE_DATA",
        payload: null
      })

      dispatcherSiteSelection({
        type: "SET_SUBTYPE_CHART_DATA",
        payload: null
      });
      dispatcherSiteSelection({
        type: "SET_CHART_DATA",
        payload: null
      });
      dispatcherSiteSelection({
        type: "SET_IMAGE_URL",
        payload: null
      });
  }


  return (
    <>
      <CalcitePopover
        label={"Report Config"}
        id="report-config-panel"
        autoClose="true"
        flipDisabled
        placement="right"
        referenceElement={"ConfigureReportButton"}
        overlayPositioning="fixed"
        scale="l"
        open={isExpanded}
        onClick={() => {setIsExpanded(true)}}
      >
        {marketType && (
          <CalciteButton style={{position:"absolute", right:"3%", top:"2.5%", width:".75in", zIndex:"2"}}
            onClick={() => {
              console.log("Resetting Report")
              setMarketLocal(null)
              setMarketIdLocal(null)
              setMetroAreaLocal(null)
              setSubmarketLocal(null)
              setSubmarketIdLocal(null)
              setYearLocal(null)
              setQuarterLocal(null)
              setSubtypeLocal(null)
              setMetroIsDisabled(false)
              setMarketIsDisabled(false)
              getMarkets(null)
              setIsDisabled(true)
              ClearReportGlobal()
            }}
          >
            Reset
          </CalciteButton>
        )}
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
                      setMetroIsDisabled(false)
                      setMarketIsDisabled(false)
                      if (marketLocal) {
                        // dispatcherSiteSelection({
                        //   type: "SET_MARKET",
                        //   payload: null,
                        // });
                        setMarketLocal(null)
                        // dispatcherSiteSelection({
                        //   type: "SET_MARKET_ID",
                        //   payload: null,
                        // });
                        setMarketIdLocal(null)
                        // dispatcherSiteSelection({
                        //   type: "SET_SUBMARKETS",
                        //   payload: null,
                        // });
                        setSubmarketLocal(null)
                        // dispatcherSiteSelection({
                        //   type: "SET_SUBMARKET_IDS",
                        //   payload: null,
                        // });
                        setSubmarketIdLocal(null)
                      }
                      if (searchParams) {
                        setSearchParams({})
                      }
                    }}
                    >
                    <CalciteComboboxItem key={"Office"} value={"Office"} heading={"Office"} />
                    <CalciteComboboxItem key={"Industrial"} value={"Industrial"} heading={"Industrial"} />
                  </CalciteCombobox>
                </CalciteLabel>
              </CalciteListItem>
              {/* {Object.entries(markets).length >0 && years.length > 0 && quarters.length > 0 && ( */}
                <>
                  {marketType && (
                    <>
                      <CalciteListItem>
                        <div slot="content" style={{display:"flex", flexDirection:"row", gap:"10px"}}>
                          <div>
                            <CalciteLabel slot="content"  layout="block"> Select Metro Area
                              <CalciteCombobox placeholder="Select Metro Area" 
                                selectionMode="single"
                                overlayPositioning="fixed"
                                value={metroAreaLocal}
                                disabled = {metroIsDisabled}
                                onCalciteComboboxChange={(e) => {
                                  if (e.target.value) {
                                    setMarketIsDisabled(true)
                                    // dispatcherSiteSelection({
                                    //   type: "SET_METRO_AREA",
                                    //   payload: e.target.value,
                                    // });
                                    setMetroAreaLocal(e.target.value)
                                    getMarkets(e.target.value)                                    
                                    // dispatcherSiteSelection({
                                    //   type: "SET_MARKET",
                                    //   payload: null,
                                    // });
                                    setMarketLocal(null)
                                    // dispatcherSiteSelection({
                                    //   type: "SET_MARKET_ID",
                                    //   payload: null,
                                    // });
                                    setMarketIdLocal(null)
                                    // dispatcherSiteSelection({
                                    //   type: "SET_SUBMARKETS",
                                    //   payload: null,
                                    // });
                                    setSubmarketLocal(null)
                                    // dispatcherSiteSelection({
                                    //   type: "SET_SUBMARKET_IDS",
                                    //   payload: null,
                                    // });
                                    setSubmarketIdLocal(null)
                                    setSubMarketsList({})
                                    if (searchParams) {
                                      setSearchParams({})
                                    }
                                  } else {
                                    setMarketIsDisabled(false)
                                    // dispatcherSiteSelection({
                                    //   type: "SET_METRO_AREA",
                                    //   payload: null,
                                    // });
                                    setMetroAreaLocal(null)
                                  }
                                  getMarkets(null)
                                  if (searchParams) {
                                    setSearchParams({})
                                  }
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
                                value={marketLocal}
                                disabled = {marketIsDisabled}
                                onCalciteComboboxChange={(e) => {
                                  if (e.target.value) {
                                    // setSearchParams(`marketID=${markets[e.target.value].id}`)
                                    setMetroIsDisabled(true)
                                    setMarketLocal([e.target.value])
                                    setMarketIdLocal([markets[e.target.value].id])
                                    setSubmarketLocal(null)
                                    setSubmarketIdLocal(null)
                                    setSubMarketsList({})
                                    getSubmarkets([markets[e.target.value].id])
                                    if (searchParams) {
                                      setSearchParams({})
                                    }
                                  } else {
                                    setMarketLocal(null)
                                    setMarketIdLocal(null)
                                    setSubmarketLocal(null)
                                    setSubmarketIdLocal(null)
                                    setSubMarketsList({})
                                    if (searchParams) {
                                      setSearchParams({})
                                    }
                                    setMetroIsDisabled(false)
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
                      <CalciteListItem>
                        <CalciteLabel slot="content"  layout="block"> Select Year
                          <CalciteCombobox placeholder="Select Year" 
                            selectionMode="single"
                            overlayPositioning="fixed"
                            value={yearLocal}
                            onCalciteComboboxChange={(e) => {
                              setYearLocal(e.target.value)
                              if (searchParams) {
                                setSearchParams({})
                              }
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
                            value={quarterLocal}
                            onCalciteComboboxChange={(e) => {
                              setQuarterLocal(e.target.value)
                              DefineQuarterImage(e.target.value)
                              if (searchParams) {
                                setSearchParams({})
                              }
                            }}
                          >
                            <CalciteComboboxItem key={1} value={1} heading={1} />
                            <CalciteComboboxItem key={2} value={2} heading={2} />
                            <CalciteComboboxItem key={3} value={3} heading={3} />
                            <CalciteComboboxItem key={4} value={4} heading={4} />
                          </CalciteCombobox>
                        </CalciteLabel>
                      </CalciteListItem>
                      <CalciteListItem>
                        <CalciteBlock slot="content" heading="Optional Parameters" collapsible>
                          <CalciteList>                              
                            {(metroAreaLocal && Object.entries(markets).length > 1) && (
                              <CalciteListItem>
                                <CalciteLabel slot="content"  layout="block"> (Optional) Select Markets
                                    <CalciteCombobox placeholder="(Optional) Select Markets" 
                                      selectionMode="multiple"
                                      overlayPositioning="fixed"
                                      value={marketLocal}
                                      selectionDisplay="single"
                                      onCalciteComboboxChange={(e) => {
                                        // console.log(e.target.value)
                                        if (e.target.value) {
                                          if (Array.isArray(e.target.value)) {
                                            setMarketLocal(e.target.value)
                                            const marketIDList = []
                                            e.target.value.forEach((selected) => {
                                              // console.log(selected)
                                              // console.log(markets)
                                              // console.log(markets[selected].id)
                                              marketIDList.push(markets[selected].id)
                                            })
                                            setMarketIdLocal(marketIDList)
                                            getSubmarkets(marketIDList)
                                            if (searchParams) {
                                              setSearchParams({})
                                            }
                                          } else {
                                            setMarketLocal([e.target.value])
                                            setMarketIdLocal([markets[e.target.value].id])
                                            getSubmarkets([markets[e.target.value].id])
                                          if (searchParams) {
                                            setSearchParams({})
                                          }
                                            
                                          }
                                        } else {
                                          setMarketLocal(null)
                                          setMarketIdLocal(null)
                                          setSubmarketLocal(null)
                                          setSubmarketIdLocal(null)
                                          setSubMarketsList({})
                                          if (searchParams) {
                                            setSearchParams({})
                                          }
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
                            {Object.keys(subMarketsList).length > 0 && (
                                <CalciteListItem>
                                  <CalciteLabel slot="content" layout="block">Select Submarkets - (Optional)
                                    <CalciteCombobox placeholder="Select Submarkets" 
                                      selectionMode="multiple"
                                      selectionDisplay="fit"
                                      selectAllEnabled
                                      value={submarketLocal}
                                      overlayPositioning="fixed"
                                      onCalciteComboboxChange={(e) => {
                                        // console.log(e.target.value)
                                        if (e.target.value) {
                                          if (Array.isArray(e.target.value)) {
                                            setSubmarketLocal(e.target.value)
                                            const submarketIDList = []
                                            e.target.value.forEach((selected) => {
                                              // console.log('selected',selected)
                                              // console.log('submarkets',subMarketsList)
                                              // console.log('submarkets[selected]',subMarketsList[selected])
                                              submarketIDList.push(subMarketsList[selected])
                                            })
                                            setSubmarketIdLocal(submarketIDList)
                                            if (searchParams) {
                                              setSearchParams({})
                                            }
                                          } else if (e.target.value !== null) {
                                            setSubmarketLocal([e.target.value])
                                            setSubmarketIdLocal([subMarketsList[e.target.value]])
                                            if (searchParams) {
                                              setSearchParams({})
                                            }
                                          } 
                                        } else {
                                          setSubmarketLocal(null)
                                          setSubmarketIdLocal(null)
                                        }
                                      }}
                                    >
                                      {Object.keys(subMarketsList).map((submarket) => (
                                        <CalciteComboboxItem key={submarket} value={submarket} heading={submarket} />
                                      ))}
                                    </CalciteCombobox>
                                  </CalciteLabel>
                                </CalciteListItem>
                            )}
                            <CalciteListItem>
                              <CalciteLabel slot="content"> Select Subtypes 
                                <CalciteCombobox placeholder="Select Subtypes" 
                                  selectionMode="multiple"
                                  selectionDisplay="fit"
                                  selectAllEnabled
                                  value={subtypeLocal}
                                  overlayPositioning="fixed"
                                  onCalciteComboboxChange={(e) => {
                                    if (e.target.value) {
                                      if (Array.isArray(e.target.value)) {
                                        setSubtypeLocal(e.target.value)
                                      } else {
                                        setSubtypeLocal([e.target.value])
                                      }
                                      if (searchParams) {
                                        setSearchParams({})
                                      }
                                    } else {
                                      setSubtypeLocal(null)
                                    }                                    
                                  }}
                                >
                                  {subTypesList.map((subtype) => (
                                    <CalciteComboboxItem key={subtype} value={subtype} heading={subtype} />
                                  ))}
                                </CalciteCombobox>
                              </CalciteLabel>
                            </CalciteListItem>
                          </CalciteList>
                        </CalciteBlock>
                      </CalciteListItem>
                      <CalciteListItem>
                        <CalciteBlock slot="content" heading="Report Pages" collapsible>
                          <CalciteList>
                            <CalciteListItem>
                              <CalciteLabel slot="content"> Select Report Pages To Remove
                                <CalciteCombobox placeholder="Select Report Pages To Remove" 
                                  selectionMode="multiple"
                                  selectionDisplay="fit"
                                  // selectAllEnabled
                                  // value={reportPages}
                                  overlayPositioning="fixed"
                                  onCalciteComboboxChange={(e) => {
                                    if (e.target.value) {
                                      if (Array.isArray(e.target.value)) {
                                        setReportVisibility(e.target.value)
                                      } else {
                                        setReportVisibility([e.target.value])
                                      }
                                    } else {
                                      setReportVisibility(null)
                                    }
                                  }}
                                >
                                  <CalciteComboboxItem key={"MarketSummary"} value={"MARKETSUMMARY"} heading={"Market Summary"} />
                                  <CalciteComboboxItem key={"MarketSubTypeSummary"} value={"MARKETSUBTYPESUMMARY"} heading={"Market SubType Summary"} />
                                  <CalciteComboboxItem key={"MarketStatsTable"} value={"MARKETSTATSTABLE"} heading={"Market Stats Table"} />
                                  <CalciteComboboxItem key={"BackCoverPage"} value={"BACKCOVERPAGE"} heading={"Back Cover Page"} />
                                </CalciteCombobox>
                              </CalciteLabel>
                            </CalciteListItem>
                          </CalciteList>
                        </CalciteBlock>
                      </CalciteListItem>
                    </>
                  )}
                </>
              {/* )} */}
            </CalciteList>
          <CalciteButton width="full" style={{marginInline:"auto"}} disabled={isDisabled}
            onClick={() => {
              GenerateReportData()
              if (reportVisibility) {
                reportVisibility.forEach((page) => {
                  dispatcherSiteSelection({
                    type: `SET_${page}_VISIBLE`,
                    payload: false,
                  });
                })
              } else {
                  dispatcherSiteSelection({
                    type: `SET_MARKETSUMMARY_VISIBLE`,
                    payload: true,
                  });
                  dispatcherSiteSelection({
                    type: `SET_MARKETSUBTYPESUMMARY_VISIBLE`,
                    payload: true,
                  });
                  dispatcherSiteSelection({
                    type: `SET_MARKETSTATSTABLE_VISIBLE`,
                    payload: true,
                  });
                  dispatcherSiteSelection({
                    type: `SET_BACKCOVERPAGE_VISIBLE`,
                    payload: true,
                  });
              }
            }}
          >
            Generate Report
          </CalciteButton>
        </CalciteBlock>
      </CalcitePopover>
      <CalciteAlert
        icon="exclamation-mark-circle"
        kind="danger"
        scale="l"
        label="Demographic Scoring Error"
        autoClose="true"
        open= {alertVisible}
        onCalciteAlertClose={() => {
          setAlertVisible(false);
        }}
      >
        <div slot="title"><strong>Error Generating Report</strong></div>
        <div slot="message">
          <div>
            No data returned please check your parameters
          </div>
        </div>
      </CalciteAlert>
    </>
  );
};

export default ConfigPopover;
