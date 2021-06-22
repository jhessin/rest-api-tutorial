import passport from "passport";
import passportJWT from "passport-jwt";
import { User } from "../models";

const { Strategy, ExtractJwt } = passportJWT;

const secret = process.env.SECRET_OR_KEY || "akrck;naxoekoekaeok";
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

const strategy = new Strategy(options, (payload, next) => {
  User.findOne({ _id: payload.id })
    .then((user) => next(null, user))
    .catch((err) => next(err));
});

passport.use(strategy);

export default passport;
export { secret };
export const auth = passport.authenticate("jwt", { session: false });
