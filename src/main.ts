import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { envs } from "./config";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {

    const logger = new Logger('Main');

    //const app = await NestFactory.create(AppModule);

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.TCP,
            options: {
                //host: envs.host,
                port: envs.port,
            },
        });

    app.useGlobalPipes(
        new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        })
       );

    //await app.listen(envs.port);
    await app.listen();
    logger.log(`Microservice Products Run on : ${envs.port}`);
}
bootstrap();