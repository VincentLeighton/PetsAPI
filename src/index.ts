import express, { Request, Response } from "express";
import fs from "fs";
import { randomUUID } from "crypto";

const app = express();
const port = 3000;

interface Pet {
  id: string;
  petName: string;
  owner: string;
  imageUrl?: string;
  favoriteFood?: string;
  dateCreated: Date;
  isFed: boolean;
}

const pets: Pet[] = [
  {
    id: "1",
    petName: "Buddy",
    owner: "Alice",
    imageUrl: "https://example.com/buddy.jpg",
    favoriteFood: "Bone",
    dateCreated: new Date("2025-04-24"),
    isFed: true,
  },
  {
    id: "2",
    petName: "Mittens",
    owner: "Bob",
    imageUrl: "https://example.com/mittens.jpg",
    favoriteFood: "Fish",
    dateCreated: new Date("2025-04-24"),
    isFed: false,
  },
  {
    id: "3",
    petName: "Charlie",
    owner: "Carol",
    imageUrl: "https://example.com/charlie.jpg",
    favoriteFood: "Carrot",
    dateCreated: new Date("2025-04-24"),
    isFed: true,
  },
];

let icon: Buffer | null = null;
let notFound: Buffer | null = null;
try {
  icon = fs.readFileSync("assets/computer_monitor_18859.ico");
  notFound = fs.readFileSync("src/PageNotFound.html");
} catch (err) {
  console.log("Server unable to load required asset files. =(");
  console.error(err);
}

app.use(express.json());

app.options("*any", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  res.send();
});

app.options("/pets", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  res.send();
});

app.options("/pets/:id", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  res.send();
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/pets", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  res.json(pets);
});

app.post("/pets", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");

  if (!req.body) {
    res.status(400).json({ error: "No data provided" });
    return;
  }
  const { petName, owner, imageUrl, favoriteFood } = req.body;

  if (!petName || !owner) {
    res.status(400).json({ error: "Invalid pet data" });
    return;
  }

  const newPet: Pet = {
    id: randomUUID(),
    petName,
    owner,
    imageUrl,
    favoriteFood,
    dateCreated: new Date(),
    isFed: false,
  };
  pets.push(newPet);

  res.status(201).json(newPet);
});

app.patch("/pets/:id", (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "*");
  const { id } = req.params;
  const { isFed } = req.body;

  if (typeof isFed !== "boolean") {
    res.status(400).json({ error: "Invalid isFed value" });
    return;
  }

  const pet = pets.find((pet) => pet.id === id);

  if (!pet) {
    res.status(404).json({ error: "Pet not found" });
    return;
  }

  pet.isFed = isFed;
  res.status(200).json(pet);
});

app.delete("/pets/:id", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  const { id } = req.params;
  const petIndex = pets.findIndex((pet) => pet.id === id);

  if (petIndex === -1) {
    res.status(404).json({ error: "Pet not found" });
    return;
  }

  const deletedPet = pets.splice(petIndex, 1);
  res.status(200).json(deletedPet[0]);
});

app.get("/favicon.ico", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "image/x-icon");
  console.log("favicon.ico requested");
  res.status(200).send(icon);
});

//!! IMPORTANT Wildcard goes last
app.get("/*notfound", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(notFound);
});

if (icon && notFound) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
