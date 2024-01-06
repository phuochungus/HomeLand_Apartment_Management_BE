import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { Column } from "typeorm/browser";
export class CreateItemRepairInvoiceDto {
  @ApiProperty({ example: "example.com", description: "baseLink" })
        @IsOptional()
        baseLink?: string;
        
        @ApiProperty({ example: "example.com", description: "redirectUrl" })
        @IsOptional()
        redirectUrl?: string;
        @ApiProperty({ example: "example.com", description: "id" })
        @IsOptional()
        id?: string;
        @ApiProperty({ example: "pay with momo", description: "orderInfo" })
        @IsOptional()
        orderInfo?: string;
        @ApiProperty({ example: "RESIDENT", description: "orderInfo" })
        @IsOptional()
        buyer_id?: string;
}
