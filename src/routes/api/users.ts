import { Router } from "express";
import { User } from "../../models";
import jwt from "jsonwebtoken";
import { secret, auth } from "../../config/passport";

const router = Router();

// Get a list of all users
router.get("/", auth, (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch((err) => res.status(500).json({ err }));
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
    .then((model) => res.status(201).json(model))
    .catch((err) => res.status(400).json(err));
});

// Get the currently logged in user
router.get("/current", auth, (req, res) => res.send(req.user));

// Get a user by id
router.get("/:id", auth, (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ user }))
    .catch((err) => res.status(400).send({ err }));
});

export default router;
