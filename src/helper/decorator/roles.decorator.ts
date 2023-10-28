import { Reflector } from "@nestjs/core";
import { PersonRole } from "../class/profile.entity";

export const Roles = Reflector.createDecorator<PersonRole[]>();
