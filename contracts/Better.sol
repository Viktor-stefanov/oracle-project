//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./DataFeed.sol";

contract Better is DataFeed {
  address payable public immutable feeAccount;

  uint public eventCount;
  Event[] public Events; 
  mapping(uint => Bidder[]) public Bidders; // maps eventIDs to Bidders

  constructor() {
    eventCount = 0;
    feeAccount = payable(msg.sender);
  }

  struct Bidder {
    address account;
    bool bid;
    int amount;
  }

  struct Event {
    string name;
    string description;
    string assetName;
    uint closeDate;
    uint closeBidsDate;
    int startPrice;
    int priceChangeGoal;
    address oracle;
    uint eventID;
  }

  function addEvent(string memory _eventName, string memory _description, string memory _assetName, uint _closeDate, uint _closeBidsDate, int _goal, address _oracle) public {
    setDataFeed(_eventName, _oracle);

    int startPrice = getLatestPrice(_eventName);
    eventCount++;
    Events.push(Event(_eventName, _description, _assetName, _closeDate, _closeBidsDate, startPrice, _goal, _oracle, eventCount));
  }

  function payWinner(address payable winner) public payable {
    require(msg.sender == feeAccount, "Only owner can pay out to winners.");
    (bool success, bytes memory result) = winner.call{value: msg.value}("");
    require(success, "Transaction failed");
  }

  function placeBid(uint _eventID, bool bid) public payable {
    require(_eventID - 1 >= 0 && _eventID - 1 < Events.length, "Can't bid on a non-existing event.");
    require(Events[_eventID - 1].closeBidsDate > block.timestamp, "Bids for this event are closed.");
    
    Bidders[_eventID - 1].push(Bidder(msg.sender, bid, int(msg.value)));

    (bool success, ) = feeAccount.call{value: msg.value}("");
    require(success, "transaction failed.");
  }

  function closeEvent(uint _eventID) public returns (Bidder[] memory) {
    require(_eventID - 1 >= 0 && _eventID - 1 < Events.length, "Can't close a non-existing event.");

    Events[_eventID - 1] = Events[Events.length - 1];
    Events.pop();
    eventCount--;
    return Bidders[_eventID - 1]; 
  }

  function getEvents() external view returns (Event[] memory) { 
    return Events;
  }

  function getEvent(uint _eventID) public view returns (Event memory) {
    require(_eventID - 1 >= 0 && _eventID - 1 < eventCount, "Event doesn't exist.");
    return Events[_eventID - 1];
  }

  function getEventOutcome(string memory _eventName) public view returns (int) {
    return getLatestPrice(_eventName);
  }
}
