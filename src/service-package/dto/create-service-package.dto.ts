import { OmitType } from "@nestjs/swagger";
import { ServicePackage } from "../entities/service-package.entity";

export class CreateServicePackageDto {
    expired_date?: number | undefined;
    name: string;
    per_unit_price: number;
    service_id: string;
}
