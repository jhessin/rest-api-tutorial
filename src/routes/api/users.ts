import { Router } from "express";
import { IUser, User } from "../../models";
import jwt from "jsonwebtoken";
import { secret, auth } from "../../config/passport";
import { Model } from "mongoose";

const router = Router();

// Get a list of all users
router.get("/", auth, (req, res) => {
  User.find()
    .select("-password")
    .then((users) => res.send(users))
    .catch((err) => res.status(500).json({ err }));
});

router.patch("/", auth, (req, res) => {
  const { current, password } = req.body;

  if (!password || !current) {
    return res.status(400).send({ err: "password and current both required" });
  }

  const user = req.user;
  user.comparePassword(current, (err: Error, correct: boolean) => {
    if (err) return res.status(400).send({ err });
    if (correct) {
      user.password = password;
      user
        .save()
        .then((user: Model<IUser>) => {
          return res.status(204).send(user);
        })
        .catch((err: Error) => res.status(400).send({ err }));
    } else {
      return res.status(400).send({ err: "Password is incorrect" });
    }
  });
});

// Get a token for a specified user given the correct password
router.post("/token", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      err: `Required fields not found: ${!username ? "username," : ""} ${
        !password ? "password" : ""
      }`,
    });
  }

  User.findOne({ username })
    .then((user) => {
      if (!user)
        return res.status(400).send({
          err: "Cannot find user",
        });
      return user.comparePassword(password, (err: Error, isMatch: boolean) => {
        if (err) return res.status(400).send(err);

        if (!isMatch) {
          return res.status(401).send({ err: "Invalid Password" });
        }

        const payload = {
          id: user._id,
        };
        const token = jwt.sign(payload, secret);
        return res.send(token);
      });
    })
    .catch((err) => res.status(400).send(err));
});

// Create a new user
router.post("/", (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({
    username,
    password,
  });

  if (!username || !password) {
    return res.status(400).json({
      err: `Required fields not found: ${!username ? "username," : ""} ${
        !password ? "password" : ""
      }`,
    });
  }

  newUser
    .save()
    .then((model) => res.status(201).json(model.removePassword()))
    .catch((err) => res.status(400).json(err));
});

// Get the currently logged in user
router.get("/current", auth, (req, res) => res.send(req.user.removePassword()));

// Get a user by id
router.get("/:id", auth, (req, res) => {
  User.findById(req.params.id)
    .select("-password")
    .then((user) => res.send({ user }))
    .catch((err) => res.status(400).send({ err }));
});

export default router;
