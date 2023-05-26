import { AdmGuardMiddleware } from './adm-guard.middleware';

describe('AdmGuardMiddleware', () => {
  it('should be defined', () => {
    expect(new AdmGuardMiddleware()).toBeDefined();
  });
});
