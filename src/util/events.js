const { getCurrentEvents } = require("./contracts");

function printEvents(events) {
  for (const event of events) {
    console.log("-".repeat(50));
    console.log(`Event ID: #${event.ID}`);
    console.log("Name:".padEnd(20), event.name);
    console.log("Description:".padEnd(20), event.description);
    console.log("Valid until:".padEnd(20), event.until);
    console.log("Possible outcomes:".padEnd(20), event.outcomes.join("\n" + " ".repeat(21)));
    console.log("Oracle address:".padEnd(20), event.oracleAddress);
    console.log("-".repeat(50));
    console.log("\n");
  }
}

async function getEvent(ID, name) {
  const events = await getCurrentEvents();
  for (let event of events) {
    if (event.ID === ID && event.name.toLowerCase() === name.toLowerCase()) {
      return event;
    }
  }

  return null;
}

module.exports = { printEvents, getEvent };
