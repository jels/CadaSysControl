import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListarAsistenciaprofesPage } from './listar-asistenciaprofes.page';

describe('ListarAsistenciaprofesPage', () => {
  let component: ListarAsistenciaprofesPage;
  let fixture: ComponentFixture<ListarAsistenciaprofesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListarAsistenciaprofesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListarAsistenciaprofesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
