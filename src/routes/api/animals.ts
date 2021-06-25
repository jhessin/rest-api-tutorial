import { Router } from "express";
import { UpdateQuery } from "mongoose";
import { auth } from "../../config/passport";
import { Animal, IAnimal, User } from "../../models";

const router = Router();

router.get("/", auth, (req, res) => {
  Animal.find({ owner: req.user._id })
    .then((animals) => res.send({ animals }))
    .catch((err) => res.status(500).send({ err }));
});

router.get("/all", auth, (req, res) => {
  Animal.find({})
    .then((animals) => res.send({ animals }))
    .catch((err) => res.status(500).send({ err }));
});

router.delete("/:id", auth, (req, res) => {
  const { id } = req.params;
  Animal.deleteOne({ _id: id, owner: req.user._id })
    .then(() => res.status(204).send())
    .catch((err) => res.status(400).send({ err }));
});

router.post("/", auth, (req, res) => {
  const { type, name } = req.body;
  if (!type || !name) {
    return res.status(400).send("Type and Name are required");
  }

  const newAnimal = new Animal({
    name,
    type,
    owner: req.user._id,
  });

  newAnimal.save().then((model) => {
    User.findByIdAndUpdate(req.user._id, {
      $push: { animals: model._id },
    })
      .then(() => res.send(model))
      .catch((err) => res.status(400).send({ err }));
  });
});

router.put("/:id", auth, (req, res) => {
  const { id } = req.params;
  const { name, type, owner } = req.body;

  if (!name || !type) {
    return res.status(400).send({ err: "name and type are required" });
  }

  Animal.findByIdAndUpdate(
    id,
    {
      name,
      type,
      owner,
    },
    { new: true }
  )
    .then((updatedAnimal) => {
      return res.send(updatedAnimal);
    })
    .catch((err) => res.status(400).send({ err }));
});

router.patch("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { name, type, owner } = req.body;

  // OLD METHOD
  /*
  if (!name || !type) {
    return res.status(400).send({ err: "name and type are required" });
  }

  let updated: UpdateQuery<IAnimal> = owner
    ? {
        name,
        type,
        owner,
      }
    : {
        name,
        type,
      };

  Animal.findByIdAndUpdate(id, updated, { new: true })
    .then((updatedAnimal) => {
      return res.send(updatedAnimal);
    })
    .catch((err) => res.status(400).send({ err }));
	*/
  // NEW METHOD
  try {
    let animal = await Animal.findById(id);
    if (name) animal.name = name;
    if (type) animal.type = type;
    if (owner) animal.owner = owner;
    await animal.save();
    res.send(animal);
  } catch (err) {
    res.status(400).send({ err });
  }
});

export default router;
