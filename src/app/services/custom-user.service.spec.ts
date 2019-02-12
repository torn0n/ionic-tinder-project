import { TestBed } from '@angular/core/testing';

import { CustomUserService } from './custom-user.service';

describe('CustomUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomUserService = TestBed.get(CustomUserService);
    expect(service).toBeTruthy();
  });
});
