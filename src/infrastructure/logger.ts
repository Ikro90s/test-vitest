import { injectable } from "inversify";
import { ILogger } from "../interfaces/interfaces";

@injectable()
export class DevLogger implements ILogger {
    log(message: string): void {
        console.log(`[DEV LOG]: ${message}`);
    }
}

@injectable()
export class ProdLogger implements ILogger {
    log(message: string): void {
        console.log(`[PROD LOG]: ${new Date().toISOString()} - ${message}`);
    }
}