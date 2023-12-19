import { isArray } from "class-validator";
import { IdGenerator } from "../id-generator/id-generator.service";
import { CreateBuildingDto } from "./dto/create-building.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, In, Repository, Like, createQueryBuilder } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { StorageManager } from "../storage/storage.service";
import { IRepository } from "../helper/interface/IRepository.interface";
import { Building } from "./entities/building.entity";
import { Floor } from "../floor/entities/floor.entity";
import { UpdateBuildingDto } from "./dto/update-building.dto";
import { isQueryAffected } from "../helper/validation";
import { Manager } from "src/manager/entities/manager.entity";
import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { paginate } from "nestjs-typeorm-paginate/dist/paginate";
import { IPaginationMeta } from "nestjs-typeorm-paginate/dist/interfaces";
export abstract class BuildingService implements IRepository<Building> {
    abstract findOne(id: string): Promise<Building | null>;
    abstract update(id: string, updateEntityDto: any): Promise<boolean>;
    abstract delete(id: string): Promise<boolean>;
    abstract create(
        createBuildingDto: CreateBuildingDto,
        id?: string,
    ): Promise<Building>;

    abstract findAll(page?: number): Promise<Building[]>;
    abstract search(query: string): Promise<Building[]>;
    abstract addManagersToBuilding(
        managerIds: string[] | string,
        id: string,
    ): Promise<Building | null>;
    abstract deleteManager(
        building_id: string,
        manager_id: string,
    ): Promise<Building | null>;
    abstract reportResidentOfBuilding(): any;
    abstract paginate(
        options: IPaginationOptions<IPaginationMeta>,
    ): Promise<Pagination<Building>>;
}

@Injectable()
export class TypeORMBuildingService extends BuildingService {
    constructor(
        @InjectRepository(Building)
        private readonly buildingRepository: Repository<Building>,
        @InjectRepository(Floor)
        private readonly floorRepository: Repository<Floor>,
        @InjectRepository(Manager)
        private readonly managerRepository: Repository<Manager>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
        private readonly idGenerate: IdGenerator,
        private readonly storageManager: StorageManager,
    ) {
        super();
    }

    async create(
        createBuildingDto: CreateBuildingDto,
        id?: string,
    ): Promise<Building> {
        let building = this.buildingRepository.create(createBuildingDto);
        building.building_id = "BD" + this.idGenerate.generateId();
        if (id) building.building_id = id;

        try {
            building = await this.buildingRepository.save(building);
            return building;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async findAll() {
        return await this.buildingRepository.find({
            relations: ["managers", "floors", "floors.apartments"],withDeleted: true 
        });
    }

    async findOne(id: string) {
        return await this.buildingRepository.findOne({
            where: { building_id: id },
            relations: ["managers", "managers.account", "floors.apartments"],withDeleted: true 
        });
    }

    async update(
        id: string,
        updateBuildingDto: UpdateBuildingDto,
    ): Promise<boolean> {
        try {
            let result = await this.buildingRepository.update(
                id,
                updateBuildingDto,
            );
            return isQueryAffected(result);
        } catch (error) {
            throw new Error("Method not implemented.");
        }
    }
    async delete(id: string): Promise<boolean> {
        try {
            const result = await this.buildingRepository.softDelete({
                building_id: id,
            });
            return isQueryAffected(result);
        } catch (error) {
            throw new Error("Method not implemented.");
        }
    }
    /**
     *
     * @param query chuỗi cần tìm theo tên
     * @returns
     */
    async search(query: string): Promise<Building[]> {
        const result = await this.buildingRepository.find({
            where: {
                name: Like(`%${query}%`),
            },
        });
        return result;
    }
    async addManagersToBuilding(
        managerIds: string[] | string,
        id: string,
    ): Promise<Building | null> {
        try {
            const building = (await this.buildingRepository.findOne({
                where: {
                    building_id: id,
                },
            })) as Building;
            await this.buildingRepository
                .createQueryBuilder()
                .relation(Building, "managers")
                .of(building)
                .add(managerIds);
            const result = await this.buildingRepository.findOne({
                where: {
                    building_id: id,
                },
                relations: ["managers"],
            });
            return result;
        } catch (e) {
            throw new Error(e);
        }
    }
    async deleteManager(
        building_id: string,
        manager_id: string,
    ): Promise<Building | null> {
        const building = await this.buildingRepository.findOne({
            where: {
                building_id,
            },
        });
        await this.buildingRepository
            .createQueryBuilder()
            .relation(Building, "managers")
            .of(building)
            .remove(manager_id);
        const newBuilding = await this.buildingRepository.findOne({
            where: {
                building_id,
            },
            relations: ["managers"],
        });
        return newBuilding;
    }
    async reportResidentOfBuilding() {
        const result = await this.dataSource
            .getRepository(Building)
            .createQueryBuilder("building")
            .leftJoin("building.floors", "floor")
            .leftJoin("floor.apartments", "apartment")
            .leftJoin("apartment.residents", "resident")
            .addSelect("COUNT(resident)", "count")
            .groupBy("building.building_id")
            .getRawMany();
        return result;
    }
    async paginate(options: IPaginationOptions<IPaginationMeta>) {
        const result = this.buildingRepository.createQueryBuilder("building");
        result.orderBy("building.building_id", "DESC");
        return paginate<Building>(result, options);
    }
}
