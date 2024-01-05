import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { MemoryStoredFile } from "nestjs-form-data";
import { ContractRole } from "../entities/contract.entity";

export class UpdateContractDto {
    apartment_id: string;

    expire_at?: Date | undefined;

    resident_id: string;

    role: ContractRole;

    @ApiProperty({
        type: "file",
        required: false,
    })
    @IsOptional()
    imageUpdate?: MemoryStoredFile;
}
