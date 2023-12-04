import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    NotFoundException,
    Delete,
    Query,
} from "@nestjs/common";

import { ApiConsumes, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FormDataRequest } from "nestjs-form-data";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@ApiTags("Task")
@Controller("task")
export class TaskController {
    constructor(private readonly taskRepository: TaskService) {}

    @ApiOperation({summary: "create task"})
    @ApiConsumes("multipart/form-data")
    @FormDataRequest()
    @Post("/")
    async assignToTechnician(@Body () createTaskDto: CreateTaskDto, @Query("assigneeId" ) assigneeId : string) {
        return await this.taskRepository.create(assigneeId, createTaskDto)
    }

    @ApiOperation({ summary: "get all task of technician" })
    @Get("/technician/:id")
    getTaskOfTechnician(@Param ("id") id:string) {
        return this.taskRepository.getTaskOfTechnician(id);
    }

    @ApiOperation({ summary: "get all task" })
    @Get()
    findAll() {
        return this.taskRepository.findAll();
    }

    @ApiOperation({ summary: "get task by id" })
    @Get(":id")
    async findOne(@Param("id") id: string) {
        const task = await this.taskRepository.findOne(id);
        if (task) return task;
        throw new NotFoundException("Task not found");
    }


    @ApiOperation({ summary: "done task" })
    @Patch(":id/done")
    async setDone(@Param("id") id: string) {
        return await this.taskRepository.done(id)
    }
}
