import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import _ from "lodash";
import ReactGA from "react-ga";

import DealerDetails from "./dealer-details.js";
import DealerList from "./dealer-list";
import DealerMap from "./dealer-map";
import DealerSearch from "./dealer-search";
import { reserve } from "./theme";
import { createMapBounds } from "./utils";

const defaultStartingLocation = { lat: 36.9596054, lng: -122.0564889 };

const minZoom = 10;
const maxZoom = 20;
const defaultZoom = 14;

class DealerLocator extends React.Component {
  constructor() {
    super();

    this.dealerListAreaRef = React.createRef();

    this.state = {
      mapCenter: defaultStartingLocation,
      mapBoundary: null,
      mapZoom: null,
      selectedDealer: null,
      isDealerFilterSelected: false
    };
  }

  onMapReady = (mapProps, map, google) => {
    this.map = map;
    this.placesService = new google.maps.places.PlacesService(map);
  };

  onBoundsChanged = (mapProps, map) => {
    const mapBoundary = {
      northEastCorner: {
        lat: map.getBounds().getNorthEast().lat(),
        lng: map.getBounds().getNorthEast().lng(),
      },
      southWestCorner: {
        lat: map.getBounds().getSouthWest().lat(),
        lng: map.getBounds().getSouthWest().lng(),
      },
    };

    const mapCenter = {
      lat: map.center.lat(),
      lng: map.center.lng(),
    };

    this.setState({
      mapBoundary,
      mapCenter,
      mapZoom: map.getZoom(),
    });
  };

  onDealerSelected = (dealer) => {
    this.setState({
      selectedDealer: dealer,
    });

    this.dealerListAreaRef.current.scrollTop = 0;

    const zoom = _.clamp(
      _.get(this.state, "mapZoom", defaultZoom),
      minZoom,
      maxZoom
    );
    this.goToMapLocation(dealer.location, zoom);
    ReactGA.event({
      category: "Dealer Locator",
      action: "Selected Dealer",
      label: _.get(dealer, "name"),
    });
  };

  dealersWithSelectedFlag = () => {
    return _.map(this.props.dealers, (dealer) => ({
      ...dealer,
      selected: dealer.id === _.get(this.state, "selectedDealer.id"),
    }));
  };

  /* Pan to map location & find nearest dealer on autocomplete selection,
     keyboard enter or search button click
  */
  goToMapLocation = (coord, zoom = undefined) => {
    if (!this.map) {
      console.error("Map not ready");
      return;
    }

    if (zoom) {
      this.map.setZoom(zoom);
      this.map.panTo(coord);
      return;
    }

    // No zoom specified, so we'll need to figure out the correct zoom level based on the nearest dealer
    let nearestDealer = _.first(
      _.sortBy(this.props.dealers, (dealer) =>
        this.calculateDistance(
          dealer.location.lat,
          coord.lat,
          dealer.location.lng,
          coord.lng
        )
      )
    );

    const cartesianDistanceToNearestDealer = this.calculateDistance(
      nearestDealer.location.lat,
      coord.lat,
      nearestDealer.location.lng,
      coord.lng
    );

    const minimumDealerLocationForAdustingZoom = 0.02;
    if (
      cartesianDistanceToNearestDealer < minimumDealerLocationForAdustingZoom
    ) {
      return this.goToMapLocation(coord, defaultZoom);
    }

    const boundsIncludingNearestDealer = createMapBounds(
      coord,
      nearestDealer.location
    );
    this.map.fitBounds(boundsIncludingNearestDealer); // set viewport to contain bounds
    return this.map.panToBounds(boundsIncludingNearestDealer);
  };

  goToSearchLocation = (searchValue) => {
    const request = {
      fields: ["name", "geometry"],
      query: searchValue,
    };
    this.placesService.findPlaceFromQuery(request, (searchResults) => {
      if (_.isArray(searchResults) && searchResults.length > 0) {
        return this.goToMapLocation({
          lat: searchResults[0].geometry.location.lat(),
          lng: searchResults[0].geometry.location.lng(),
        });
      }
    });
  };

  calculateDistance = (x1, x2, y1, y2) => {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  };

  clearSelectedDealer = () => {
    this.setState({ selectedDealer: null });
  };

  onlineFilterIsSelected = () => {
    this.setState({
      isDealerFilterSelected: !this.state.isDealerFilterSelected,
    });
  };

