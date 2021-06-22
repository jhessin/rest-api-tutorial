import { Router } from "express";
import userRouter from "./users";
import animalRouter from "./animals";
import { Animal, User } from "../../models";

const router = Router();

router.use("/users", userRouter);
router.use("/animals", animalRouter);

router.post("/reset", async (req, res) => {
  await User.deleteMany({});
  await Animal.deleteMany({});
  res.status(204).send();
});

export default router;
