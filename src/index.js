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
import DealerModal, { FindDealersLink } from "./dealer-modal.js";

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
      isDealerFilterSelected: false,
      onlineModalOpen: false,
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

  toggleOnlineModal = (e) => {
    this.setState({
      onlineModalOpen: !this.state.onlineModalOpen,
    });
  };

  render() {
    const DealerDetailsComponent = this.props.dealerDetailsComponent
      ? this.props.dealerDetailsComponent
      : DealerDetails;

    return (
<<<<<<< HEAD
      <DealerLocatorWrapper isDealerSelected={!!this.state.selectedDealer}>
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
        <MapArea isDealerSelected={!!this.state.selectedDealer}>
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
        <DealerDetailsWrapper isDealerSelected={!!this.state.selectedDealer}>
          <DealerDetailsComponent
            dealer={this.state.selectedDealer}
            close={this.clearSelectedDealer}
            closeButton={this.props.closeDealerButton}
            websiteButton={this.props.dealerWebsiteButton}
          />
        </DealerDetailsWrapper>
      </DealerLocatorWrapper>
=======
      <>
        <DealerModal
          open={this.state.onlineModalOpen}
          dealers={this.props.onlineDealers}
          toggleModal={this.toggleOnlineModal}
          closeModalButton={this.props.closeModalButton}
          theme={this.props.theme}
          text={this.props.findOnlineText}
        />
        <DealerLocatorWrapper theme={this.props.theme}>
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
            />
          </SearchArea>
          <ListArea
            ref={this.dealerListAreaRef}
            allowScroll={!this.state.selectedDealer}
            dealerSelected={!!this.state.selectedDealer}
            theme={this.props.theme}
          >
            <DealerList
              key={"DealerList"}
              dealers={this.dealersWithSelectedFlag()}
              onDealerClicked={this.onDealerSelected}
              mapCenter={this.state.mapCenter}
              mapBoundary={this.state.mapBoundary}
              border={this.props.border}
              dealerCardComponent={this.props.dealerCardComponent}
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
          <OnlineArea>
            <FindDealersLink
              text={this.props.findOnlineText}
              onClick={this.toggleOnlineModal}
              theme={this.props.theme}
            />
          </OnlineArea>
          <DealerDetailsWrapper visible={!!this.state.selectedDealer}>
            <DealerDetailsComponent
              dealer={this.state.selectedDealer}
              close={this.clearSelectedDealer}
              closeButton={this.props.closeDealerButton}
              websiteButton={this.props.dealerWebsiteButton}
            />
          </DealerDetailsWrapper>
        </DealerLocatorWrapper>
      </>
>>>>>>> Add modal for online dealers
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
<<<<<<< HEAD
    "list   map map";
    
  grid-template-columns: calc(${(props) => props.theme.menuSlideoutWidth}) 1fr;
  
  @media (max-width: ${(props) => props.theme.sideBySideLayoutBreakpoint}) { 
     grid-template-areas: ${(props) => props.isDealerSelected ? `"search map" "map map"` : `"search" "map"`};
     grid-template-columns: ${(props) => props.isDealerSelected ? '1fr 30%' : 'none'};
=======
    "list   map map"
    "list   online online";

  @media screen and (min-width: ${(props) =>
      props.theme.sideBySideLayoutBreakpoint}) {
    grid-template-columns: calc(${(props) => props.theme.menuSlideoutWidth}) 1fr;
  }

  @media (max-width: ${(props) => props.theme.sideBySideLayoutBreakpoint}) {
    grid-template-areas:
      "search"
      "map"
      "online";
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
>>>>>>> Add modal for online dealers
  }
`;

const DealerDetailsWrapper = styled.div`
  z-index: 5;
  grid-area: search / list / list;
  background: white;
  transition: transform 0.25s ease-in-out;
  transform: translate(${(props) => (props.isDealerSelected ? 0 : "calc(-100vw)")});

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
    height: fit-content;
    box-sizing: content-box;
    max-width: calc(100vw - (11px + ${(props) => props.theme.pagePaddingSide}));
  }
`;

const MapArea = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  grid-area: map;
<<<<<<< HEAD
  position: ${(props) => props.isDealerSelected ? 'relative' : 'initial'};
=======
`;
>>>>>>> Add modal for online dealers

const OnlineArea = styled.div`
  grid-area: online;
  margin: 1rem 1rem 1rem 0;
`;

const ListArea = styled.div`
  overflow-y: scroll;
  grid-area: list;

  @media screen and (max-width: ${(props) =>
      props.theme.sideBySideLayoutBreakpoint}) {
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
  dealerDetailsComponent: PropTypes.func.isRequired,
  dealerCardComponent: PropTypes.func.isRequired,
  dealerSearchComponent: PropTypes.func,
  findOnlineText: PropTypes.string,
};

DealerLocator.defaultProps = {
  theme: reserve.theme,
};

export default DealerLocator;
