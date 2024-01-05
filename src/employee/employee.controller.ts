import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Query,
    Delete,
} from "@nestjs/common";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import {
    ApiConsumes,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags,
    ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { Employee } from "./entities/employee.entity";
import { Auth } from "../helper/decorator/auth.decorator";
import { FormDataRequest } from "nestjs-form-data";
import { PersonRole } from "../helper/class/profile.entity";
import { EmployeeService } from "./employee.service";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
@ApiTags("Employee")
@Auth(PersonRole.ADMIN, PersonRole.MANAGER)
@Controller("employee")
export class EmployeeController {
    constructor(private readonly employeeRepository: EmployeeService) {}
    @ApiOperation({ summary: "Create person profile" })
    @ApiConsumes("multipart/form-data")
    @ApiUnprocessableEntityResponse({
        description: "Email or phone number already exists",
    })
    @ApiCreatedResponse({
        description: "Create person profile successfully",
    })
    @Post()
    @FormDataRequest()
    async create(@Body() createPersonDto: CreateEmployeeDto) {
        return await this.employeeRepository.create(createPersonDto);
    }
    @Get("/search")
    async searchEmployee(@Query("query") query: string) {
        const result = await this.employeeRepository.search(query);
        return result;
    }
    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.employeeRepository.findOne(id);
    }
    @ApiOperation({ summary: "update employee" })
    @Patch(":id")
    @ApiConsumes("multipart/form-data")
    @FormDataRequest()
    async update(
        @Param("id") id: string,
        @Body() updateEmployeeDto: UpdateEmployeeDto,
    ): Promise<Employee> {
        const employee = await this.employeeRepository.updateEmployee(
            id,
            updateEmployeeDto,
        );
        return employee;
    }
    // findAll() {
    //         //         @Query("role", new ParseEnumPipe(PersonRole, { optional: true }))
    //         //         role?: PersonRole,
    //         // ): Promise<Employee[]> {
    //         //         if (role) return this.employeeRepository.find All(role);
    //         return this.employeeRepository.findAll();
    // }
    @ApiOperation({ summary: "get all employee" })
    @Get()
    async findAll(): Promise<Employee[]> {
        return this.employeeRepository.findAll();
    }
    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.employeeRepository.delete(id);
    }
}
