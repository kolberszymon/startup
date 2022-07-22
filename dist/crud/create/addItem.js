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
Object.defineProperty(exports, "__esModule", { value: true });
const prismaCache_1 = require("../../utils/prismaCache");
const MAX_ITEMS = 3;
function addItem(zombieId, itemId) {
    return __awaiter(this, void 0, void 0, function* () {
        const itemsOnZombie = yield prismaCache_1.prisma.itemToZombie.findMany({
            where: {
                zombieId: zombieId,
            },
        });
        if (itemsOnZombie.length === MAX_ITEMS) {
            return `Zombie already has ${MAX_ITEMS} items, first delete something`;
        }
        const addedItem = yield prismaCache_1.prisma.itemToZombie.create({
            data: {
                zombieId: zombieId,
                itemId: itemId,
            },
        });
        return addedItem;
    });
}
exports.default = addItem;
