//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract DataFeed {
  mapping(string => AggregatorV3Interface) internal priceFeeds;

  function setDataFeedAddress(string memory symbol, address dfAddress) external {
    priceFeeds[symbol] = AggregatorV3Interface(dfAddress);
  }

  function getLatestPrice(string memory symbol) external returns (int) {
    //require(priceFeeds[symbol], "Price feed for this symbol does not exist.");

    if (priceFeeds[symbol]) {}

    AggregatorV3Interface chosenPriceFeed = priceFeeds[symbol];
    (
      /*uint80 roundID*/,
      int price,
      /*uint startedAt*/,
      /*uint timeStamp*/,
      /*uint80 answeredInRound*/
    ) = chosenPriceFeed.latestRoundData();     

    return price;
  }

  function memcmp(bytes memory a, bytes memory b) internal pure returns (bool) {
    return (a.length == b.length) && (keccak256(a) == keccak256(b));
  }

  function strcmp(string memory a, string memory b) internal pure returns (bool) {
    return memcmp(bytes(a), bytes(b));
  }
}
