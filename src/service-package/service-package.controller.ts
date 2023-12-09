import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicePackageService } from './service-package.service';
import { CreateServicePackageDto } from './dto/create-service-package.dto';
import { UpdateServicePackageDto } from './dto/update-service-package.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';

@ApiTags("Service Package")
@Controller('service-package')
export class ServicePackageController {
  constructor(private readonly servicePackageService: ServicePackageService) {}

  @Post()
  @ApiConsumes("multipart/form-data")
    @FormDataRequest()
  
  create(@Body() createServicePackageDto: CreateServicePackageDto) {
    return this.servicePackageService.create(createServicePackageDto);
  }

  @Get()
  findAll() {
    return this.servicePackageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicePackageService.findOne(id);
  }
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServicePackageDto: UpdateServicePackageDto) {
    return this.servicePackageService.update(id, updateServicePackageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicePackageService.remove(id);
  }
}
