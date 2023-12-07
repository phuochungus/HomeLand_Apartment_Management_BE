import { Module } from "@nestjs/common";
import { InvoiceService } from "./invoice.service";
import { InvoiceController } from "./invoice.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Invoice } from "./entities/invoice.entity";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { ServicePackage } from "../service-package/entities/service-package.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [ AuthModule,
        TypeOrmModule.forFeature([Invoice, ServicePackage]),
        IdGeneratorModule,
    ],

    controllers: [InvoiceController],
    providers: [InvoiceService],
    exports: [InvoiceService],
})
export class InvoiceModule {}
