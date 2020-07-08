import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import _ from "lodash";

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

const isLocationWithinBoundary = (location, boundary) => {
  if (!boundary) {
    return false;
  }
  const belowNorthEastCorner =
    location.lng < boundary.northEastCorner.lng &&
    location.lat < boundary.northEastCorner.lat;

  const aboveSouthWestCorner =
    location.lng > boundary.southWestCorner.lng &&
    location.lat > boundary.southWestCorner.lat;

  return belowNorthEastCorner && aboveSouthWestCorner;
};

const DealerCard = (dealer, key, onDealerClicked) => (
  <Dealer key={key} onClick={() => onDealerClicked(dealer)}>
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

const DealerList = ({
  dealers,
  onDealerClicked,
  mapCenter,
  mapBoundary,
  border,
  theme,
}) => {
  const dealersOnMap = _.filter(dealers, (dealer) =>
    isLocationWithinBoundary(dealer.location, mapBoundary)
  );

  const dealersOffMap = _.filter(
    dealers,
    (dealer) => !isLocationWithinBoundary(dealer.location, mapBoundary)
  );

  const sorter = dealerDistanceCalculator(mapCenter);

  const dealerCardCreator = (dealer, idx) =>
    DealerCard(dealer, idx, onDealerClicked);
  return (
    <>
      <List emphasized={true} theme={theme}>
        {_.sortBy(dealersOnMap, sorter).map(dealerCardCreator)}
      </List>
      {!_.isEmpty(dealersOnMap) && border}
      <List emphasized={false} theme={theme}>
        {_.sortBy(dealersOffMap, sorter).map(dealerCardCreator)}
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
};

DealerList.defaultProps = {
  theme: {
    textColorDark: reserve.textColorDark,
    textColorLight: reserve.textColorLight,
  },
};

export default DealerList;
