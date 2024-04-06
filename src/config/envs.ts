

import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    DATABASE_URL: string;
}


const envVarsSchema: joi.ObjectSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
})
.unknown();

const {error, value} = envVarsSchema.validate(process.env, { abortEarly: false });

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    databaseUrl: envVars.DATABASE_URL,
};