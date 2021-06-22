import { Router } from "express";
import { auth } from "../../config/passport";
import { Animal, User } from "../../models";

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

export default router;
