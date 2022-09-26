import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarAsistenciaprofesPage } from './listar-asistenciaprofes.page';

const routes: Routes = [
  {
    path: '',
    component: ListarAsistenciaprofesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarAsistenciaprofesPageRoutingModule {}
