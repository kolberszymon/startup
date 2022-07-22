"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
const PRICES_URL = "http://api.nbp.pl/api/exchangerates/tables/C/today/";
const FILE_PATH = __dirname + "/../../src/assets/prices.json";
// Check if file exist, and if the timestamp is from some previous day
function checkIfUpdateNeeded() {
    return __awaiter(this, void 0, void 0, function* () {
        const fileExist = fs_1.default.existsSync(FILE_PATH);
        if (!fileExist) {
            yield getPrices();
            return;
        }
        // Checking timestamp
        const jsonString = fs_1.default.readFileSync(FILE_PATH, "utf-8");
        const parsedJson = JSON.parse(jsonString);
        const itemsLastRefreshed = (0, moment_1.default)(parsedJson.tradingDate, "YYYY-MM-DD").format("MM/DD/YYYY");
        const todaysDate = (0, moment_1.default)(new Date()).format("MM/DD/YYYY");
        if (itemsLastRefreshed !== todaysDate) {
            yield getPrices();
            return;
        }
    });
}
// Get items
function getPrices() {
    return __awaiter(this, void 0, void 0, function* () {
        // If the file does not exist || it's from previous day fetch it
        let { data } = yield axios_1.default.get(PRICES_URL);
        let stringifiedData = JSON.stringify(data[0]);
        fs_1.default.writeFile(FILE_PATH, stringifiedData, function (err) {
            if (err)
                throw err;
            console.log("It's saved!");
        });
    });
}
// Updates only if it's different day or it's 00:00 (cron)
// cron.schedule("0 0 * * *", async () => {
//   await getPrices();
// });
checkIfUpdateNeeded();
