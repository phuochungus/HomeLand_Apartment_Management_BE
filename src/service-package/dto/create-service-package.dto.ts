import { OmitType } from "@nestjs/swagger";
import { ServicePackage } from "../entities/service-package.entity";

export class CreateServicePackageDto extends OmitType(ServicePackage, [
    "service","servicePackage_id","invoices","created_at","deleted_at"
] as const) {}
