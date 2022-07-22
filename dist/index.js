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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const zombie_1 = __importDefault(require("./crud/create/zombie"));
const zombieById_1 = __importDefault(require("./crud/read/zombieById"));
const zombieById_2 = __importDefault(require("./crud/delete/zombieById"));
const zombieById_3 = __importDefault(require("./crud/update/zombieById"));
const getItems_1 = __importDefault(require("./crud/read/getItems"));
const addItem_1 = __importDefault(require("./crud/create/addItem"));
const getZombieItems_1 = __importDefault(require("./crud/read/getZombieItems"));
require("./utils/updateItems");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(body_parser_1.default.json());
app.get("/zombie/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (isNaN(parseInt(req.params.id))) {
        return res.send("Wrong id");
    }
    let zombieId = parseInt(req.params.id);
    let zombie = yield (0, zombieById_1.default)(zombieId);
    res.send(zombie);
}));
app.post("/create/zombie", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Zombie just needs a name,
    // we extract it later so even if somebody would provide more properties,
    // it doesn't change anything
    if (!req.body.name) {
        return res.send("Please provide zombie name");
    }
    yield (0, zombie_1.default)(req.body);
    res.send("Created");
}));
app.delete("/delete/zombie/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (isNaN(parseInt(req.params.id))) {
        return res.send("Wrong id");
    }
    // Non-existant zombie handled
    let zombieId = parseInt(req.params.id);
    let zombie = yield (0, zombieById_2.default)(zombieId);
    res.send(zombie);
}));
app.put("/update/zombie/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (isNaN(parseInt(req.params.id))) {
        return res.send("Wrong id");
    }
    if (!req.body) {
        return res.send("Please provide zombie name");
    }
    // Non-existant zombie handled
    let zombieId = parseInt(req.params.id);
    let zombie = yield (0, zombieById_3.default)(zombieId, req.body);
    res.send(zombie);
}));
app.get("/items", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let items = yield (0, getItems_1.default)();
    res.send(items);
}));
app.get("/zombie/:id/items", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let items = yield (0, getZombieItems_1.default)(parseInt(req.params.id));
    res.send(items);
}));
app.post("/addItem", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield (0, addItem_1.default)(req.body.zombieId, req.body.itemId);
    res.send(response);
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
