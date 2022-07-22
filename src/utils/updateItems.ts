import axios from "axios";
import fs from "fs";
import cron from "node-cron";
import moment from "moment";
import { prisma } from "./prismaCache";
import { Item } from "../types/Item";
import { v4 as uuidv4 } from "uuid";

const ITEMS_URL = "https://zombie-items-api.herokuapp.com/api/items";
const FILE_PATH = __dirname + "/../../src/assets/items.json";

// Check if file exist, and if the timestamp is from some previous day
async function checkIfUpdateNeeded() {
  const fileExist = fs.existsSync(FILE_PATH);

  if (!fileExist) {
    await getItems();
    return;
  }

  // Checking timestamp
  const jsonString: string = fs.readFileSync(FILE_PATH, "utf-8");
  const parsedJson: Items = JSON.parse(jsonString);

  const timestamp = parsedJson.timestamp;
  const itemsLastRefreshed = moment.unix(timestamp / 1000).format("MM/DD/YYYY");
  const todaysDate = moment(new Date()).format("MM/DD/YYYY");

  if (itemsLastRefreshed !== todaysDate) {
    await getItems();
    return;
  }
}

// Get items
async function getItems() {
  // If the file does not exist || it's from previous day fetch it

  let { data } = await axios.get(ITEMS_URL);

  data.items.forEach(async (item: Item) => {
    try {
      await prisma.item.create({
        data: item,
      });
    } catch (e) {}
  });

  let stringifiedData = JSON.stringify(data);

  fs.writeFile(FILE_PATH, stringifiedData, function (err) {
    if (err) throw err;
    console.log("It's saved!");
  });
}

// Updates only if it's different day or it's 00:00 (cron)

cron.schedule("0 0 * * *", async () => {
  await getItems();
});

checkIfUpdateNeeded();
