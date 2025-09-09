/**
 * Base Controller Class
 * Provides common functionality for all domain controllers
 */

import { Request, Response, NextFunction } from 'express';

export abstract class BaseController {
  /**
   * Standard success response format
   */
  protected sendSuccess(res: Response, data: any, message: string = 'Success', statusCode: number = 200) {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Standard error response format
   */
  protected sendError(res: Response, error: string, statusCode: number = 400) {
    res.status(statusCode).json({
      success: false,
      error,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Standard validation error response
   */
  protected sendValidationError(res: Response, errors: any[]) {
    res.status(422).json({
      success: false,
      error: 'Validation failed',
      details: errors,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Handle async controller methods with error catching
   */
  protected asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  /**
   * Extract pagination parameters
   */
  protected getPaginationParams(req: Request) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    
    return { page, limit, offset };
  }

  /**
   * Extract filter parameters
   */
  protected getFilterParams(req: Request, allowedFilters: string[]) {
    const filters: any = {};
    
    allowedFilters.forEach(filter => {
      if (req.query[filter]) {
        filters[filter] = req.query[filter];
      }
    });
    
    return filters;
  }
}