import { Module } from "@nestjs/common";
import { AdminSubscriber } from "./admin.sub";

@Module({
    imports: [],
    controllers: [],
    providers: [AdminSubscriber],
    exports: [],
})
export class AdminModule {}
