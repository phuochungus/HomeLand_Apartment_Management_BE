import { Module } from "@nestjs/common";
import { BcryptHashService, HashService } from "./hash.service";

@Module({
    providers: [
        {
            provide: HashService,
            useClass: BcryptHashService,
        },
    ],
    exports: [HashService],
})
export class HashModule {}
