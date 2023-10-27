/**
 * Base repository interface
 */
export interface IRepository<Entity> {
    create(createEntityDto: any): Promise<Entity>;
    findOne(id: string): Promise<Entity | null>;
    findAll(): Promise<Entity[]>;
    update(id: string, updateEntityDto: any): Promise<boolean>;
    delete(id: string): Promise<boolean>;
   
}
