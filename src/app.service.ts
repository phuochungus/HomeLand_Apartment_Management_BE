import { Injectable } from "@nestjs/common";
import { DataSource, Repository, TreeRepository } from "typeorm";
import { Contract } from "./contract/entities/contract.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AppService {
    getHello(): string {
        return "Hello World!";
    }
}
