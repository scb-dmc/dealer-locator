import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import _filter from "lodash/filter";
import _isEmpty from "lodash/isEmpty";
import _sortBy from "lodash/sortBy";

import { isLocationWithinBoundary } from "./utils";

import { reserve } from "./theme";

const dealerDistanceCalculator = (location) => {
  return (dealer) => {
    const dist = Math.sqrt(
      (dealer.location.lat - location.lat) ** 2 +
        (dealer.location.lng - location.lng) ** 2
    );

    return dist;
  };
};

const DealerCard = (dealer, key, onDealerClicked, theme) => (
  <Dealer key={key} onClick={() => onDealerClicked(dealer)} theme={theme}>
    <DealerName>{dealer.name}</DealerName>
    <DealerLocation>
      {dealer.addr1} {dealer.city}
      {(dealer.addr1 || dealer.city) && (dealer.state || dealer.zip)
        ? ", "
        : " "}
      {dealer.state} {dealer.zip}
    </DealerLocation>
  </Dealer>
);

const filterByOnlineDealer = (dealer) => {
  return dealer.online;
};

const DealerList = ({
  dealers,
  onDealerClicked,
  mapCenter,
  mapBoundary,
  border,
  theme,
  dealerListSlideOutWidth,
  dealerListBottomBuffer,
  dealerCardComponent,
  filterOnlineDealers,
}) => {
  const OnlineDealerFilterProp = filterOnlineDealers;

  const dealersOnMap = _filter(dealers, (dealer) => {
    return OnlineDealerFilterProp
      ? filterByOnlineDealer(dealer)
      : isLocationWithinBoundary(dealer.location, mapBoundary);
  });

  const dealersOffMap = _filter(
    dealers,
    (dealer) => !isLocationWithinBoundary(dealer.location, mapBoundary)
  );

  const sorter = dealerDistanceCalculator(mapCenter);

  const DealerCardProp = dealerCardComponent;

  const dealerCardCreator = (dealer, idx) =>
    DealerCardProp
      ? dealerCardComponent(dealer, idx, onDealerClicked)
      : DealerCard(dealer, idx, onDealerClicked, theme);

  return (
    <>
      <List
        emphasized={true}
        theme={theme}
        dealerListSlideOutWidth={dealerListSlideOutWidth}
        dealerListBottomBuffer={dealerListBottomBuffer}
      >
        {_sortBy(dealersOnMap, sorter).map(dealerCardCreator)}
      </List>
      {!_isEmpty(dealersOnMap) && border}
      <List
        emphasized={false}
        theme={theme}
        dealerListSlideOutWidth={dealerListSlideOutWidth}
        dealerListBottomBuffer={dealerListBottomBuffer}
      >
        {_sortBy(dealersOffMap, sorter).map(dealerCardCreator)}
      </List>
    </>
  );
};

const List = styled.ul`
  color: ${(props) =>
    props.emphasized ? props.theme.textColorDark : props.theme.textColorLight};
`;

const DealerName = styled.h3``;

const DealerLocation = styled.div`
  font-size: 0.9rem;
`;

const Dealer = styled.li`
  cursor: pointer;
  padding: 10px 10px 10px 0px;
  list-style: none;
`;

/**
 * mapCenter is an object like {lat: 12.05, lng: 3.14}. List will be sorted by nearest to this location.
 *
 * mapBoundary is a geographic area described by a box. Dealers located within this box will be emphasized.
 * {
 *   northEastCorner: {lat: 63, lng: 42},
 *   southWestCorner: {lat: 40, lng: 15}
 * }
 *
 */

DealerList.propTypes = {
  dealers: PropTypes.array,
  onDealerListClicked: PropTypes.func,
  mapCenter: PropTypes.object,
  mapBoundary: PropTypes.object,
  border: PropTypes.element.isRequired,
  dealerListBottomBuffer: PropTypes.string,
};

DealerList.defaultProps = {
  theme: reserve.theme,
};

export default DealerList;
