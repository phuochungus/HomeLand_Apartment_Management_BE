import { UseGuards, applyDecorators } from "@nestjs/common";
import { Roles } from "./roles.decorator";
import { JWTAuthGuard } from "../../auth/guard/jwt.guard";
import { RolesGuard } from "../guard/role.guard";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { PersonRole } from "../class/profile.entity";

/**
 * @description specify which role can have accesibility, if not specified, all role can access
 * @param auth PersonRole of that can access controller or method
 * @default undefined
 * @example
 * @Auth(PersonRole.ADMIN, PersonRole.MANAGER)
 * @Auth()
 */
export function Auth(...auth: PersonRole[]) {
    return applyDecorators(
        Roles(auth),
        UseGuards(JWTAuthGuard, RolesGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: "Unauthorized" }),
    );
}
