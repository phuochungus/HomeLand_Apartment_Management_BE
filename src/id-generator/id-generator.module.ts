import { Module } from "@nestjs/common";
import { IdGenerator, DatetimeGenerator } from "./id-generator.service";

@Module({
    providers: [
        {
            provide: IdGenerator,
            useClass: DatetimeGenerator,
        },
    ],
    exports: [IdGenerator],
})
export class IdGeneratorModule {}
