import { TestBed } from '@angular/core/testing';

import { ContentSourceService } from './content-source.service';

describe('ContentSourceService', () => {
  let service: ContentSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
