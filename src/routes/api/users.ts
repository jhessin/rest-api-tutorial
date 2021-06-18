import { Router } from "express";
import { User } from "../../models";

const router = Router();

router.get("/", (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch((err) => res.status(500).json({ err }));
});

router.post("/", (req, res) => {
  const { username } = req.body;
  const newUser = new User({
    username,
  });

  if (!username) {
    return res.status(400).json({
      err: "Required field not found: username",
    });
  }

  newUser
    .save()
    .then((model) => res.status(201).json(model))
    .catch((err) => res.status(400).json(err));
});

export default router;
