import { useSiteSelection } from "../contexts/SiteSelectionContext";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-placement";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter.js";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol.js";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer.js";
import Query from "@arcgis/core/rest/support/Query.js";
import { useState, useEffect, useRef } from "react";
import { writeReportTableQuery, writeChartQuery } from "../helpers/DataFormatting";
const MapComponent = () => {
  const { year, market, marketId,  dispatcherSiteSelection, submarkets, marketType, metroArea, submarketIds, 
          submarketLayer, tableData, subTypeData, subTypeChartData, chartData,  quarter, subtypes, reportTable, reportConfig } = useSiteSelection()
  const mapRef = useRef(null)
  const [filter, setFilter] = useState(null)
  const [map, setMap] = useState(null);
  const [mapAvailable, setMapAvailable] = useState(false);
  const [fullReportConfig, setFullReportConfig] = useState(null)
  const fullReportConfigRef = useRef(null)
  const [fullTableData, setFullTableData] = useState(null)
  const fullTableDataRef = useRef(null)
  const [fullSubtypeData, setFullSubtypeData] = useState(null)
  const fullSubtypeDataRef = useRef(null)
  const [fullChartData, setFullChartData] = useState(null)
  const fullChartDataRef = useRef(null)
  const [fullSubtypeChartData, setFullSubtypeChartData] = useState(null)
  const fullSubtypeChartDataRef = useRef(null)
  const [fullSubmarkets, setFullSubmarkets] = useState(null);
  const fullSubmarketsRef = useRef(null)
  const [marketLayerView, setMarketLayerView] = useState(null);
  const [submarketLayerView, setSubmarketLayerView] = useState(null);
  const [selectedOID, setSelectedOID] = useState(null);
  const selectedOIDRef = useRef(null);
  const highlightRef = useRef(null);   

  
  const newSymbol = new SimpleFillSymbol({
    color: [123, 139, 189, 0.5],
    style: "solid",
    outline: {
      color: [123, 139, 189, 1],
      width: 1.5
    }
  });

  const newRenderer = new SimpleRenderer({
    symbol: newSymbol
  })
  
  async function writeSubmarketConfig(submarketName) {
    console.log("writing Sumarket Config")
    const [subTypeStatsData, marketStatsData, AggReportData] = await writeReportTableQuery(year, quarter, metroArea, marketId, submarketName, subtypes, marketType, reportTable)
    const [chartConfig, subtypeChartConfig] = await writeChartQuery(metroArea, marketId, submarketName, subtypes, marketType, reportTable, year)
    if (AggReportData) {
      console.log("Submarket Report Config", AggReportData)
      dispatcherSiteSelection({
        type: "SET_SUBMARKETS",
        payload: submarketName,
      });
      dispatcherSiteSelection({
        type: "SET_TABLE_DATA",
        payload: marketStatsData
      })
      dispatcherSiteSelection({
        type: "SET_SUBTYPE_DATA",
        payload: subTypeStatsData,
      });
      dispatcherSiteSelection({
        type: "SET_REPORT_CONFIG",
        payload: AggReportData,
      });
      dispatcherSiteSelection({
        type: "SET_SUBTYPE_CHART_DATA",
        payload: subtypeChartConfig
      });
      dispatcherSiteSelection({
        type: "SET_CHART_DATA",
        payload: chartConfig
      });
    }
  }

  async function layerViewHighlight(view, oid, condition) {
    if (condition === "remove") {      
      setSelectedOID(null)
      selectedOIDRef.current = null
      highlightRef.current?.remove();
      highlightRef.current = null;
      return;
    } else if (condition === "select") {
      setSelectedOID(oid)
      selectedOIDRef.current = oid
      const featureLayerView = view?.allLayerViews.items.find(
        (layerView) => layerView.layer?.title === "Colliers Submarkets"
      );
      console.log("featureLayerView", featureLayerView)
      await featureLayerView
        ?.queryFeatures({
          objectIds: oid ? [oid] : null,
          returnGeometry: true,
        })
        .then((results) => {
          if (highlightRef.current) {
            highlightRef.current?.remove();
          }
          if (results?.features.length < 1) return;
          const feature = results?.features?.[0];
          if (feature) {
            highlightRef.current = featureLayerView?.highlight(feature, {name: "temporary",});
          }
        });
    }
  }

  async function storeExitingReportData() {
    setFullReportConfig(reportConfig)
    fullReportConfigRef.current = reportConfig
    setFullSubmarkets(submarkets)
    fullSubmarketsRef.current = submarkets
    setFullTableData(tableData)
    fullTableDataRef.current = tableData
    setFullSubtypeData(subTypeData)
    fullSubtypeDataRef.current = subTypeData
    setFullChartData(chartData)
    fullChartDataRef.current = chartData
    setFullSubtypeChartData(subTypeChartData)
    fullSubtypeChartDataRef.current = subTypeChartData
  }
  
  async function SelectFeature(view, event) {
    const screenPoint = { x: event.x, y: event.y };
    view.hitTest(screenPoint).then(function(response) {
      if (response.results.length) {
        const graphicResult = response.results.filter(function(result) {
          return result.graphic;
        })[0];
          console.log("graphicResult:", graphicResult);
          if (graphicResult.graphic && graphicResult?.graphic?.layer?.title === "Colliers Submarkets") {
              const graphic = graphicResult.graphic;
              console.log('selectedOID State', selectedOIDRef.current)
              console.log('OID Being Selected', graphic.attributes.objectid)
              console.log('Submarket Being Selected', graphic.attributes.submarketname)
              if (selectedOIDRef.current !== graphic.attributes.objectid) {
                storeExitingReportData();
                writeSubmarketConfig([graphic.attributes.submarketname])
                console.log('selecting OID', graphic.attributes.objectid)
                layerViewHighlight(view, graphic.attributes.objectid, 'select')
              } else if (selectedOIDRef.current === graphic.attributes.objectid) {
                layerViewHighlight(view, null, 'remove')
                console.log("fullChartData", fullChartDataRef.current)
                console.log("fullSubtypeChartData", fullSubtypeChartDataRef.current)
                console.log("fullReportConfig", fullReportConfigRef.current)
                console.log("fullSubtypeData", fullSubtypeDataRef.current)
                console.log("fullSubmarkets", fullSubmarketsRef.current)
                dispatcherSiteSelection({
                  type: "SET_REPORT_CONFIG",
                  payload: fullReportConfigRef.current,
                })
                dispatcherSiteSelection({
                  type: "SET_SUBMARKETS",
                  payload: fullSubmarketsRef.current,
                });
                dispatcherSiteSelection({
                  type: "SET_TABLE_DATA",
                  payload: fullTableDataRef.current,
                })
                dispatcherSiteSelection({
                  type: "SET_SUBTYPE_DATA",
                  payload: fullSubtypeDataRef.current,
                });
                dispatcherSiteSelection({
                  type: "SET_SUBTYPE_CHART_DATA",
                  payload: fullSubtypeChartDataRef.current
                });
                dispatcherSiteSelection({
                  type: "SET_CHART_DATA",
                  payload: fullChartDataRef.current
                });
                setFullReportConfig(null)
                fullReportConfigRef.current = null
                setFullSubmarkets(null)
                fullSubmarketsRef.current = null
                setFullTableData(null)
                fullTableDataRef.current = null
                setFullSubtypeData(null)
                fullSubtypeDataRef.current = null
                setFullChartData(null)
                fullChartDataRef.current = null
                setFullSubtypeChartData(null)
                fullSubtypeChartDataRef.current = null
              }
          }
      } else {
        return
      }
    });
  }
  
  async function handleViewReady(e) {
    await e.target?.view.when(
      () => {
        const inMapLayer = e.target?.map?.layers?.find(l => l?.title?.includes("Colliers Submarkets"));
        inMapLayer.outFields = ["*"];
        // dispatcherSiteSelection({ type: "SET_MAP", payload: e.target }); 
        setMap(e.target);
        // dispatcherSiteSelection({ type: "SET_MAP_AVAILABLE" });  
        setMapAvailable(true);    
        const view = e.target.view;
        // view.navigation.mouseWheelZoomEnabled = false;
        // view.navigation.actionMap.mouseWheel = "none";
        // view.navigation.browserTouchPanEnabled = false;
        // view.navigation.dragPanEnabled = false;
        view.navigation.keyboardEnabled = false;
        view.navigation.doubleClickZoomEnabled = false;
        view.highlights = [
          {
            name: "default",
            //Colliers Teal
            color: [42, 182, 169],
          },
          // Colliers Yellow
          { name: "temporary", color: [255, 212, 0] },
        ];
        view.on("click", function(event) {SelectFeature(view, event)});
      },
      (error) => {
        console.error("Map component unmount error: ", error);
      }
    );
  }
  
  useEffect(() => {
    if (!mapAvailable || !map?.view?.ready) return;
      let queryWhere = `type = '${marketType}'`
      if (metroArea) {
        queryWhere = queryWhere + ` AND metroarea = '${metroArea}'`
      }
      if (marketId) {
        const marketsFormat = marketId.map(item => `'${item}'`).join(', ')
        // console.log(marketsFormat)
        queryWhere = queryWhere + ` AND marketid in (${marketsFormat})`
      } 
      if (submarketIds) {
        const submarketsFormat = submarketIds.map(item => `'${item}'`).join(', ')
        // console.log(submarketsFormat)
        queryWhere = queryWhere + ` AND submarketid in (${submarketsFormat})`
      }
    // console.log(queryWhere)
    setFilter(queryWhere)
  }, [map, market, marketId, submarkets, submarketIds, metroArea, mapAvailable, marketId]);
    
  useEffect(() => {
    const updateMarketView = async () => {
      if (!mapAvailable || !map?.view?.ready || !filter) return;
      try {
        const inMapLayer = map?.map?.layers?.find(l => l?.title?.includes("Colliers Submarkets"));
        // console.log("inMapLayer", inMapLayer)
        if (!inMapLayer) return;
        // console.log(filter)
        const layerView = await map.view.whenLayerView(inMapLayer);
        layerView.title = "Market Layer View";
        layerView.filter = new FeatureFilter({where: filter});
        const results = await inMapLayer.queryFeatures({
          outFields: ["*"],
          where: filter,
          returnGeometry: true,
        });
        // console.log("Query Results:", results);
        const feature = results.features;
        if (feature) {
          // console.log("Features found: ", feature);
          // console.log(feature);
          if (feature.length === 1) {
            map.view
              ?.goTo({ target: feature})
              .then(() => null)
              .catch(() => null);
          } else {
            map.view
              ?.goTo({ target: feature })
              .then(() => null)
              .catch(() => null);
          }
        }
      } catch (err) {
        console.error("Error updating market view:", err);
      }
    };
    updateMarketView();
  }, [filter]);


  return(
    <arcgis-map
      ref={mapRef}
      id="app-map"
      item-id="87a69fb0587e4203ac20a214aeaff134"
      auto-destroy-disabled
      onarcgisViewReadyChange={handleViewReady}
      // interaction-options='{"dragPan": false, "dragRotate": false, "keyboard": false, "doubleClickZoom": false, "zoom": false}'
      popup-disabled="true"
    >
      <arcgis-expand slot="top-left" icon="basemap">
        <arcgis-basemap-gallery reference-element="app-map"></arcgis-basemap-gallery>
      </arcgis-expand>
      <arcgis-zoom slot="top-left"></arcgis-zoom>
      {fullReportConfig && (
        <button className="downloadButton" slot="top-right" 
          onClick={() => {
              layerViewHighlight(map.view, null, 'remove')
              console.log("fullChartData", fullChartData)
              console.log("fullSubtypeChartData", fullSubtypeChartData)
              console.log("fullReportConfig", fullReportConfig)
              console.log("fullSubtypeData", fullSubtypeData)
              console.log("fullSubmarkets", fullSubmarkets)
              dispatcherSiteSelection({
                type: "SET_REPORT_CONFIG",
                payload: fullReportConfig,
              })
              dispatcherSiteSelection({
                type: "SET_SUBMARKETS",
                payload: fullSubmarkets,
              });
              dispatcherSiteSelection({
                type: "SET_TABLE_DATA",
                payload: fullTableData
              })
              dispatcherSiteSelection({
                type: "SET_SUBTYPE_DATA",
                payload: fullSubtypeData,
              });
              dispatcherSiteSelection({
                type: "SET_SUBTYPE_CHART_DATA",
                payload: fullSubtypeChartData
              });
              dispatcherSiteSelection({
                type: "SET_CHART_DATA",
                payload: fullChartData
              });
              setFullReportConfig(null)
              fullReportConfigRef.current = null
              setFullSubmarkets(null)
              fullSubmarketsRef.current = null
              setFullTableData(null)
              fullTableDataRef.current = null
              setFullSubtypeData(null)
              fullSubtypeDataRef.current = null
              setFullChartData(null)
              fullChartDataRef.current = null
              setFullSubtypeChartData(null)
              fullSubtypeChartDataRef.current = null
            }
          }
        >Full Market Report</button>
      )}
    </arcgis-map>
  );
};

export default MapComponent;
