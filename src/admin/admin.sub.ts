import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    Repository,
    SoftRemoveEvent,
} from "typeorm";
import { Account } from "../account/entities/account.entity";
import { Admin } from "./entities/admin.entity";

@EventSubscriber()
export class AdminSubscriber implements EntitySubscriberInterface<Admin> {
    constructor(dataSource: DataSource) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return Admin;
    }

    private async disableAccount(
        admin: Admin,
        accountRepository: Repository<Account>,
    ) {
        if (admin.account) await accountRepository.softRemove(admin.account);
    }

    /**
     * Disable account when resident is sofr removed
     */
    async beforeSoftRemove(event: SoftRemoveEvent<Admin>) {
        if (event.entity)
            await this.disableAccount(
                event.entity,
                event.manager.getRepository(Account),
            );
    }

    /**
     * Disable account when resident is removed
     */
    async beforeRemove(event: SoftRemoveEvent<Admin>) {
        if (event.entity)
            await this.disableAccount(
                event.entity,
                event.manager.getRepository(Account),
            );
    }
}
