//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./PriceConsumer.sol";

contract Better is ERC20 {
  uint public eventCount;
  mapping(uint => Event) public Events;

  constructor() ERC20("Better", "BET") {
    eventCount = 0;
  }

  struct Event {
    string name;
    string description;
    uint from;
    uint until;
    string[] outcomes;
  }

  function addEvent(string memory _name, string memory _description, uint _activeFrom, uint _activeUntil, string[] memory _outcomes)
  external {
    require(_outcomes.length > 1, "There must be at least 2 possibe outcomes to the event.");
    require(_activeUntil > _activeFrom, "Event's end date cannot precede it's start date.");
    
    eventCount++;
    Events[eventCount] = Event(_name, _description, _activeFrom, _activeUntil, _outcomes);
  }

  function getEvent(uint index) external view returns (Event memory) { // WHY DO I NEED THIS?
    return Events[index];
  }
}
