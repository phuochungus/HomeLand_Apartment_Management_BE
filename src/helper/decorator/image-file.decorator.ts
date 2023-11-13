import { applyDecorators } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { HasMimeType, IsFile, IsFiles, MaxFileSize } from "nestjs-form-data";
import { commonImageMIMETypes } from "../constant";
import { IsDefined, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export function IsImageFile(isOptional = false) {
    return applyDecorators(
        ApiProperty({ type: "file", required: !isOptional }),
        isOptional ? IsOptional() : IsDefined(),
        IsFile(),
        MaxFileSize(10e6),
        HasMimeType(commonImageMIMETypes),
    );
}

export function IsImageFiles(isOptional = false) {
    return applyDecorators(
        ApiProperty({
            type: "file",
            required: !isOptional,
            isArray: true,
        }),
        isOptional ? IsOptional() : IsDefined(),
        Transform(({ value }) => toArray(value)),
        IsFiles(),
        MaxFileSize(10e6, { each: true }),
        HasMimeType(commonImageMIMETypes, { each: true }),
    );
}

export function toArray(value: any) {
    if (value && !Array.isArray(value)) return [value];
    return value;
}
