/**
 * Base Controller Tests
 * Tests for the base controller functionality
 */

import { Request, Response } from 'express';
import { BaseController } from '../../src/api/base/base-controller';

// Create a concrete implementation for testing
class TestController extends BaseController {
  public testSendSuccess(res: Response, data: any) {
    this.sendSuccess(res, data, 'Test success');
  }

  public testSendError(res: Response, error: string) {
    this.sendError(res, error, 400);
  }

  public testSendValidationError(res: Response, errors: any[]) {
    this.sendValidationError(res, errors);
  }

  public testGetPaginationParams(req: Request) {
    return this.getPaginationParams(req);
  }

  public testGetFilterParams(req: Request, allowedFilters: string[]) {
    return this.getFilterParams(req, allowedFilters);
  }

  public testAsyncHandler(fn: any) {
    return this.asyncHandler(fn);
  }
}

describe('BaseController', () => {
  let controller: TestController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    controller = new TestController();
    mockRequest = {
      query: {},
      params: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('sendSuccess', () => {
    it('should send success response with default parameters', () => {
      const testData = { test: 'data' };
      controller.testSendSuccess(mockResponse as Response, testData);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Test success',
        data: testData,
        timestamp: expect.any(String),
      });
    });
  });

  describe('sendError', () => {
    it('should send error response with proper format', () => {
      const errorMessage = 'Test error';
      controller.testSendError(mockResponse as Response, errorMessage);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: errorMessage,
        timestamp: expect.any(String),
      });
    });
  });

  describe('sendValidationError', () => {
    it('should send validation error response', () => {
      const errors = [{ field: 'name', message: 'Required' }];
      controller.testSendValidationError(mockResponse as Response, errors);

      expect(mockResponse.status).toHaveBeenCalledWith(422);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Validation failed',
        details: errors,
        timestamp: expect.any(String),
      });
    });
  });

  describe('getPaginationParams', () => {
    it('should return default pagination params when none provided', () => {
      const result = controller.testGetPaginationParams(mockRequest as Request);

      expect(result).toEqual({
        page: 1,
        limit: 20,
        offset: 0,
      });
    });

    it('should return custom pagination params when provided', () => {
      mockRequest.query = { page: '3', limit: '50' };
      const result = controller.testGetPaginationParams(mockRequest as Request);

      expect(result).toEqual({
        page: 3,
        limit: 50,
        offset: 100,
      });
    });
  });

  describe('getFilterParams', () => {
    it('should extract only allowed filters', () => {
      mockRequest.query = {
        name: 'test',
        status: 'active',
        unauthorized: 'should not be included',
      };

      const allowedFilters = ['name', 'status'];
      const result = controller.testGetFilterParams(
        mockRequest as Request,
        allowedFilters
      );

      expect(result).toEqual({
        name: 'test',
        status: 'active',
      });
    });

    it('should return empty object when no filters match', () => {
      mockRequest.query = {
        unauthorized: 'should not be included',
      };

      const allowedFilters = ['name', 'status'];
      const result = controller.testGetFilterParams(
        mockRequest as Request,
        allowedFilters
      );

      expect(result).toEqual({});
    });
  });

  describe('asyncHandler', () => {
    it('should handle successful async operations', async () => {
      const asyncFn = jest.fn().mockResolvedValue('success');
      const wrappedFn = controller.testAsyncHandler(asyncFn);

      await wrappedFn(mockRequest as Request, mockResponse as Response, mockNext);

      expect(asyncFn).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should catch and forward async errors', async () => {
      const error = new Error('Async error');
      const asyncFn = jest.fn().mockRejectedValue(error);
      const wrappedFn = controller.testAsyncHandler(asyncFn);

      await wrappedFn(mockRequest as Request, mockResponse as Response, mockNext);

      expect(asyncFn).toHaveBeenCalledWith(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});