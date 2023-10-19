import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "../decorator/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
        const roles = this.reflector.getAllAndMerge(Roles, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!roles || roles.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const hasRole = () => roles.includes(user.role);
        const hasAuthority = user && user.role && hasRole();
        if (hasAuthority) return true;
        throw new ForbiddenException(
            "Only " + roles.join(", ") + " have permission",
        );
    }
}
