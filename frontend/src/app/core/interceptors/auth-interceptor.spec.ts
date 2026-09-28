import { authInterceptor } from './auth-interceptor';

describe('authInterceptor', () => {
  it('should be defined', () => {
    expect(authInterceptor).toBeDefined();
    expect(typeof authInterceptor).toBe('function');
  });
});
