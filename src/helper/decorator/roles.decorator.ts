import { Reflector } from "@nestjs/core";
import { PersonRole } from "../../person/entities/person.entity";

export const Roles = Reflector.createDecorator<PersonRole[]>();
