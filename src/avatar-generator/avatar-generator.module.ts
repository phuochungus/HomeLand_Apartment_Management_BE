import { Module } from "@nestjs/common";
import {
    AvatarGenerator,
    DiceBearAvatarGenerator,
} from "./avatar-generator.service";

@Module({
    providers: [
        {
            provide: AvatarGenerator,
            useClass: DiceBearAvatarGenerator,
        },
    ],
    exports: [AvatarGenerator],
})
export class AvatarGeneratorModule {}
