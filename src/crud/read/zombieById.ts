import { prisma } from "../../utils/prismaCache";

export default async function getZombieById(id: number) {
  const zombie = await prisma.zombie.findUnique({
    where: {
      id: id,
    },
  });

  return zombie;
}
