import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import _ from "lodash";

const DealerFilters = ({ filters, setFilter }) => {
  return (
    <>
      <h4>Dealer Filters</h4>
      {filters.map((f, idx) => (
        <div key={idx}>
          {f.label}
          <input
            key={idx}
            type="checkbox"
            checked={f.active}
            onChange={(e) => {
              setFilter(f.label, e.target.checked);
            }}
          />
        </div>
      ))}
    </>
  );
};

DealerFilters.propTypes = {
  setFilter: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired,
};

export default DealerFilters;
