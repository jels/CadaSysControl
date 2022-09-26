import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarAsistenciaprofesPageRoutingModule } from './listar-asistenciaprofes-routing.module';

import { ListarAsistenciaprofesPage } from './listar-asistenciaprofes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarAsistenciaprofesPageRoutingModule
  ],
  declarations: [ListarAsistenciaprofesPage]
})
export class ListarAsistenciaprofesPageModule {}
