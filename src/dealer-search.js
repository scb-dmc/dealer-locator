import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { GoogleApiWrapper } from "google-maps-react";

import AutoCompleteSearch from "./autocomplete";

class DealerSearch extends React.Component {
  static propTypes = {
    goToSearchLocation: PropTypes.func,
  };
  constructor(props) {
    super(props);

    this.state = {
      searchValue: "",
    };
  }

  onChange = (e) => {
    this.setState({ searchValue: e.target.value });
  };

  render() {
    return (
        <>
        <SearchWrapper>
             <StyledSearchBar
                 placeholder={this.props.placeholder ? this.props.placeholder : 'Find a dealer'}
                 types={["(cities)"]}
                 searchBarStyles={this.props.searchBarStyles}
                 onChange={this.onChange}
                 google={this.props.google}
                 onPlaceSelected={(places) => {
                     if (places.length > 0) {
                         return this.props.goToMapLocation({
                             lat: places[0].geometry.location.lat(),
                             lng: places[0].geometry.location.lng(),
                         });
                     }
                 }}
             />
             <SearchBtn
                 aria-label="search button"
                 onClick={() => this.props.goToSearchLocation(this.state.searchValue)}
             >
                 {this.props.searchIcon ? this.props.searchIcon :
                 <SearchIcon icon={faSearch} /> }
             </SearchBtn>
        </SearchWrapper>
            <div onClick={this.props.dealerFilterEvent}>
                {this.props.dealerFilterButton}
            </div>
        </>
    );
  }
}

const MakeLoader = (props) => {
    return () => {
        return(
            <SearchWrapper>
                <SearchBarLoading searchBarStyles={props.searchBarStyles}>Search Options Loading...</SearchBarLoading>
                <SearchBtn aria-label="search button">
                    { props.searchIcon ? props.searchIcon :
                    <SearchIcon icon={faSearch} /> }
                </SearchBtn>
            </SearchWrapper>
        )
    }
}

const SearchWrapper = styled.div`
  display: flex;
  flex-flow: row;
  position: relative;
  left: 1rem;
`;

const defaultSearchBarStyles = `
  border: 0;
  border-bottom: 1px solid rgba(0, 0, 0, .12);
  padding: 10px 30px 10px 10px;
  margin-bottom: 15px;
  width: 100%;
  font-size: 14px;
`;

const SearchBarLoading = styled.div`
  ${defaultSearchBarStyles};
  ${props => props.searchBarStyles}
`;

const StyledSearchBar = styled(AutoCompleteSearch)`
  ${defaultSearchBarStyles};
  ${props => props.searchBarStyles}
`;

const SearchBtn = styled.button`
  border: 0;
  background-color: transparent;
  position: relative;
  bottom: 6px;
  right: 40px;
`;

const SearchIcon = styled(FontAwesomeIcon)`
  font-size: 20px;
  color: #d4d4d4;

  &:hover {
    cursor: pointer;
  }
`;

export default GoogleApiWrapper((props) => ({
  LoadingContainer: MakeLoader(props),
  apiKey: props.apiKey,
}))(DealerSearch);
