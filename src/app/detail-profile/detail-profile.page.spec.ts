import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProfilePage } from './detail-profile.page';

describe('DetailProfilePage', () => {
  let component: DetailProfilePage;
  let fixture: ComponentFixture<DetailProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
