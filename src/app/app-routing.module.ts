import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./folder/folder.module').then(m => m.FolderPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'asistencia',
    loadChildren: () => import('./asistencia/asistencia.module').then(m => m.AsistenciaPageModule)
  },
  {
    path: 'retiro',
    loadChildren: () => import('./retiro/retiro.module').then(m => m.RetiroPageModule)
  },
  {
    path: 'salida',
    loadChildren: () => import('./salida/salida.module').then(m => m.SalidaPageModule)
  },
  {
    path: 'reporte',
    loadChildren: () => import('./reporte/reporte.module').then(m => m.ReportePageModule)
  },
  {
    path: 'lista-asistencia',
    loadChildren: () => import('./lista-asistencia/lista-asistencia.module').then(m => m.ListaAsistenciaPageModule)
  },
  {
    path: 'listar-asistenciaprofes',
    loadChildren: () => import('./listar-asistenciaprofes/listar-asistenciaprofes.module').then(m => m.ListarAsistenciaprofesPageModule)
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
