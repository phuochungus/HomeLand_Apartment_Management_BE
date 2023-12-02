import { IdGenerator } from "../id-generator/id-generator.service";
import { CreateFloorDto } from "./dto/create-floor.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, In, Repository, Like } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { StorageManager } from "../storage/storage.service";
import { IRepository } from "../helper/interface/IRepository.interface";
import { Floor } from "./entities/floor.entity";
import { UpdateFloorDto } from "./dto/update-floor.dto";
import { isQueryAffected } from "../helper/validation";
import { Building } from "src/building/entities/building.entity";
import { CreateBuildingDto } from "src/building/dto/create-building.dto";
import { BuildingController } from "src/building/building.controller";
import { Apartment } from "src/apartment/entities/apartment.entity";
import { floor } from "lodash";

export abstract class FloorService implements IRepository<Floor> {
    abstract findOne(id: string): Promise<Floor | null>;
    abstract update(id: string, updateEntityDto: any): Promise<boolean>;
    abstract delete(id: string): Promise<boolean>;
    abstract create(
        createPropertyDto: CreateFloorDto,
        id?: string,
    ): Promise<Floor>;
    abstract updateFloor(
        id: string,
        updateFloorDto: UpdateFloorDto,
    ): Promise<Floor>;
    abstract findAll(page?: number): Promise<Floor[]>;
    abstract search(query: string): Promise<Floor[]>;
    abstract addApartment(
        apartmentIds: string[] | string,
        id: string,
    ): Promise<Floor | null>;
    abstract deleteApartment(
        floor_id: string,
        apartment_id: string,
    ): Promise<Floor | null>;
}

@Injectable()
export class TypeORMFloorService extends FloorService {
    constructor(
        @InjectRepository(Apartment)
        private readonly apartmentRepository: Repository<Apartment>,
        @InjectRepository(Floor)
        private readonly floorRepository: Repository<Floor>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
        private readonly idGenerate: IdGenerator,
        private readonly storageManager: StorageManager,
    ) {
        super();
    }

    async create(
        CreateFloorDto: CreateFloorDto,
        id?: string,
    ): Promise<Floor> {
        let floor = this.floorRepository.create(CreateFloorDto);
        floor.floor_id = "FLR" + this.idGenerate.generateId();
        if (id) floor.floor_id = id;

        try {
            if (CreateFloorDto.apartmentIds) {
                const apartments = await this.apartmentRepository.find({
                    where: { apartment_id: In(CreateFloorDto.apartmentIds) },
                });
                if (apartments.length !== CreateFloorDto.apartmentIds.length)
                    throw new NotFoundException("Some resident not found");
                floor.apartments = apartments;
            }
            floor = await this.floorRepository.save(floor);
            return floor;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async findAll() {
        return await this.floorRepository.find(
            {
                relations: ["apartments"],
            }
        );
    }

    async findOne(id: string) {
        return await this.floorRepository.findOne({
            where: { floor_id: id },
            relations: ["apartments"],
        });
    }

    async updateFloor(
        id: string,
        updateFloorDto: UpdateFloorDto,
    ): Promise<Floor> {
        let floor = await this.floorRepository.findOne({
            where: { floor_id: id },
        });
        if (!floor) throw new NotFoundException();
        const queryRunner = this.dataSource.createQueryRunner();
       
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            let { max_apartment, ...rest } = updateFloorDto;
            floor = this.floorRepository.merge(floor, updateFloorDto);
            floor = await this.floorRepository.save(floor);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
        return floor;
    }
    async update(id: string, UpdateFloorDto: UpdateFloorDto) {
        let result = await this.floorRepository.update(id, UpdateFloorDto as any);
        return isQueryAffected(result);
    }
    async delete(id: string): Promise<boolean> {
        const result = await this.floorRepository.softDelete({ floor_id: id });
        return isQueryAffected(result);
    }
    async hardDelete?(id: any): Promise<boolean> {
        try {
            const result = await this.floorRepository.delete({ floor_id : id });
            return isQueryAffected(result);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    /**
     *
     * @param query chuỗi cần tìm theo tên
     * @returns
     */
    async search(query: string): Promise<Floor[]> {
        const result = await this.floorRepository.find({
            where: {
                name: Like(`%${query}%`),
            },
        });
        return result;
    }
    async addApartment(
        apartmentIds: string[] | string,
        id: string,
    ): Promise<Floor | null> {
        try {
            const floor = (await this.floorRepository.findOne({
                where: {
                    floor_id: id,
                },
            })) as Floor;
            await this.floorRepository
                .createQueryBuilder()
                .relation(Floor, "apartments")
                .of(floor)
                .add(apartmentIds);
            const result = await this.floorRepository.findOne({
                where: {
                    floor_id: id,
                },
                relations: ["apartments"],
            });
            return result;
        } catch (e) {
            throw new Error(e);
        }
    }
    async deleteApartment(floor_id: string, apartment_id: string): Promise<Floor | null> {
        try {
          const floor = await this.floorRepository.findOne({
            where: {
              floor_id,
            },
          });
          await this.floorRepository
            .createQueryBuilder()
            .relation(Floor, "apartments")
            .of(floor)
            .remove(apartment_id);
          const newBuilding = await this.floorRepository.findOne({
            where: {
              floor_id,
            },
            relations: ["apartments"],
        });
        return newBuilding;
    } catch (err) {
        console.error(err);
        throw err;
      }
    }
}