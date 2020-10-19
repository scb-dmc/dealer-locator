export const createMapBounds = (center, pointToInclude) => {
  const dealerIsEastOfMapCenter = pointToInclude.lng > center.lng;
  const dealerIsWestOfMapCenter = pointToInclude.lng < center.lng;
  const dealerIsNorthOfMapCenter = pointToInclude.lat > center.lat;
  const dealerIsSouthOfMapCenter = pointToInclude.lat < center.lat;

  let latLngBounds = {};
  if (dealerIsEastOfMapCenter && dealerIsNorthOfMapCenter) {
    // point should be near the NORTHEAST corner of the map
    latLngBounds.north = pointToInclude.lat;
    latLngBounds.east = pointToInclude.lng;

    latLngBounds.south = center.lat - (latLngBounds.north - center.lat);
    latLngBounds.west = center.lng - (latLngBounds.east - center.lng);
  }

  if (dealerIsWestOfMapCenter && dealerIsSouthOfMapCenter) {
    // point should be near the SOUTHWEST corner of the map
    latLngBounds.west = pointToInclude.lng;
    latLngBounds.south = pointToInclude.lat;

    latLngBounds.north = center.lat + (center.lat - latLngBounds.south);
    latLngBounds.east = center.lng + (center.lng - latLngBounds.west);
  }

  if (dealerIsWestOfMapCenter && dealerIsNorthOfMapCenter) {
    // point should be near the NORTHWEST corner of the map
    latLngBounds.west = pointToInclude.lng;
    latLngBounds.north = pointToInclude.lat;

    latLngBounds.south = center.lat - (latLngBounds.north - center.lat);
    latLngBounds.east = center.lng - (latLngBounds.west - center.lng);
  }

  if (dealerIsSouthOfMapCenter && dealerIsEastOfMapCenter) {
    // point should be near the SOUTHEAST corner of the map
    latLngBounds.east = pointToInclude.lng;
    latLngBounds.south = pointToInclude.lat;

    latLngBounds.west = center.lng - (latLngBounds.east - center.lng);
    latLngBounds.north = center.lat - (latLngBounds.south - center.lat);
  }
  return latLngBounds;
};

export const isLocationWithinBoundary = (location, boundary) => {
  if (!boundary) {
    return false;
  }

  const boundaryCrossesDateline =
    boundary.northEastCorner.lng < boundary.southWestCorner.lng;
  const locationIsEastOfDateline = location.lng < 0;

  const eastComparisonLng =
    boundaryCrossesDateline && !locationIsEastOfDateline
      ? 0
      : boundary.northEastCorner.lng;

  const westComparisonLng =
    boundaryCrossesDateline && locationIsEastOfDateline
      ? -180
      : boundary.southWestCorner.lng;

  const belowNorthEastCorner =
    location.lng < eastComparisonLng &&
    location.lat < boundary.northEastCorner.lat;

  const aboveSouthWestCorner =
    location.lng > westComparisonLng &&
    location.lat > boundary.southWestCorner.lat;

  return belowNorthEastCorner && aboveSouthWestCorner;
};
