import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from "@nestjs/common";

export interface validateOption {
    name: string;
    mimetypes?: string[];
    limit?: number;
}

/**
 * Custom file validation pipe
 * @constructor validateOption
 */
@Injectable()
export class ValidateFilePipe implements PipeTransform {
    constructor(private readonly option: validateOption[]) {}
    transform(value: any, metadata: ArgumentMetadata) {
        if (!value) throw new BadRequestException("No file found");
        this.option.forEach((option) => {
            const { name, mimetypes, limit } = option;
            if (!name)
                throw new BadRequestException(
                    "file name is required",
                );
            if (!value[name])
                throw new BadRequestException(name + " is not found");
            if (limit) {
                if (value[name][0].size > limit)
                    throw new BadRequestException(
                        name +
                            " size must not exceed " +
                            limit +
                            " bytes",
                    );
            }
            if (mimetypes) {
                if (!mimetypes.includes(value[name][0].mimetype))
                    throw new BadRequestException(
                        name +
                            " must be one of " +
                            mimetypes.join(", "),
                    );
            }
        });
        return value;
    }
}
