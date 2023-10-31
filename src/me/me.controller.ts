import { Controller, Get, Req } from "@nestjs/common";
import { ApiOkResponse, ApiTags, getSchemaPath } from "@nestjs/swagger";
import { Auth } from "../helper/decorator/auth.decorator";
import { Manager } from "../manager/entities/manager.entity";
import { Technician } from "../technician/entities/technician.entity";
import { Resident } from "../resident/entities/resident.entity";
import { Admin } from "../admin/entities/admin.entity";

@Auth()
@ApiTags("Me")
@Controller("me")
export class MeController {
    @ApiOkResponse({
        schema: {
            oneOf: [
                { $ref: getSchemaPath(Admin) },
                { $ref: getSchemaPath(Manager) },
                { $ref: getSchemaPath(Technician) },
                { $ref: getSchemaPath(Resident) },
            ],
        },
    })
    @Get()
    getPersonalInfo(@Req() req: any): Admin | Manager | Technician | Resident {
        return req.user;
    }
}
