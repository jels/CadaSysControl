import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private firebase: AngularFirestore) { }

  obtenerAsistencia(): Observable<any> {
    return this.firebase.collection('asistencia').snapshotChanges();
  }

  obtenerRetiro(): Observable<any> {
    return this.firebase.collection('retiro').snapshotChanges();
  }

  obtenerSalida(): Observable<any> {
    return this.firebase.collection('salida').snapshotChanges();
  }

  obtenerCantEstudiantes(): Observable<any> {
    return this.firebase.collection('estudiantes').snapshotChanges();
  }

  obtenerCantProfesores(): Observable<any> {
    return this.firebase.collection('profesores').snapshotChanges();
  }

  obtenerAsistenciaProfes(): Observable<any> {
    return this.firebase.collection('asistenciaProfe').snapshotChanges();
  }

  
}
