import { Injectable } from "@nestjs/common";
import { compareSync, hashSync } from "bcrypt";
import { hashRounds } from "../helper/constant";

export abstract class HashService {
    /**
     * hash a string value
     * @param value value to be hashed
     */
    abstract hash(value: string): string;

    /**
     * compare a string value with a hashed string
     * @param value value to be compared
     * @param hash hashed string value
     */
    abstract isMatch(value: string, hash: string): boolean;
}

@Injectable()
export class BcryptHashService extends HashService {
    hash(value: string): string {
        return hashSync(value, hashRounds);
    }

    isMatch(value: string, hash: string): boolean {
        return compareSync(value, hash);
    }
}
