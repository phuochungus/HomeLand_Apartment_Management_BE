import { DeleteResult, UpdateResult } from "typeorm";

export function MBtoBytes(mb: number) {
    return mb * 1000000;
}

export function isQueryAffected(result: UpdateResult | DeleteResult): boolean {
    if (result.affected && result.affected > 0) return true;
    return false;
}
