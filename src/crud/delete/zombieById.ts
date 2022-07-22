import { prisma } from "../../utils/prismaCache";

export default async function deleteZombieById(id: number) {
  try {
    var zombie = await prisma.zombie.delete({
      where: {
        id: id,
      },
    });
  } catch (e) {
    return "Zombie doesn't exist";
  }

  return zombie;
}
