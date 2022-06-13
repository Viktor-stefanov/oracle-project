function printEvents(events) {
  for (const event of events) {
    console.log("-".repeat(50));
    console.log("Name:".padEnd(20), event.name);
    console.log("Description:".padEnd(20), event.description);
    console.log("Valid until:".padEnd(20), event.until);
    console.log("Possible outcomes:".padEnd(20), event.outcomes.join("\n" + " ".repeat(21)));
    console.log("-".repeat(50));
    console.log("\n");
  }
}

module.exports = { printEvents };
