import { prisma } from "../../utils/prismaCache";
import { Zombie } from "../../types/Zombie";

const MAX_ITEMS = 3;

export default async function addItem(zombieId: number, itemId: number) {
  const itemsOnZombie = await prisma.itemToZombie.findMany({
    where: {
      zombieId: zombieId,
    },
  });

  if (itemsOnZombie.length === MAX_ITEMS) {
    return `Zombie already has ${MAX_ITEMS} items, first delete something`;
  }

  const addedItem = await prisma.itemToZombie.create({
    data: {
      zombieId: zombieId,
      itemId: itemId,
    },
  });

  return addedItem;
}
