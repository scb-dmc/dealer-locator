import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import styled from "styled-components";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

class DealerMap extends React.Component {
  constructor(props) {
    super(props);

    const google = this.props.google;
    if (!google) {
      console.error("no google?");
      return;
    }
    this.unselectedDealerIcon = this.buildIcon(this.props.unselectedDealerIcon, 20);
    this.selectedDealerIcon = this.buildIcon(this.props.selectedDealerIcon, 30);
  }

  buildIcon = (source, size) => {
    return {
      url: source,
      scaledSize: new this.props.google.maps.Size(size, size),
    };
  };

  render = () => {
    const {
      initialCenter,
      dealers,
      onBoundsChanged,
      onDealerMarkerClicked,
      google,
      onReady,
    } = this.props;
    return (
      <Map
        initialCenter={initialCenter}
        google={google}
        onReady={(mapProps, map) => onReady(mapProps, map, google)}
        onBoundsChanged={_.debounce(onBoundsChanged, 250)}
        centerAroundCurrentLocation={true}
        mapTypeControl={false}
        fullscreenControl={false}
      >
        {dealers.map((dealer, idx) => {
          return (
            <Marker
              key={dealer.id}
              position={dealer.location}
              opened={dealer.selected}
              onClick={() => onDealerMarkerClicked(dealer)}
              icon={
                dealer.selected
                  ? this.selectedDealerIcon
                  : this.unselectedDealerIcon
              }
            ></Marker>
          );
        })}
      </Map>
    );
  };
}

const Loader = () => <LoaderWrapper>Loading Map...</LoaderWrapper>;

const LoaderWrapper = styled.div`
  display: grid;
  justify-content: center;
  margin-top: 100px;
  font-size: 30px;
`;

export default GoogleApiWrapper((props) => ({
  apiKey: props.apiKey,
  LoadingContainer: Loader,
}))(DealerMap);

DealerMap.propTypes = {
  dealers: PropTypes.array,
  viewport: PropTypes.object,
  onBoundsChanged: PropTypes.func,
  onMarkerClicked: PropTypes.func,
  selectedDealerIcon: PropTypes.string.isRequired,
  unselectedDealerIcon: PropTypes.string.isRequired,
};
