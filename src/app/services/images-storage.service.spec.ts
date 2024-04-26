import { TestBed } from '@angular/core/testing';

import { ImagesStorageService } from './images-storage.service';

describe('ImagesStorageService', () => {
  let service: ImagesStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagesStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
