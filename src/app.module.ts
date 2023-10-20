import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { PersonModule } from "./person/person.module";
import { IdGeneratorModule } from "./id_generator/id-generator.module";
import { UploadModule } from "./upload/upload.module";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { createClient } from "redis";
import { HashModule } from "./hash/hash.module";
import { PersonFactoryModule } from "./person-factory/person-factory.module";
import { SeedingModule } from "./seeding/seeding.module";
import { MeModule } from "./me/me.module";
import { ApartmentModule } from "./apartment/apartment.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({
            secret: process.env.ACCESS_TOKEN_SECRET,
            global: true,
            signOptions: {
                expiresIn: "30d",
            },
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
                            ignoreErrors: true,
                            options: {
                                url: process.env.REDIS_URL,
                            },
                        },
                    };
                } else {
                    const client = createClient();

                    client.on("error", (error) => {
                        console.error(error);
                    });
                    client.on("connect", async () => {
                        console.log("Connected to redis");
                    });
                    await client.connect();
                    await client.disconnect();
                    return {
                        type: "postgres",
                        url: process.env.DB_LOCAL_URL,
                        synchronize: true,
                        entities: ["dist/**/*.entity{.ts,.js}"],
                        duration: 5000,
                        cache: {
                            type: "redis",
                            ignoreErrors: true,
                            options: {
                                url: process.env.REDIS_LOCAL_URL,
                            },
                        },
                    };
                }
            },
        }),
        AuthModule,
        PersonModule,
        IdGeneratorModule,
        UploadModule,
        HashModule,
        PersonFactoryModule,
        SeedingModule,
        ApartmentModule,
        MeModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
