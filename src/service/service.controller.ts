import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Auth } from '../helper/decorator/auth.decorator';
import { PersonRole } from '../helper/class/profile.entity';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { SearchDto } from '../apartment/dto/search-apartment.dto';
import { SearchServiceDto } from './dto/search-service';
import { ReportServiceDto } from './dto/report-service-dto';

@ApiTags("Service")
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @ApiConsumes("multipart/form-data")
    @FormDataRequest()
    
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }
  @ApiQuery({
    name: "page",
    required: false,
    description:
        "Page number: Page indexed from 1, each page contain 30 items, if null then return all.",
})

  @Get()
  async findAll(@Query("page") page: number) {
    var data;
    if (Number.isNaN(page)) data = await this.serviceService.findAll();
    else data = await this.serviceService.findAll(page);
    return { data, current_page: page, per_page: 30, total: data.length};
}
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }
  
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }
  @Post("report/data")
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  async report(@Body() reportServiceDto:ReportServiceDto) {
      const result = await this.serviceService.reportService(reportServiceDto);
      return result;
  }
   @Post("/search/byQuery")
    @ApiConsumes("multipart/form-data")
    @FormDataRequest()
    async searchResident(@Body() searchServiceDto: SearchServiceDto) {
        const result = await this.serviceService.search( searchServiceDto);
        return result;
    }
  
}
