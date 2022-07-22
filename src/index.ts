import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import createZombie from "./crud/create/zombie";
import getZombieById from "./crud/read/zombieById";
import deleteZombieById from "./crud/delete/zombieById";
import updateZombieById from "./crud/update/zombieById";
import { Zombie } from "./types/Zombie";
import getItems from "./crud/read/getItems";
import addItem from "./crud/create/addItem";
import getZombieItems from "./crud/read/getZombieItems";
import "./utils/updateItems";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get("/zombie/:id", async (req: Request, res: Response) => {
  if (isNaN(parseInt(req.params.id))) {
    return res.send("Wrong id");
  }

  let zombieId = parseInt(req.params.id);
  let zombie = await getZombieById(zombieId);

  res.send(zombie);
});

app.post("/create/zombie", async (req: Request, res: Response) => {
  // Zombie just needs a name,
  // we extract it later so even if somebody would provide more properties,
  // it doesn't change anything
  if (!req.body.name) {
    return res.send("Please provide zombie name");
  }

  await createZombie(req.body as Zombie);

  res.send("Created");
});

app.delete("/delete/zombie/:id", async (req: Request, res: Response) => {
  if (isNaN(parseInt(req.params.id))) {
    return res.send("Wrong id");
  }

  // Non-existant zombie handled
  let zombieId = parseInt(req.params.id);
  let zombie = await deleteZombieById(zombieId);

  res.send(zombie);
});

app.put("/update/zombie/:id", async (req: Request, res: Response) => {
  if (isNaN(parseInt(req.params.id))) {
    return res.send("Wrong id");
  }

  if (!req.body) {
    return res.send("Please provide zombie name");
  }

  // Non-existant zombie handled
  let zombieId = parseInt(req.params.id);
  let zombie = await updateZombieById(zombieId, req.body as Zombie);

  res.send(zombie);
});

app.get("/items", async (req: Request, res: Response) => {
  let items = await getItems();

  res.send(items);
});

app.get("/zombie/:id/items", async (req: Request, res: Response) => {
  let items = await getZombieItems(parseInt(req.params.id));

  res.send(items);
});

app.post("/addItem", async (req: Request, res: Response) => {
  let response = await addItem(req.body.zombieId, req.body.itemId);

  res.send(response);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
