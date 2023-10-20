import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Apartment } from "../../apartment/entities/apartment.entity";

@Entity()
export class Image {
    @PrimaryColumn()
    image_URL: string;

    @ManyToOne(() => Apartment, (property) => property.images)
    apartment: Apartment;
}
