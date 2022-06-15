const { getCurrentEvents } = require("./contracts");

function printEvents(events) {
  for (const event of events) {
    console.log("-".repeat(50));
    console.log(`Event ID: #${event.ID}`);
    console.log("Name:".padEnd(20), event.name);
    console.log("Description:".padEnd(20), event.description);
    console.log("Asset name:".padEnd(20), event.assetName);
    console.log("Price change goal:".padEnd(20), event.priceGoal);
    console.log("Bidding closed from:".padEnd(20), event.closeBidsDate);
    console.log("Event will finish:".padEnd(20), event.closeDate);
    console.log("Oracle address:".padEnd(20), event.oracle);
    console.log("-".repeat(50));
    console.log("\n");
  }
}

module.exports = { printEvents};
