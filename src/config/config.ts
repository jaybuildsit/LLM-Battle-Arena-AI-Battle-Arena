import { config as dotenvConfig } from "dotenv";

dotenvConfig();

type CONFIG = {
    readonly GOOGLE_API_KEY: string;
    readonly MISTRAL_API_KEY: string;
    readonly COHERE_API_KEY: string;
    readonly KIE_API_KEY: string;
    readonly KIE_MODEL: string;
}

const config: CONFIG = {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || "",
    COHERE_API_KEY: process.env.COHERE_API_KEY || "",
    KIE_API_KEY: process.env.KIE_API_KEY || "",
    KIE_MODEL: process.env.KIE_MODEL || "",
}

export default config;
