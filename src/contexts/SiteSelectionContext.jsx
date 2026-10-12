import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import PropTypes from "prop-types";

const SiteSelectionContext = createContext();

function SiteSelectionProvider({ children }) {

  const initialState = {
    map: null,
    mapAvailable: false,    
  };

  function reducer(state, action) {

    switch (action.type) {
      case "SET_MAP":
        return { ...state, map: action.payload, appMap: action.payload };
      case "SET_MAP_AVAILABLE":
        return { ...state, mapAvailable: true };
      case "RESET": {
        return {
          ...state,
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


  return (
    <SiteSelectionContext.Provider
      value={{
        map,
        mapAvailable,
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
