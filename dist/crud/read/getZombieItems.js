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
function getZombieItems(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const items = yield prismaCache_1.prisma.itemToZombie.findMany({
            where: {
                zombieId: id,
            },
        });
        let formattedItems = [];
        for (let itemToZombie of items) {
            let item = yield prismaCache_1.prisma.item.findUnique({
                where: {
                    id: itemToZombie.itemId,
                },
            });
            formattedItems.push(item);
        }
        return formattedItems;
    });
}
exports.default = getZombieItems;
