# dealer-locator

dealer-locator is a React component for displaying a list of dealers, along with
a Google Maps map with the dealers.

## Usage

```jsx
import React from "react";
import DealerLocator from "@scb-dmc/dealer-locator";

import Layout from "../layout";
import dealers from "./dealers.json";
import Border from "../atoms/border";
import CloseButton from "../atoms/close-button";
import ReserveIcon from "../../images/ReserveDealerIconRed.svg";
import Button from "../atoms/button";

const ReserveDealerLocator = props => {
  return (
    <Layout pageContext={props.pageContext} omitFooter={false}>
      <DealerLocator
        dealers={dealers}
        border={<Border width="85%" />}
        selectedDealerIcon={ReserveIcon}
        closeDealerButton={<CloseButton size="12px" />}
        dealerWebsiteButton={<Button title="Website" externalLink={true} />}
        dealerDetailsComponent={DealerDetails}
        dealerListComponent={DealerList}
      />
    </Layout>
  );
};

export default ReserveDealerLocator;
```

dealer-locator contains un-transpiled ES6 code, so it is necessary to configure
Webpack to transpile dealer-locator. In a Gatsby project, this can be accomplished
by adding the following to `gatsby-node.js`:

```js
// Transpile ES6 syntax in @scb-dmc folder in node_modules
exports.onCreateWebpackConfig = ({ actions, loaders, getConfig }) => {
  const config = getConfig();

  config.module.rules = [
    ...config.module.rules.filter(
      rule => String(rule.test) !== String(/\.jsx?$/)
    ),
    {
      ...loaders.js(),
      test: /\.jsx?$/,
      exclude: modulePath =>
        /node_modules/.test(modulePath) &&
        !/node_modules\/(@scb-dmc)/.test(modulePath),
    },
  ];

  actions.replaceWebpackConfig(config);
};
```

### Props

* `dealers`: An array of dealers, which look like the following:
  ```json
  {
    "id": "69011",
    "name": "Ballwin Cycles",
    "phone": "(636) 391-2666",
    "addr1": "15340 Manchester Rd",
    "addr2": "",
    "city": "Ellisville",
    "state": "MO",
    "country": "USA",
    "zip": "63011",
    "location": {
      "lat": 38.5924,
      "lng": -90.5599
    },
    "website": ""
  },
  ```
* `border`: A React element to act as the border between "dealers on map" and
  "dealers off map"
* `selectedDealerIcon`: A string, typically from an imported SVG, that will be built
  into the map icon for the currently selected dealer
* `closeDealerButton`: A React element to act as the close dealer button. *An `onClick`
  handler does not need to be specified and the appropriate handler will be added automatically.*
* `dealerWebsiteButton`: A React element to act as the button linking to the dealer's website.
  *An `onClick` handler does not need to be specified and the appropirate handler will be added
  automatically*.
* `dealerDetailsComponent`: A React component to extend the dealer details flyout card.
* `dealerListComponent`: A React component to extend the dealer list.
