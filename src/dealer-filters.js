import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import _ from "lodash";

const DealerFilters = ({ filters, setFilter }) => {
  return (
    <>
      {filters.map((f, idx) => (
        <FilterItem key={idx}>
          <FilterInput
            key={idx}
            type="checkbox"
            checked={f.active}
            onChange={(e) => {
              setFilter(f.label, e.target.checked);
            }}
          />
          <FilterLabel onClick={(e) => setFilter(f.label, !f.active)}>
            {f.label}
          </FilterLabel>
        </FilterItem>
      ))}
    </>
  );
};

const FilterItem = styled.div`
  display: flex;
  align-items: center;
`;

const FilterLabel = styled.div`
  padding-left: 10px;
  cursor: pointer;
`;

const FilterInput = styled.input`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 20px;
  width: 20px;
  appearance: none;

  border: 1px solid #34495e;
  border-radius: 3px;
  outline: none;
  transition-duration: 0.3s;
  cursor: pointer;

  &:checked {
    background-color: black;
  }

  &:before {
    content: "X";
    color: white;
  }
`;

DealerFilters.propTypes = {
  setFilter: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired,
};

export default DealerFilters;
