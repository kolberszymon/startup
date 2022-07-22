import { Item } from "../../types/Item";
import { prisma } from "../../utils/prismaCache";

export default async function getZombieItems(id: number) {
  const items: ItemToZombie[] = await prisma.itemToZombie.findMany({
    where: {
      zombieId: id,
    },
  });

  let formattedItems: Item[] = [];

  for (let itemToZombie of items) {
    let item = await prisma.item.findUnique({
      where: {
        id: itemToZombie.itemId,
      },
    });

    formattedItems.push(item);
  }

  return formattedItems;
}
