//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./DataFeed.sol";

contract Better is DataFeed {
  address payable public immutable feeAccount;

  uint public eventCount;
  uint public bidderCount;
  mapping(uint => Event) public Events; 
  mapping(uint => mapping(uint => Bidder)) public Bidders; // maps eventIDs to Bidders

  constructor() {
    eventCount = 0;
    bidderCount = 0;
    feeAccount = payable(msg.sender);
  }

  struct Bidder {
    address account;
    uint position;
    int amount;
    uint bidderID;
  }

  struct Event {
    string name;
    string description;
    address dataFeed;
    uint from;
    uint until;
    string[] outcomes;
    uint eventID;
  }

  function addEvent(string memory _eventName, string memory _description, address _dataFeed, uint _activeFrom, uint _activeUntil, string[] memory _outcomes)
  external {
    require(_outcomes.length > 1, "There must be at least 2 possibe outcomes to the event.");
    require(_activeUntil > _activeFrom, "Event's end date cannot precede it's start date.");

    setDataFeed(_eventName, _dataFeed);

    eventCount++;
    Events[eventCount] = Event(_eventName, _description, _dataFeed, _activeFrom, _activeUntil, _outcomes, eventCount);
  }

  function placeBid(uint _eventID, uint position, int amount) public payable {
    require(Events[_eventID].from != 0, "Can not bid on a non-existing event.");
    
    bidderCount++;
    Bidders[_eventID][bidderCount] = Bidder(msg.sender, position, amount, bidderCount);

    (bool success, ) = feeAccount.call{value: msg.value}("");
    require(success, "transaction failed.");
  }

  function getEvent(uint index) external view returns (Event memory) { // WHY DO I NEED THIS?
    return Events[index];
  }

  function getEventOutcome(string memory _eventName) external view returns (int) {
    return getLatestPrice(_eventName);
  }
}
