import { Zombie } from "../../types/Zombie";
import { prisma } from "../../utils/prismaCache";

export default async function updateZombieById(id: number, zombie: Zombie) {
  try {
    var updatedZombie = await prisma.zombie.update({
      where: {
        id: id,
      },
      data: {
        name: zombie.name,
      },
    });
  } catch (e) {
    return "Zombie doesn't exist";
  }

  return updatedZombie;
}
