import { prisma } from "../../utils/prismaCache";
import { Zombie } from "../../types/Zombie";

export default async function createZombie(zombie: Zombie) {
  const createdZombie = await prisma.zombie.create({
    data: {
      name: zombie.name,
    },
  });

  console.log(createdZombie);
}
