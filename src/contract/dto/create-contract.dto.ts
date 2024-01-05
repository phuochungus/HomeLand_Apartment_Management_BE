import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { ContractRole } from "../entities/contract.entity";

export class CreateContractDto {
    role: ContractRole;

    @ApiProperty({ example: null, description: "The Previous contract id" })
    @IsOptional()
    @IsString()
    previous_contract_id?: string;

    @ApiProperty({ example: "RESIDENT", description: "The resident id" })
    @IsString()
    resident_id: string;

    @ApiProperty({ example: new Date(), description: "The expire date" })
    @IsOptional()
    expire_at?: Date;

    @ApiProperty({
        example: "APM1698502960091",
        description: "The Apartment id",
    })
    @IsString()
    apartment_id: string;
}