  render() {
    const DealerDetailsComponent = this.props.dealerDetailsComponent ? this.props.dealerDetailsComponent : DealerDetails;

    return (
      <DealerLocatorWrapper>
        <SearchArea>
            <DealerSearch
              google={this.props.google}
              goToMapLocation={this.goToMapLocation}
              key={"DealerSearch"}
              goToSearchLocation={this.goToSearchLocation}
              apiKey={this.props.apiKey}
              placeholder={this.props.placeholder}
              searchIcon={this.props.searchIcon}
              searchBarStyles={this.props.searchBarStyles}
              dealerFilterEvent={this.onlineFilterIsSelected}
              dealerFilterButton={this.props.dealerFilterButton}
            />
        </SearchArea>
        <ListArea
          ref={this.dealerListAreaRef}
          allowScroll={!this.state.selectedDealer}
          dealerSelected={!!this.state.selectedDealer}
        >
          <DealerList
            key={"DealerList"}
            dealers={this.dealersWithSelectedFlag()}
            onDealerClicked={this.onDealerSelected}
            mapCenter={this.state.mapCenter}
            mapBoundary={this.state.mapBoundary}
            border={this.props.border}
            dealerCardComponent={this.props.dealerCardComponent}
            filterOnlineDealers={this.state.isDealerFilterSelected}
          />
        </ListArea>
        <MapArea>
          <DealerMap
            dealers={this.dealersWithSelectedFlag()}
            initialCenter={defaultStartingLocation}
            onBoundsChanged={this.onBoundsChanged}
            onDealerMarkerClicked={this.onDealerSelected}
            onReady={this.onMapReady}
            unselectedDealerIcon={this.props.unselectedDealerIcon}
            selectedDealerIcon={this.props.selectedDealerIcon}
            apiKey={this.props.apiKey}
          />
        </MapArea>
        <DealerDetailsWrapper visible={!!this.state.selectedDealer}>
          <DealerDetailsComponent
             dealer={this.state.selectedDealer}
             close={this.clearSelectedDealer}
             closeButton={this.props.closeDealerButton}
             websiteButton={this.props.dealerWebsiteButton}
          />
        </DealerDetailsWrapper>
      </DealerLocatorWrapper>
    );
  }
}

const DealerLocatorWrapper = styled.div`
  display: grid;
  position: relative;
  height: calc(
    100vh -
      (
        ${(props) => props.theme.headerHeight} +
          ${(props) => props.theme.footerHeight}
      )
  );
  grid-template-areas:
    "search map map"
    "list   map map"
    "list   map map";

  grid-template-columns: calc(${(props) => props.theme.menuSlideoutWidth}) 1fr;

  @media (max-width: ${(props) => props.theme.sideBySideLayoutBreakpoint}) {
    grid-template-areas:
      "search map"
      "map map";
    grid-template-columns: 50vw 50vw;
  }
`;

const DealerDetailsWrapper = styled.div`
  z-index: 5;
  grid-area: search / list / list;
  background: white;
  transition: transform 0.25s ease-in-out;
  transform: translate(${(props) => (props.visible ? 0 : "calc(-100vw)")});

  @media (max-width: ${(props) => props.theme.sideBySideLayoutBreakpoint}) {
    position: absolute;
    grid-area: auto;
    height: 100%;
    width: 100%;
    top: 0px;
    left: 0px;
  }
`;

const SearchArea = styled.div`
  grid-area: search;
  z-index: 2;

  @media (max-width: ${(props) => props.theme.sideBySideLayoutBreakpoint}) {
    padding-top: 11px;
    padding-left: 11px;
    width: 330px;
    height: fit-content;
    box-sizing: content-box;
    max-width: calc(100vw - (11px + ${(props) => props.theme.pagePaddingSide}));
  }
`;

const MapArea = styled.div`
  grid-area: map;
  position: relative;

  @media (max-width: ${(props) => props.theme.sideBySideLayoutBreakpoint}) {
    grid-area: auto;
    position: absolute;
    height: 100%;
    width: 100%;
  }
`;

const ListArea = styled.div`
  overflow-y: scroll;
  grid-area: list;
  @media (max-width: ${(props) => props.theme.sideBySideLayoutBreakpoint}) {
    display: none;
  }
`;

DealerLocator.propTypes = {
  dealers: PropTypes.array.isRequired,
  border: PropTypes.element.isRequired,
  selectedDealerIcon: PropTypes.string.isRequired,
  closeDealerButton: PropTypes.element.isRequired,
  dealerWebsiteButton: PropTypes.element.isRequired,
  apiKey: PropTypes.string.isRequired,
  dealerDetailsComponent: PropTypes.element.isRequired,
  dealerCardComponent: PropTypes.element.isRequired,
  dealerSearchComponent: PropTypes.element.isRequired
};

DealerLocatorWrapper.defaultProps = {
  theme: reserve.theme,
};

export default DealerLocator;
