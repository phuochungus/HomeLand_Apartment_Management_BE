import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString } from "class-validator";
import { CreateContractDto } from "./create-contract.dto";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";
import { commonImageMIMETypes } from "src/helper/constant";

export class UpdateContractDto extends OmitType(
    CreateContractDto,
    ['previous_contract_id','status'] as const,
) {
    @ApiProperty({
        type: "file",
        required: false,
    })
       
    @IsOptional()
    imageUpdate?: MemoryStoredFile;
}
