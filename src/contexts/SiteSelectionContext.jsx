import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import PropTypes from "prop-types";
import Portal from "@arcgis/core/portal/Portal.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Query from "@arcgis/core/rest/support/Query.js";
import { useUserAuthorization } from "./UserAuthorizationContext";
async function getFeaturesFromLayers(layers) {
  const features = [];
  for (const layer of layers) {
    if (layer.type === "feature" || layer.type === "csv") {
      const results = await layer.queryFeatures();
      features.push(...(await results.features));
    }
  }
  return await features;
}

const SiteSelectionContext = createContext();

function SiteSelectionProvider({ children }) {
  const { credential } = useUserAuthorization();

  const initialState = {
    map: null,
    mapAvailable: false,
    marketType: null,
    metroArea: null,
    market: null,
    marketId: null,
    quarter: null,
    year: null,
    submarkets: null,
    subtypes: null,
    submarketIds: null,
    reportConfig: null,
    chartData: null,
    subTypeChartData: null,
    tableData: null,
    officeData: null, 
    subTypeData: null,
    imageLayer: null,
    imageURL: null,
    officeLayer: null,
    reportTable: null,
    SubmarketLayer: null,
    portal: null,
    portalItems: null,
    searchString: "",
    marketSummaryVisible: true,
    marketSubtypeSummaryVisible: true,
    marketStatsTableVisible: true,
    backCoverPageVisible: true,
  };

  function reducer(state, action) {

    switch (action.type) {
      case "SET_MAP":
        return { ...state, map: action.payload, appMap: action.payload };
      case "SET_MAP_AVAILABLE":
        return { ...state, mapAvailable: true };
      case "SET_REPORT_TABLE":
        return { ...state, reportTable: action.payload };
      case "SET_MARKET_TYPE":
        return { ...state, marketType: action.payload };
      case "SET_METRO_AREA":
        return { ...state, metroArea: action.payload };
      case "SET_MARKET":
        return { ...state, market: action.payload };
      case "SET_MARKET_ID":
        return { ...state, marketId: action.payload };
      case "SET_QUARTER":
        return { ...state, quarter: action.payload };
      case "SET_YEAR":
        return { ...state, year: action.payload };
      case "SET_OFFICE_LAYER":
        return { ...state, officeLayer: action.payload}
      case "SET_IMAGE_LAYER":
        return { ...state, imageLayer: action.payload}
      case "SET_IMAGE_URL":
        return { ...state, imageURL: action.payload}
      case "SET_SUBMARKETS":
        return { ...state, submarkets: action.payload}
      case "SET_SUBTYPES":
        return { ...state, subtypes: action.payload}
      case "SET_SUBMARKET_IDS":
        return { ...state, submarketIds: action.payload}
      case "SET_REPORT_CONFIG":
        return { ...state, reportConfig: action.payload}
      case "SET_CHART_DATA":
        return { ...state, chartData: action.payload}
      case "SET_SUBTYPE_CHART_DATA":
        return { ...state, subTypeChartData: action.payload}
      case "SET_TABLE_DATA":
        return { ...state, tableData: action.payload}
      case "SET_OFFICE_DATA":
        return { ...state, officeData: action.payload}
      case "SET_SUBTYPE_DATA":
        return { ...state, subTypeData: action.payload}
      case "SET_SUBMARKET_LAYER":
        return { ...state, SubmarketLayer: action.payload };
      case "SET_PORTAL": // single feature
        return { ...state, portal: action.payload }; //Portal connection
      case "SET_PORTAL_ITEMS": // single feature
        return { ...state, portalItems: action.payload }; //Array of Portal items
      case "SET_SEARCH_STRING":
        return { ...state, searchString: action.payload };
      case "SETUP_COMPLETE":
        return { ...state, setupComplete: true };
      case "SET_SAVED_STATE":
        return { ...state, ...action.payload };
      case "SET_MARKETSUMMARY_VISIBLE":
        return { ...state, marketSummaryVisible: action.payload };
      case "SET_MARKETSUBTYPESUMMARY_VISIBLE":
        return { ...state, marketSubtypeSummaryVisible: action.payload };
      case "SET_MARKETSTATSTABLE_VISIBLE":
        return { ...state, marketStatsTableVisible: action.payload };
      case "SET_BACKCOVERPAGE_VISIBLE":
        return { ...state, backCoverPageVisible: action.payload };
      case "RESET": {
        return {
          ...state,
          marketType: null,
          metroArea: null,
          market: null,
          marketId: null,
          quarter: null,
          year: null,
          submarkets: null, 
          subtypes: null,
          submarketIds: null,
          reportConfig: null,
          chartData: null,
          subTypeChartData: null,
          tableData: null,
          officeData: null,
          subTypeData: null,
          imageLayer: null,
          imageURL: null,
          marketSummaryVisible: true,
          marketSubtypeSummaryVisible: true,
          marketStatsTableVisible: true,
          backCoverPageVisible: true,
        };
      }
      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    map,
    mapAvailable,
    marketType,
    metroArea,
    market,
    marketId,
    quarter,
    year,
    submarkets,
    subtypes,
    submarketIds,
    reportConfig,
    chartData,
    subTypeChartData,
    tableData,
    officeData,
    subTypeData,
    officeLayer,
    imageLayer,
    imageURL,
    reportTable,
    SubmarketLayer,
    portal,
    portalItems,
    setupComplete,
    marketSummaryVisible,
    marketSubtypeSummaryVisible,
    marketStatsTableVisible,
    backCoverPageVisible,
    searchString,
  } = state;

  const dispatcherSiteSelection = useCallback(
    function dispatcherSiteSelection(action) {
      dispatch(action);
    },
    [dispatch]
  );

  function setMap(mapReference) {
    dispatch({ type: "SET_MAP", payload: mapReference });
  }

  useEffect(() => {
    if (credential?.server == undefined) return;
    const portalConnection = new Portal(credential.server);
    dispatch({ type: "SET_PORTAL", payload: portalConnection });
    const dataTable = new FeatureLayer({
      portalItem: {
        id: "e76a5046de6642fd94a111188a85a612",
      },
    })
    // console.log("Data Table",dataTable)
    dispatch({ type: "SET_REPORT_TABLE", payload: dataTable });

    const offices = new FeatureLayer({
      portalItem: {
        id: "8f485af4275a4e55aa512f56c1f546e4",
      },
    })
    // console.log("Data Table",dataTable)
    dispatch({ type: "SET_OFFICE_LAYER", payload: offices });
    
    const SubmarketMap = new FeatureLayer({
      portalItem: {
        id: "af533dc1aaa244e5a4362204a7581abc",
      },
      outFields:["*"]
    })
    dispatch({ type: "SET_SUBMARKET_LAYER", payload: SubmarketMap });
  }, [credential]);

  
  useEffect(() => {
    if (marketType === "Office") {
      const dataTable = new FeatureLayer({
        portalItem: {
          id: "e76a5046de6642fd94a111188a85a612",
        },
      })
      // console.log("Data Table",dataTable)
      dispatch({ type: "SET_REPORT_TABLE", payload: dataTable });

      const images = new FeatureLayer({
        portalItem: {
          id: "7800e7bbfea140119a331ff34b497a7a",
        },
      })
      dispatch({ type: "SET_IMAGE_LAYER", payload: images });
    } else if (marketType === "Industrial") {
      const dataTable = new FeatureLayer({
        portalItem: {
          id: "4bc3028a09604a5bbcf42b4c8e29f5bd",
        },
      })
      // console.log("Data Table",dataTable)
      dispatch({ type: "SET_REPORT_TABLE", payload: dataTable });

      const images = new FeatureLayer({
        portalItem: {
          id: "75fd1f3d757243b1bc20311a8e4f1545",
        },
      })
      dispatch({ type: "SET_IMAGE_LAYER", payload: images });
    }
  }, [marketType]);


  //HANDLES ACTIVELY SETTING PORTAL CONTENT TO COMBOBOXES WHILE TYPING
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchPortalItems() {
        if (!portal?.authMode) return;
        portal.authMode = "immediate";

        const query = `title:${
          searchString || ""
        }* AND type: ('Feature Layer' OR 'Map Service' OR 'Scene Layer' OR 'Tile Layer' OR 'WMS' OR 'WMTS')`;

        try {
          const response = await portal?.queryItems(
            {
              query,
              num: 100,
            },
            { signal: controller.signal }
          );

          const data = await response?.results;
          if (data?.length < 1)
            throw new Error("No content found matching query.");
          dispatcherSiteSelection({ type: "SET_PORTAL_ITEMS", payload: data });
        } catch (err) {
          throw new Error(
            `Something happend while querying Atlas items: ${err}`
          );
        }
      }

      fetchPortalItems();
      return function () {
        controller.abort();
      };
    },
    [dispatcherSiteSelection, portal, searchString]
  );

  return (
    <SiteSelectionContext.Provider
      value={{
        map,
        mapAvailable,
        marketType,
        metroArea,
        market,
        marketId,
        quarter,
        year,
        submarkets,
        subtypes,
        submarketIds,
        reportConfig,
        chartData,
        subTypeChartData,
        tableData,
        officeData,
        subTypeData,
        officeLayer,
        imageLayer,
        imageURL,
        reportTable,
        SubmarketLayer,
        portal,
        portalItems,
        searchString,
        marketSummaryVisible,
        marketSubtypeSummaryVisible,
        marketStatsTableVisible,
        backCoverPageVisible,
        setMap,
        dispatcherSiteSelection,
      }}
    >
      {children}
    </SiteSelectionContext.Provider>
  );
}

SiteSelectionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useSiteSelection() {
  const context = useContext(SiteSelectionContext);
  if (context === undefined)
    throw new Error(
      "SiteSelectionContext was used outside of SiteSelectionProvider"
    );
  return context;
}

export { SiteSelectionProvider, useSiteSelection };
