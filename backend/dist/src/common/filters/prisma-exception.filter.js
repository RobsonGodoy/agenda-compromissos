"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PrismaExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaExceptionFilter = PrismaExceptionFilter_1 = class PrismaExceptionFilter {
    logger = new common_1.Logger(PrismaExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        this.logger.error(`Prisma Error [${exception.code}]: ${exception.message}`, exception.stack);
        switch (exception.code) {
            case 'P2002':
                const field = this.extractField(exception);
                response.status(common_1.HttpStatus.CONFLICT).json({
                    statusCode: common_1.HttpStatus.CONFLICT,
                    message: `Já existe um registro com este ${field}`,
                    error: 'Conflict',
                    timestamp: new Date().toISOString(),
                    path: request.url,
                });
                break;
            case 'P2025':
                response.status(common_1.HttpStatus.NOT_FOUND).json({
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: 'Registro não encontrado',
                    error: 'Not Found',
                    timestamp: new Date().toISOString(),
                    path: request.url,
                });
                break;
            case 'P2003':
                response.status(common_1.HttpStatus.BAD_REQUEST).json({
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Violação de chave estrangeira. Verifique as referências.',
                    error: 'Bad Request',
                    timestamp: new Date().toISOString(),
                    path: request.url,
                });
                break;
            case 'P2014':
                response.status(common_1.HttpStatus.BAD_REQUEST).json({
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Relação obrigatória não foi fornecida',
                    error: 'Bad Request',
                    timestamp: new Date().toISOString(),
                    path: request.url,
                });
                break;
            case 'P2011':
                response.status(common_1.HttpStatus.BAD_REQUEST).json({
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Campo obrigatório não foi fornecido',
                    error: 'Bad Request',
                    timestamp: new Date().toISOString(),
                    path: request.url,
                });
                break;
            default:
                this.logger.error(`Unhandled Prisma error code: ${exception.code}`, exception.stack);
                response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                    statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Erro interno ao processar sua requisição',
                    error: 'Internal Server Error',
                    timestamp: new Date().toISOString(),
                    path: request.url,
                });
        }
    }
    extractField(exception) {
        if (exception.meta && typeof exception.meta.target === 'string') {
            return exception.meta.target;
        }
        if (Array.isArray(exception.meta?.target)) {
            return exception.meta.target.join(', ');
        }
        return 'campo';
    }
};
exports.PrismaExceptionFilter = PrismaExceptionFilter;
exports.PrismaExceptionFilter = PrismaExceptionFilter = PrismaExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(client_1.Prisma.PrismaClientKnownRequestError)
], PrismaExceptionFilter);
//# sourceMappingURL=prisma-exception.filter.js.map