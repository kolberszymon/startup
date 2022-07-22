import axios from "axios";
import fs from "fs";
import cron from "node-cron";
import moment from "moment";

const PRICES_URL = "http://api.nbp.pl/api/exchangerates/tables/C/today/";
const FILE_PATH = __dirname + "/../../src/assets/prices.json";

// Check if file exist, and if the timestamp is from some previous day
async function checkIfUpdateNeeded() {
  const fileExist = fs.existsSync(FILE_PATH);

  if (!fileExist) {
    await getPrices();
    return;
  }

  // Checking timestamp
  const jsonString: string = fs.readFileSync(FILE_PATH, "utf-8");
  const parsedJson = JSON.parse(jsonString);

  const itemsLastRefreshed = moment(
    parsedJson.tradingDate,
    "YYYY-MM-DD"
  ).format("MM/DD/YYYY");
  const todaysDate = moment(new Date()).format("MM/DD/YYYY");

  if (itemsLastRefreshed !== todaysDate) {
    await getPrices();
    return;
  }
}

// Get items
async function getPrices() {
  // If the file does not exist || it's from previous day fetch it

  let { data } = await axios.get(PRICES_URL);

  let stringifiedData = JSON.stringify(data[0]);

  fs.writeFile(FILE_PATH, stringifiedData, function (err) {
    if (err) throw err;
    console.log("It's saved!");
  });
}

// Updates only if it's different day or it's 00:00 (cron)

// cron.schedule("0 0 * * *", async () => {
//   await getPrices();
// });

checkIfUpdateNeeded();
