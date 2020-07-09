import AbstractController from './controllers/AbstractController';
import { registerModule } from '@jrapp/server-core-module';
import { Logger } from '@jrapp/server-core-logging';

export const MODULE_NAME = 'Web-Core';
export const ModuleContext = registerModule(MODULE_NAME, '#c0ca33');
export const ModuleLogger: Logger = ModuleContext.logger;

export * from './decorators';
export * from './middlewares';
export * from './responses';
export {
    AbstractController
}