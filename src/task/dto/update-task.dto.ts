import { PartialType } from "@nestjs/swagger";
import { CreateTaskDto } from "./create-task.dto";
export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    assigner_id?: string | undefined;
    complain_id?: string | undefined;
}
