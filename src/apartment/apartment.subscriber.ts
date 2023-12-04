import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    SoftRemoveEvent,
    UpdateEvent,
} from "typeorm";
import { Apartment } from "./entities/apartment.entity";
import { OnModuleInit } from "@nestjs/common";
import { Client } from "elasticsearch";

@EventSubscriber()
export class ApartmentSubcriber
    implements EntitySubscriberInterface<Apartment>, OnModuleInit
{
    constructor(
        private readonly elasticSearchClient: Client,
        private readonly dataSource: DataSource,
    ) {
        this.dataSource.subscribers.push(this);
    }

    async onModuleInit() {
        try {
            await this.elasticSearchClient.indices.create({
                index: "apartment",
                method: "PUT",
            });
        } catch (error) {}
    }

    listenTo() {
        return Apartment;
    }

    async afterInsert(event: InsertEvent<Apartment>) {
        let apartment = await event.manager.findOne(Apartment, {
            where: { apartment_id: event.entity.apartment_id },
        });
        if (!apartment) return;

        this.elasticSearchClient.index({
            index: "apartment",
            type: "apartment",
            body: apartment,
            id: apartment.apartment_id,
            method: "PUT",
        });
    }

    async afterUpdate(event: UpdateEvent<Apartment>) {
        let apartment = await event.manager.findOne(Apartment, {
            where: { apartment_id: event.databaseEntity.apartment_id },
        });
        if (!apartment) return;
        this.elasticSearchClient.update({
            index: "apartment",
            type: "apartment",
            body: {
                doc: apartment,
            },
            id: apartment.apartment_id,
        });
    }

    async afterSoftRemove(event: SoftRemoveEvent<Apartment>) {
        await this.elasticSearchClient.delete({
            index: "apartment",
            type: "apartment",
            id: event.entityId,
        });
    }
}
