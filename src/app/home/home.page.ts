import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportesService } from '../services/reportes.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  contEstudMatriculados: number = 0;
  contAsistencia: number = 0;
  contAsistenciaTarde: number = 0;
  contRetiro: number = 0;
  contSalida: number = 0;
  contProfesPresentes: number = 0;
  fecha = new Date().toLocaleDateString();
  horaCompleta = new Date().toLocaleTimeString();
  hora = this.horaCompleta.split(":")[0];
  minuto = this.horaCompleta.split(":")[1];
  contar: number = 0;
  _turno: String = "";

  constructor(private router: Router,
    private _contarAsist: ReportesService) { }

  ngOnInit() {
    this.fecha;
    //console.log("Fecha", this.fecha);
    if (this.hora < "13") {
      console.log("Mañana");
      console.log("minuto", this.minuto);
      this._turno = "Mañana";
    } else {
      console.log("Tarde");
      this._turno = "Tarde";
    }
    this.contarEstudiantes();
    this.contarRetirados();
    this.contarSalidas();
    this.contarEstudiantesTarde();
    this.contarEstudiantesMatriculados();
    this.contarProfesPresentes();
  }

  goToAsistencia() {
    this.router.navigate(['/asistencia']);
  }

  goToRetiro() {
    this.router.navigate(['/retiro']);
  }

  goToSalida() {
    this.router.navigate(['/salida']);
  }

  contarEstudiantesTarde() {
    this._contarAsist.obtenerAsistencia().subscribe(doc => {
      this.contar = 0;
      doc.forEach((element: any) => {
        //console.log(element.payload.doc.data().horaIngreso.split(":")[0]);
        if (element.payload.doc.data().horaIngreso.split(":")[0] > "6") {
          this.contar++;
          console.log("Contador aumentado: ", this.contar);
        } else {
        }
      });
      this.contAsistenciaTarde = this.contar;
    });
    return this.contAsistenciaTarde;
  }

  contarProfesPresentes() {
    this._contarAsist.obtenerAsistenciaProfes().subscribe(doc => {
      //console.log(doc.length);
      //console.log(doc);
      this.contar = 0;
      doc.forEach((element: any) => {
        //console.log(element.payload.doc.data().fechaIngreso);
        if (element.payload.doc.data().fechaIngreso === this.fecha) {
          this.contar++;
        } else {
          //console.log("Fecha mal: ", element.payload.doc.data().fechaIngreso);
        }
      });
      console.log("Contador de Asitencia profes hoy: ", this.contar);
      this.contProfesPresentes = this.contar;
    });
    return this.contProfesPresentes;
  }


  contarEstudiantes() {
    this._contarAsist.obtenerAsistencia().subscribe(doc => {
      //console.log(doc.length);
      //console.log(doc);
      this.contar = 0;
      doc.forEach((element: any) => {
        //console.log(element.payload.doc.data().fechaIngreso);
        if (element.payload.doc.data().fechaIngreso === this.fecha) {
          if (element.payload.doc.data().turno === "Mañana") {
            this.contar++;
          } else {
          }
        } else {
          //console.log("Fecha mal: ", element.payload.doc.data().fechaIngreso);
        }
      });
      console.log("Contador de Asitencia hoy: ", this.contar);
      this.contAsistencia = this.contar;
    });
    return this.contAsistencia;
  }

  contarRetirados() {
    this._contarAsist.obtenerRetiro().subscribe(doc => {
      //console.log(doc.length);
      //console.log(doc);
      this.contar = 0;
      doc.forEach((element: any) => {
        //console.log(element.payload.doc.data().fechaIngreso);
        if (element.payload.doc.data().fechaIngreso === this.fecha) {
          this.contar++;
        } else {
          //console.log("Fecha mal: ", element.payload.doc.data().fechaIngreso);
        }
      });
      //console.log("Contador de Retiro hoy: ", this.contar);
      this.contRetiro = this.contar;
    });
    return this.contRetiro;
  }

  contarSalidas() {
    this._contarAsist.obtenerSalida().subscribe(doc => {
      //console.log(doc.length);
      //console.log(doc);
      this.contar = 0;
      doc.forEach((element: any) => {
        //console.log(element.payload.doc.data().fechaIngreso);
        if (element.payload.doc.data().fechaIngreso === this.fecha) {
          this.contar++;
        } else {
          //console.log("Fecha mal: ", element.payload.doc.data().fechaIngreso);
        }
      });
      //console.log("Contador de Salida hoy: ", this.contar);
      this.contSalida = this.contar;
    });
    return this.contSalida;
  }

  contarEstudiantesMatriculados() {
    this._contarAsist.obtenerCantEstudiantes().subscribe(doc => {
      this.contar = 0;
      doc.forEach((element: any) => {
        this.contar++;
      });
      console.log("Contador Estudiantes Matri: ", this.contar);
      this.contEstudMatriculados = this.contar;
    });
    console.log("Estudiantes Matriculados: ", this.contEstudMatriculados);
    return this.contEstudMatriculados;
  }
}
