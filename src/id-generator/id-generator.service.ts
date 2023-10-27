import { Injectable } from "@nestjs/common";

export abstract class IdGenerator {
    abstract generateId(): number;
}

@Injectable()
export class DatetimeGenerator extends IdGenerator {
    public generateId() {
        return Date.now();
    }
}
