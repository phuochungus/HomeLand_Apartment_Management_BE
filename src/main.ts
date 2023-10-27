import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import {
    DocumentBuilder,
    SwaggerDocumentOptions,
    SwaggerModule,
} from "@nestjs/swagger";
import { Person } from "./person/entities/person.entity";
import { TypeOrmExceptionFilter } from "./helper/filter/typeorm-exception.filter";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useStaticAssets("static");
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );
    app.enableCors();
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );
    app.useGlobalFilters(new TypeOrmExceptionFilter());

    const config = new DocumentBuilder()
        .setTitle("HomeLand example")
        .setDescription("The HomeLand API description")
        .setVersion("1.0")
        .addBearerAuth()
        .build();

    const option: SwaggerDocumentOptions = {
        deepScanRoutes: true,
        extraModels: [Person],
    };
    const document = SwaggerModule.createDocument(app, config, option);

    SwaggerModule.setup("api", app, document, {
        customCssUrl: "/style.css",
        swaggerOptions: {
            useUnsafeMarkdown: true,
        },
    });

    await app.listen(process.env.PORT || 3000);
}
bootstrap();
