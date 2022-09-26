import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportesService } from '../services/reportes.service';

@Component({
  selector: 'app-listar-asistenciaprofes',
  templateUrl: './listar-asistenciaprofes.page.html',
  styleUrls: ['./listar-asistenciaprofes.page.scss'],
})
export class ListarAsistenciaprofesPage implements OnInit {
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
    this.contarProfesPresentes();
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

}
