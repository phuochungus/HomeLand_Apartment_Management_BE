import { faker } from "@faker-js/faker";
import { Injectable, OnModuleInit } from "@nestjs/common";

export abstract class AvatarGenerator {
    abstract generateAvatar(seed: any): Promise<ArrayBuffer>;
}

@Injectable()
export class DiceBearAvatarGenerator
    extends AvatarGenerator
    implements OnModuleInit
{
    private createAvatar: any;
    private collection: any;
    async onModuleInit() {
        this.createAvatar = (await import("@dicebear/core")).createAvatar;
        this.collection = await import("@dicebear/collection");
    }
    async generateAvatar(seed: any): Promise<ArrayBuffer> {
        return await this.createAvatar(
            faker.helpers.objectValue(this.collection),
            {
                seed,
            },
        ).toArrayBuffer();
    }
}
