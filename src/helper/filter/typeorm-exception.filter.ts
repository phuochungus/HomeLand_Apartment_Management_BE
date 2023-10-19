import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from "@nestjs/common";
import { Request } from "express";
import {
    QueryFailedError,
    EntityNotFoundError,
    CannotCreateEntityIdMapError,
    TypeORMError,
} from "typeorm";

/**
 * Catch TypeOrmError and return a user friendly error message
 */
@Catch(TypeORMError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let message = (exception as any).message.message;
        let code = "HttpException";
        Logger.error(
            message,
            (exception as any).stack,
            `${request.method} ${request.url}`,
        );
        let status = HttpStatus.INTERNAL_SERVER_ERROR;

        switch (exception.constructor) {
            case HttpException:
                status = (exception as HttpException).getStatus();
                break;
            case QueryFailedError: // this is a TypeOrm error
                status = HttpStatus.UNPROCESSABLE_ENTITY;
                message = (exception as QueryFailedError).message;
                code = (exception as any).code;
                break;
            case EntityNotFoundError: // this is another TypeOrm error
                status = HttpStatus.UNPROCESSABLE_ENTITY;
                message = (exception as EntityNotFoundError).message;
                code = (exception as any).code;
                break;
            case CannotCreateEntityIdMapError: // and another
                status = HttpStatus.UNPROCESSABLE_ENTITY;
                message = (exception as CannotCreateEntityIdMapError)
                    .message;
                code = (exception as any).code;
                break;
            default:
                status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        response
            .status(status)
            .json(
                GlobalResponseError(status, message, code, request),
            );
    }
}

export const GlobalResponseError: (
    statusCode: number,
    message: string,
    code: string,
    request: Request,
) => IResponseError = (
    statusCode: number,
    message: string,
    code: string,
    request: Request,
): IResponseError => {
    return {
        statusCode: statusCode,
        message,
        code,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
    };
};

export interface IResponseError {
    statusCode: number;
    message: string;
    code: string;
    timestamp: string;
    path: string;
    method: string;
}
