import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Asistencia', url: '/asistencia', icon: 'checkmark-done-circle' },
    { title: 'Retiro', url: '/retiro', icon: 'close-circle' },
    { title: 'Salida', url: '/salida', icon: 'person-remove' },
    { title: 'Reportes', url: '/reporte', icon: 'stats-chart' },
  ];
  constructor() {}
}
