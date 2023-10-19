import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Property } from "../../property/entities/property.entity";

@Entity()
export class Image {
    @PrimaryColumn()
    image_URL: string;

    @ManyToOne(() => Property, (property) => property.images)
    property: Property;
}
