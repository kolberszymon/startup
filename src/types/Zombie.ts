import { Item } from "./Item";

export type Zombie = {
  id?: number; // id is optional here, because it will be automatically inserted
  name: string;
  creationDate?: Date;
  items: Item[];
};
