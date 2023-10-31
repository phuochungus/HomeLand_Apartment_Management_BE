
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { AuthService, TokenPayload } from "../auth.service";

@Injectable()
export class JWTAuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request: any): Promise<boolean> {
        if (request.headers.authorization) {
            const token = request.headers.authorization.split(" ")[1];
            if (token) {
                try {
                    const payload: TokenPayload = this.jwtService.verify(token);
                    const user = await this.authService.findAccountOwnerById(
                        payload.id,
                    );
                    if (!user) throw new UnauthorizedException("Token invalid");
                    request.user = user;
                    return true;
                } catch (error) {
                    if (error instanceof TokenExpiredError) {
                        throw new UnauthorizedException("Token expired");
                    } else if (error instanceof JsonWebTokenError) {
                        throw new UnauthorizedException("Token invalid");
                    }
                    console.error(error);
                    throw error;
                }
            }
        }
        return false;
    }
}
