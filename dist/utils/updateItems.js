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
const node_cron_1 = __importDefault(require("node-cron"));
const moment_1 = __importDefault(require("moment"));
const prismaCache_1 = require("./prismaCache");
const ITEMS_URL = "https://zombie-items-api.herokuapp.com/api/items";
const FILE_PATH = __dirname + "/../../src/assets/items.json";
// Check if file exist, and if the timestamp is from some previous day
function checkIfUpdateNeeded() {
    return __awaiter(this, void 0, void 0, function* () {
        const fileExist = fs_1.default.existsSync(FILE_PATH);
        if (!fileExist) {
            yield getItems();
            return;
        }
        // Checking timestamp
        const jsonString = fs_1.default.readFileSync(FILE_PATH, "utf-8");
        const parsedJson = JSON.parse(jsonString);
        const timestamp = parsedJson.timestamp;
        const itemsLastRefreshed = moment_1.default.unix(timestamp / 1000).format("MM/DD/YYYY");
        const todaysDate = (0, moment_1.default)(new Date()).format("MM/DD/YYYY");
        if (itemsLastRefreshed !== todaysDate) {
            yield getItems();
            return;
        }
    });
}
// Get items
function getItems() {
    return __awaiter(this, void 0, void 0, function* () {
        // If the file does not exist || it's from previous day fetch it
        let { data } = yield axios_1.default.get(ITEMS_URL);
        data.items.forEach((item) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield prismaCache_1.prisma.item.create({
                    data: item,
                });
            }
            catch (e) { }
        }));
        let stringifiedData = JSON.stringify(data);
        fs_1.default.writeFile(FILE_PATH, stringifiedData, function (err) {
            if (err)
                throw err;
            console.log("It's saved!");
        });
    });
}
// Updates only if it's different day or it's 00:00 (cron)
node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    yield getItems();
}));
checkIfUpdateNeeded();
