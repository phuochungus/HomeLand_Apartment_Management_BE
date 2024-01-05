import { PartialType } from "@nestjs/swagger";
import { CreateServicePackageDto } from "./create-service-package.dto";

export class UpdateServicePackageDto {
    expired_date?: number | undefined;
    name?: string | undefined;
    per_unit_price?: number | undefined;
    service_id?: string | undefined;
}
