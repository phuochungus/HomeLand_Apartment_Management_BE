import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Invoice } from "../entities/invoice.entity";
import { IsOptional } from "class-validator";

export class CreateInvoiceDto extends OmitType(Invoice, [
    "servicePackage","invoice_id","buyer","created_at",
    "deleted_at","expired_at", "buyer_id"
] as const) {
    @ApiProperty({ example: "example.com", description: "baseLink" })
    @IsOptional()
    baseLink?: string;
    
    @ApiProperty({ example: "example.com", description: "redirectUrl" })
    @IsOptional()
    redirectUrl?: string;
    
    @ApiProperty({ example: "pay with momo", description: "orderInfo" })
    @IsOptional()
    orderInfo?: string;
    @ApiProperty({ example: "RESIDENT", description: "orderInfo" })
    @IsOptional()
    buyer_id?: string;
    
}
