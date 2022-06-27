//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./DataFeed.sol";

contract Better is DataFeed {
    address payable public immutable feeAccount;

    uint256 public eventCount;
    Event[] public Events;
    mapping(uint256 => Bidder[]) public Bidders; // maps eventIDs to Bidders

    constructor() {
        eventCount = 0;
        feeAccount = payable(msg.sender);
    }

    struct Bidder {
        address account;
        bool bid;
        int256 amount;
    }

    struct Event {
        string name;
        string description;
        string assetName;
        uint256 closeDate;
        uint256 closeBidsDate;
        int256 startPrice;
        int256 priceChangeGoal;
        address oracle;
        uint256 eventID;
    }

    function addEvent(
        string memory _eventName,
        string memory _description,
        string memory _assetName,
        uint256 _closeDate,
        uint256 _closeBidsDate,
        int256 _goal,
        address _oracle
    ) public {
        setDataFeed(_eventName, _oracle);

        int256 startPrice = getLatestPrice(_eventName);
        eventCount++;
        Events.push(
            Event(
                _eventName,
                _description,
                _assetName,
                _closeDate,
                _closeBidsDate,
                startPrice,
                _goal,
                _oracle,
                eventCount
            )
        );
    }

    function payWinner(address payable winner) public payable {
        require(msg.sender == feeAccount, "Only owner can pay out to winners.");
        (bool success, bytes memory result) = winner.call{value: msg.value}("");
        require(success, "Transaction failed");
    }

    function placeBid(uint256 _eventID, bool bid) public payable {
        require(
            _eventID - 1 >= 0 && _eventID - 1 < Events.length,
            "Can't bid on a non-existing event."
        );
        require(
            Events[_eventID - 1].closeBidsDate > block.timestamp,
            "Bids for this event are closed."
        );

        Bidders[_eventID - 1].push(Bidder(msg.sender, bid, int256(msg.value)));

        (bool success, ) = feeAccount.call{value: msg.value}("");
        require(success, "transaction failed.");
    }

    function closeEvent(uint256 _eventID) public returns (Bidder[] memory) {
        require(
            _eventID - 1 >= 0 && _eventID - 1 < Events.length,
            "Can't close a non-existing event."
        );

        Events[_eventID - 1] = Events[Events.length - 1];
        Events.pop();
        eventCount--;
        return Bidders[_eventID - 1];
    }

    function getEvents() external view returns (Event[] memory) {
        return Events;
    }

    function getEvent(uint256 _eventID) public view returns (Event memory) {
        require(
            _eventID - 1 >= 0 && _eventID - 1 < eventCount,
            "Event doesn't exist."
        );
        return Events[_eventID - 1];
    }

    function getEventOutcome(string memory _eventName)
        public
        view
        returns (int256)
    {
        return getLatestPrice(_eventName);
    }
}
