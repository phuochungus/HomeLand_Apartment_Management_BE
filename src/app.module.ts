import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { IdGeneratorModule } from "./id-generator/id-generator.module";
import { StorageModule } from "./storage/storage.module";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { HashModule } from "./hash/hash.module";
import { SeedModule } from "./seed/seed.module";
import { MeModule } from "./me/me.module";
import { ApartmentModule } from "./apartment/apartment.module";
import { TokenModule } from "./token/token.module";
import { ContractModule } from "./contract/contract.module";
import { AvatarGeneratorModule } from "./avatar-generator/avatar-generator.module";
import { NestjsFormDataModule } from "nestjs-form-data";
import { AccountModule } from "./account/account.module";
import { AdminModule } from "./admin/admin.module";
import { BuildingModule } from "./building/building.module";
import { ResidentModule } from "./resident/resident.module";
@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({
            secret: process.env.ACCESS_TOKEN_SECRET,
            global: true,
        }),
        TypeOrmModule.forRootAsync({
            useFactory: async () => {
                if (process.env.IS_PRODUCTION == "true") {
                    return {
                        type: "postgres",
                        url: process.env.DB_URL,
                        synchronize: true,
                        entities: ["dist/**/*.entity{.ts,.js}"],
                        cache: {
                            duration: 5000,
                            type: "redis",
                            options: {
                                url: process.env.REDIS_URL,
                            },
                        },
                    };
                } else {
                    return {
                        type: "postgres",
                        url: process.env.DB_LOCAL_URL,
                        synchronize: true,
                        entities: ["dist/**/*.entity{.ts,.js}"],
                        duration: 5000,
                        cache: {
                            type: "redis",
                            options: {
                                url: process.env.REDIS_LOCAL_URL,
                            },
                        },
                    };
                }
            },
        }),
        AuthModule,
        IdGeneratorModule,
        StorageModule,
        HashModule,
        SeedModule,
        ApartmentModule,
        MeModule,
        TokenModule,
        ResidentModule,
        BuildingModule,
        ContractModule,
        AvatarGeneratorModule,
        NestjsFormDataModule.config({
            isGlobal: true,
        }),
        AccountModule,
        AdminModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
