import {
    IsUrl,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    validateOrReject,
    ValidationError,
} from "class-validator";
import {
    HasMimeType,
    IsFile,
    MaxFileSize,
    MemoryStoredFile,
} from "nestjs-form-data";
import { commonImageMIMETypes } from "../helper/constant";
import { plainToInstance } from "class-transformer";
import { BadRequestException } from "@nestjs/common";

class ImageFileContainer {
    @IsFile()
    @MaxFileSize(10e6)
    @HasMimeType(commonImageMIMETypes)
    value: MemoryStoredFile;
}

class URLContainer {
    @IsUrl()
    value: string;
}

/**
 * @classdesc A class that validate if the value is a valid URL or a valid image file
 */
@ValidatorConstraint({ async: true })
export class IsURLOrImageFile implements ValidatorConstraintInterface {
    async validate(
        value: any,
        validationArguments?: ValidationArguments | undefined,
    ): Promise<boolean> {
        try {
            await Promise.any([
                validateOrReject(
                    plainToInstance(ImageFileContainer, { value }),
                ),
                validateOrReject(plainToInstance(URLContainer, { value })),
            ]);
            return true;
        } catch (error) {
            if (error instanceof AggregateError) {
                throw new BadRequestException({
                    message: `${validationArguments?.property} fail to validate any of the following constrains`,
                    constraints: error.errors.reduce(
                        (msg, err: ValidationError[]) => {
                            console.log(msg, err[0].constraints);
                            msg.push(err[0].constraints);
                            return msg;
                        },
                        [],
                    ),
                });
            }
            throw new error();
        }
    }
}
