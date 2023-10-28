import { Injectable } from "@nestjs/common";
import { CreateAccountDto } from "./dto/create-account.dto";

@Injectable()
export class AccountService {
    create(createAccountDto: CreateAccountDto) {
        return "This action adds a new account";
    }

    findAll() {
        return `This action returns all account`;
    }

    findOne(id: number) {
        return `This action returns a #${id} account`;
    }

    remove(id: number) {
        return `This action removes a #${id} account`;
    }
}
