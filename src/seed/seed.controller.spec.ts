import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { StorageModule } from "../storage/storage.module";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { DataSource, DeleteResult, Repository, UpdateResult } from "typeorm";
import { MemoryStoredFile, NestjsFormDataModule } from "nestjs-form-data";
import { readFileSync } from "fs";
import { SeedService } from "./seed.service";
import { Seed } from "./seed.controller";
import { ApartmentModule } from "../apartment/apartment.module";
import { ResidentModule } from "../resident/resident.module";
import { HashModule } from "../hash/hash.module";
import { AvatarGeneratorModule } from "../avatar-generator/avatar-generator.module";
import { JWTAuthGuard } from "../auth/guard/jwt-auth.guard";

describe("SeedService", () => {
    let service: SeedService;
    let controller: Seed;
    
    const mockDeleteResult: UpdateResult = {
        raw: [],
        affected: 1,
        generatedMaps: [],
    };
    
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                NestjsFormDataModule.config({
                    isGlobal: true,
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
                ApartmentModule,
                ResidentModule,
                StorageModule,
                IdGeneratorModule,
                HashModule,
                AvatarGeneratorModule,
                AuthModule,
                StorageModule,
                JwtModule,
            ],
            controllers: [Seed],

            providers: [SeedService, {provide:SeedService, useValue:{
                startSeeding: jest.fn().mockResolvedValue({msg:"Seeding started"}),
                createDB: jest.fn().mockResolvedValue({msg:"DB created"}),
                dropDB: jest.fn().mockResolvedValue({msg:"DB dropped"}),
            }}],
        })
        .compile();
        controller = module.get<Seed>(Seed);
        service = module.get<SeedService>(SeedService);
    }, 30000);

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
    describe("startSeeding", () => {
        it("should start seeding", async () => {
            const result = await controller.startSeeding();
            expect(result).toEqual({msg:"Seeding started"});
            expect(service.startSeeding).toHaveBeenCalled();
        });
    });
    describe("Drop DB", () => {
        it("should drop DB", async () => {
            const result = await controller.dropDB();
            expect(result).toEqual({msg:"DB dropped"});
            expect(service.dropDB).toHaveBeenCalled();
        });
    });
    describe("Create DB", () => {
        it("should create DB", async () => {
            const result = await controller.createDB();
            expect(result).toEqual({msg:"DB created"});
            expect(service.createDB).toHaveBeenCalled();
        });
    });
});
