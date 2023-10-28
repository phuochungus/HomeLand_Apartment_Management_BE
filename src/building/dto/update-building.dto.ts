import { PartialType } from "@nestjs/swagger";
import { CreateBuildingDto } from "./create-building.dto";

export class UpdateBuildingDto extends PartialType(CreateBuildingDto) {}
