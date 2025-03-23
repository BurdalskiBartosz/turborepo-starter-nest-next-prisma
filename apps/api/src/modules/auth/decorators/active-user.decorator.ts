import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { REQUEST_USER_KEY } from "../auth.constants";
import type { ActiveUserData } from "../interfaces/active-user-data";

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user: ActiveUserData | undefined = request[REQUEST_USER_KEY];

    return field ? user?.[field] : user;
  },
);
