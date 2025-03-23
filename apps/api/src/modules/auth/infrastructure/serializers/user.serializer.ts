import { PassportSerializer } from "@nestjs/passport";
import type { SelectUser } from "../entities/user";
import type { ActiveUserData } from "../../interfaces/active-user-data";

export class UserSerializer extends PassportSerializer {
  serializeUser(
    user: SelectUser,
    done: (err: Error | null, user: ActiveUserData) => void,
  ) {
    done(null, {
      sub: user.id,
      email: user.email,
    });
  }

  async deserializeUser(
    payload: ActiveUserData,
    done: (err: Error | null, user: ActiveUserData) => void,
  ) {
    done(null, payload);
  }
}
