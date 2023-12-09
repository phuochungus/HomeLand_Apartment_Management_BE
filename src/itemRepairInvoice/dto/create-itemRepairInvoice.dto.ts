import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Column } from "typeorm/browser";
import { ItemRepairInvoice } from "../entities/itemRepairInvoice.entity";

export class CreateItemRepairInvoiceDto extends PickType(ItemRepairInvoice, [
    "content",
    "price"
]) {
  

}