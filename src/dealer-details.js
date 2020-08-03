import React from "react";
import styled from "styled-components";
import ReactGA from "react-ga";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faDirections } from "@fortawesome/free-solid-svg-icons";

const createDealerDirectionsURL = (dealer) => {
  const dealerFieldsToIncludeInQuery = [
    "addr",
    "name",
    "city",
    "state",
    "country",
  ];

  const dealerLocationQuery = encodeURI(
    dealerFieldsToIncludeInQuery.map((param) => dealer[param] || "").join(" ")
  );
  return `https://www.google.com/maps/dir/?api=1&destination=${dealerLocationQuery}`;
};

const dealerConversionEvent = (dealer, action) => {
  ReactGA.event({
    category: "Dealer Locator",
    action: action,
    label: _.get(dealer, "name"),
  });
};

const DealerDetails = ({ dealer, close, closeButton, websiteButton }) => {
  if (!dealer) {
    return <div />;
  }

  return (
    <div>
      <CloseDealerButton>
       <div onClick={close}>{closeButton}</div>
      </CloseDealerButton>
      <DealerTextArea>
        <DealerName>{dealer.name}</DealerName>
        <Details>
          <DealerDetailRow>
            <div>{dealer.addr1}</div>
            <div>{`${dealer.city} ${dealer.city ? "," : ""} ${dealer.state} ${
              dealer.zip
            } ${dealer.country}`}</div>
          </DealerDetailRow>

          <DealerDetailRow>
            <DealerContact>
              {dealer.phone && (
                <a
                  href={`tel:${dealer.phone}`}
                  onClick={() => dealerConversionEvent(dealer, "Phone Clicked")}
                >
                  <Icon icon={faPhone} /> {dealer.phone}
                </a>
              )}
              <a
                href={createDealerDirectionsURL(dealer)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  dealerConversionEvent(dealer, "Directions Clicked")
                }
              >
                <Icon icon={faDirections} /> Get Directions
              </a>
            </DealerContact>
          </DealerDetailRow>
          <Website>
            {dealer.website &&
              React.cloneElement(websiteButton, {
                onClick: dealerConversionEvent(dealer, "Website Clicked"),
                callToActionLink: dealer.website,
              })}
          </Website>
        </Details>
      </DealerTextArea>
    </div>
  );
};

const Details = styled.div`
  padding-right: 40px;
`;

const DealerContact = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  > * {
    margin-right: 10px;
  }

  > :last-child {
    margin-right: 0px;
  }

  max-width: 300px;
`;

const Icon = styled(FontAwesomeIcon)`
  margin-left: 5px;
`;

const CloseDealerButton = styled.div`
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  justify-content: flex-end;
`;

const DealerTextArea = styled.div`
  padding-right: 20px;
`;

const DealerName = styled.h1``;

const DealerDetailRow = styled.div`
  margin-top: 20px;
`;

const Website = styled(DealerDetailRow)`
  margin-top: 50px;
  display: flex;
  justify-content: flex-start;
  box-sizing: content-box;
  max-width: 300px;
`;

export default DealerDetails;
