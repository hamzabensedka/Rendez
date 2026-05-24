import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

/** Single error envelope for all API errors. */
export interface ApiErrorBody {
  statusCode: number;
  error: string;
  message: string | string[];
  requestId?: string;
}

function prismaErrorCode(err: PrismaClientKnownRequestError): string {
  switch (err.code) {
    case 'P2002':
      return 'CONFLICT';
    case 'P2025':
      return 'NOT_FOUND';
    default:
      return 'DATABASE_ERROR';
  }
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<
      Request & { requestId?: string; id?: string }
    >();

    const requestId = request.requestId ?? request.id;

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'INTERNAL_ERROR';
    let message: string | string[] = 'An unexpected error occurred';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const body = res as Record<string, unknown>;
        if (Array.isArray(body.message)) {
          message = body.message as string[];
        } else if (typeof body.message === 'string') {
          message = body.message;
        } else if (typeof body.error === 'string') {
          message = body.error;
        }
        if (typeof body.error === 'string' && body.error !== message) {
          error = body.error.toUpperCase().replace(/\s+/g, '_');
        }
      }
      if (error === 'INTERNAL_ERROR') {
        if (statusCode === HttpStatus.NOT_FOUND) error = 'NOT_FOUND';
        else if (statusCode === HttpStatus.BAD_REQUEST) {
          error = Array.isArray(message) ? 'VALIDATION_ERROR' : 'BAD_REQUEST';
        } else if (statusCode === HttpStatus.UNAUTHORIZED) error = 'UNAUTHORIZED';
        else if (statusCode === HttpStatus.FORBIDDEN) error = 'FORBIDDEN';
        else if (statusCode === HttpStatus.CONFLICT) error = 'CONFLICT';
        else if (statusCode === HttpStatus.UNPROCESSABLE_ENTITY)
          error = 'VALIDATION_ERROR';
        else if (statusCode === HttpStatus.TOO_MANY_REQUESTS)
          error = 'TOO_MANY_REQUESTS';
        else error = `HTTP_${statusCode}`;
      }
    } else if (exception instanceof PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        statusCode = HttpStatus.CONFLICT;
        message = 'A record with this value already exists';
      } else if (exception.code === 'P2025') {
        statusCode = HttpStatus.NOT_FOUND;
        message = 'Record not found';
      } else {
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Database request failed';
      }
      error = prismaErrorCode(exception);
      this.logger.warn(
        `Prisma ${exception.code}: ${exception.message}${requestId ? ` [${requestId}]` : ''}`
      );
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        exception.stack ?? exception.message,
        requestId ? { requestId } : undefined
      );
    }

    const body: ApiErrorBody = {
      statusCode,
      error,
      message,
    };
    if (requestId) body.requestId = requestId;

    response.status(statusCode).json(body);
  }
}
