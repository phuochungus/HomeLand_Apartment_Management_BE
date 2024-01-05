import { PartialType } from '@nestjs/swagger';
import { CreateServiceDto } from './create-service.dto';
import { MemoryStoredFile } from 'nestjs-form-data';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
    description?: string | undefined;
    images?: MemoryStoredFile[] | undefined;
    name?: string | undefined;
}
