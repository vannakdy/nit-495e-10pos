const fs = require("fs/promises");
exports.logError = async (controller, message_error, res) => {
  try {
    // const timestamp = moment().format("DD/MM/YYYY HH:mm:ss"); // Use 'moment' for formatted timestamp
    const path = "./logs/" + controller + ".txt";
    const logMessage = message_error + "\n";
    await fs.appendFile(path, logMessage);
  } catch (error) {
    console.error("Error writing to log file:", error);
  }
  res.status(500).send("Internal Server Error!");
};
