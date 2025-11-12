import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    this.logger.error(
      `Prisma Error [${exception.code}]: ${exception.message}`,
      exception.stack,
    );

    switch (exception.code) {
      case 'P2002':
        const field = this.extractField(exception);
        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: `Já existe um registro com este ${field}`,
          error: 'Conflict',
          timestamp: new Date().toISOString(),
          path: request.url,
        });
        break;

      case 'P2025':
        response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Registro não encontrado',
          error: 'Not Found',
          timestamp: new Date().toISOString(),
          path: request.url,
        });
        break;

      case 'P2003':
        response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Violação de chave estrangeira. Verifique as referências.',
          error: 'Bad Request',
          timestamp: new Date().toISOString(),
          path: request.url,
        });
        break;

      case 'P2014':
        response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Relação obrigatória não foi fornecida',
          error: 'Bad Request',
          timestamp: new Date().toISOString(),
          path: request.url,
        });
        break;

      case 'P2011':
        response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Campo obrigatório não foi fornecido',
          error: 'Bad Request',
          timestamp: new Date().toISOString(),
          path: request.url,
        });
        break;

      default:
        this.logger.error(
          `Unhandled Prisma error code: ${exception.code}`,
          exception.stack,
        );
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Erro interno ao processar sua requisição',
          error: 'Internal Server Error',
          timestamp: new Date().toISOString(),
          path: request.url,
        });
    }
  }

  private extractField(exception: Prisma.PrismaClientKnownRequestError): string {
    if (exception.meta && typeof exception.meta.target === 'string') {
      return exception.meta.target;
    }
    if (Array.isArray(exception.meta?.target)) {
      return exception.meta.target.join(', ');
    }
    return 'campo';
  }
}

