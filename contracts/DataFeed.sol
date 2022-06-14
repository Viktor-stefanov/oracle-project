//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract DataFeed {
  mapping(string => AggregatorV3Interface) public priceFeeds; // maps event's name to it's datafeed

  function setDataFeed(string memory _eventName, address _dataFeed) public {
    priceFeeds[_eventName] = AggregatorV3Interface(_dataFeed);
  }

  function getDataFeed(string memory _eventName) public view returns (AggregatorV3Interface) {
    return priceFeeds[_eventName];
  }

  function getLatestPrice(string memory _eventName) public view returns (int) {
    AggregatorV3Interface chosenPriceFeed = priceFeeds[_eventName]; 
    (
      /*uint80 roundID*/,
      int price,
      /*uint startedAt*/,
      /*uint timeStamp*/,
      /*uint80 answeredInRound*/
    ) = chosenPriceFeed.latestRoundData();     

    return price;
  }
}
