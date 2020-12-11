import React from "react";
import PropTypes from "prop-types";

class ReactGoogleSearchBox extends React.Component {
  static propTypes = {
    onPlaceSelected: PropTypes.func,
    types: PropTypes.array,
    componentRestrictions: PropTypes.object,
    bounds: PropTypes.object,
    fields: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.autocomplete = null;
    this.placeSelectedEvent = null;
  }

  componentDidMount() {
    const {
      types = ["(cities)"],
      componentRestrictions,
      bounds,
      fields = ["geometry.location"],
    } = this.props;
    const config = {
      bounds,
      fields,
    };

    if (componentRestrictions) {
      config.componentRestrictions = componentRestrictions;
    }

    this.disableAutofill();

    this.autocomplete = new this.props.google.maps.places.Autocomplete(
      this.refs.input,
      config
    );

    this.placeSelectedEvent = this.autocomplete.addListener(
      "place_changed",
      this.onSelected.bind(this)
    );
  }

  disableAutofill() {
    // Autofill workaround adapted from https://stackoverflow.com/questions/29931712/chrome-autofill-covers-autocomplete-for-google-maps-api-v3/49161445#49161445
    if (window.MutationObserver) {
      const observerHack = new MutationObserver(() => {
        observerHack.disconnect();
        if (this.refs && this.refs.input) {
          this.refs.input.autocomplete = "disable-autofill";
        }
      });
      observerHack.observe(this.refs.input, {
        attributes: true,
        attributeFilter: ["autocomplete"],
      });
    }
  }

  componentWillUnmount() {
    if (this.placeSelectedEvent) this.placeSelectedEvent.remove();
  }

  onSelected() {
    if (this.props.onPlaceSelected && this.autocomplete) {
      this.props.onPlaceSelected(this.autocomplete.getPlace(), this.refs.input);
    }
  }

  render() {
    const {
      onPlaceSelected,
      types,
      componentRestrictions,
      bounds,
      ...rest
    } = this.props;

    return <input ref="input" {...rest} />;
  }
}

export default ReactGoogleSearchBox;
