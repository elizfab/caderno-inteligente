import { apiErrorInterceptor } from './api-error-interceptor';

describe('apiErrorInterceptor', () => {
  it('should be defined', () => {
    expect(apiErrorInterceptor).toBeDefined();
    expect(typeof apiErrorInterceptor).toBe('function');
  });
});
