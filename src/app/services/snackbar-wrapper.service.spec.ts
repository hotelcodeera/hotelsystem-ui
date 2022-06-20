import { TestBed } from '@angular/core/testing';

import { SnackbarWrapperService } from './snackbar-wrapper.service';

describe('SnackbarWrapperService', () => {
  let service: SnackbarWrapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnackbarWrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
