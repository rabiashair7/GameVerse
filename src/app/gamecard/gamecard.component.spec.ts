import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCardComponent } from './gamecard.component';

describe('GamecardComponent', () => {
  let component: GameCardComponent;
  let fixture: ComponentFixture<GameCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameCardComponent]
    });
    fixture = TestBed.createComponent(GameCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
