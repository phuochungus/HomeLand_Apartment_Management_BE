import { Test, TestingModule } from "@nestjs/testing";
import { ContractService } from "./contract.service";
import { ContractController } from "./contract.controller";
import { Contract } from "./entities/contract.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { StorageManagerModule } from "../storage/storage.module";
import { IdGeneratorModule } from "../id-generator/id-generator.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { DataSource } from "typeorm";
import { JWTAuthGuard } from "../auth/guard/jwt-auth.guard";
import { ContractModule } from "./contract.module";
import { FormDataRequest } from "nestjs-form-data";

describe("ContractController", () => {
    let controller: ContractController;
    const mockContractService = {};
    const mockJWTAuthGuard = {};
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
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
                TypeOrmModule.forFeature([Contract]),
                AuthModule,
                StorageManagerModule,
                IdGeneratorModule,
                JwtModule,
            ],
            controllers: [ContractController],
            providers: [
                ContractService,
                JwtService,
                JWTAuthGuard,
                { provide: ContractService, useValue: mockContractService },
                { provide: FormDataRequest, useValue: {} },
            ],
        })
            .overrideProvider(ContractService)
            .useValue(mockContractService)
            .compile();
        controller = module.get<ContractController>(ContractController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
