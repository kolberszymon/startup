import { prisma } from "../../utils/prismaCache";

export default async function getItems() {
  const items = await prisma.item.findMany();

  return items;
}
