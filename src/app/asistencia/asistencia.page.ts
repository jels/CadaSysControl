import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import jsQR from 'jsqr';
import { ReportesService } from '../services/reportes.service';



@Component({
    selector: 'app-asistencia',
    templateUrl: './asistencia.page.html',
    styleUrls: ['./asistencia.page.scss'],
    standalone: false
})
export class AsistenciaPage implements OnInit {
  scanActive = false;
  scanResult = null;

  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;

  videoElement: any;
  canvasElement: any;
  canvasContext: any;
  loading: HTMLIonLoadingElement;
  fecha = new Date().toLocaleDateString();
  hora = new Date().toLocaleTimeString();
  contar: number = 0;
  existeEs: number = 0;
  existe: number = 0;
  horaActual = this.hora.split(":")[0];
  minuto = this.hora.split(":")[1];
  _turno: String = "";


  constructor(private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore,
    private _existeCodigo: ReportesService) { }

  ngOnInit() {
    this.hora;
    //console.log("Fecha", this.hora);
    if (this.horaActual < "13") {
      //console.log("Mañana");
      //console.log("minuto", this.minuto);
      this._turno = "Mañana";
    } else {
      //console.log("Tarde");
      this._turno = "Tarde";
    }

  }

  ngAfterViewInit() {
    this.videoElement = this.video.nativeElement;
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
  }

  async startScan() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    this.videoElement.srcObject = stream;
    this.videoElement.setAttribute('playsinline', true);
    this.videoElement.play();

    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();

    requestAnimationFrame(this.scan.bind(this));
  }

  async scan() {
    console.log('SCAN');
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }

      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );

      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });
      console.log('code: ', code);

      if (code) {
        if (code.data.length === 16) {
          this.scanActive = false;
          this.scanResult = code.data;
          //console.log("Resultado del scann: ", this.scanResult);
          //if (this.existeQr(this.scanResult) === 1) {
          //console.log("La fecha es: ", this.fecha);
          //console.log("La fecha es: ", this._turno);
          //console.log("Ingreso para cargar datos: true");
          this.firestore.collection("asistencia").add({
            "codigoEstudiante": this.scanResult,
            "fechaIngreso": this.fecha,
            "horaIngreso": this.hora,
            "turno": this._turno
          });
          this.presentToast(this.scanResult);
          //this.showQrToast();
          //} else {
          //  this.incorrectToast(this.scanResult);
          //}

        } else if (code.data.length === 14) {
          this.scanActive = false;
          this.scanResult = code.data;
          this.firestore.collection("asistenciaProfe").add({
            "qrProfe": this.scanResult,
            "fechaIngreso": this.fecha,
            "horaIngreso": this.hora,
            "nombreProfe": "Jonathan Elias",
            "apellidoProfe": "Leonardi Sauer",
            "horaSalida": this.hora,
            "marca": "Activo"
          });
          this.presentToast(this.scanResult);
        } else {
          requestAnimationFrame(this.scan.bind(this));
        }
      } else {
        if (this.scanActive) {
          requestAnimationFrame(this.scan.bind(this));
        }
      }

    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }

  existeQr(codigo: String) {
    //console.log("Llego el dato: ", codigo);
    this._existeCodigo.obtenerAsistencia().subscribe(doc => {
      //console.log(this.existeEs);
      // console.log("Llego aqui...");
      doc.forEach((element: any) => {
        if (element.payload.doc.data().codigoEstudiante === codigo) {
          this.existeEs = 1;
          //console.log("Existe el codigo ya en la lista", this.existeEs);
          if (element.payload.doc.data().fechaIngreso === this.fecha) {
            this.existeEs = 1;
            //console.log(this._turno);
            //console.log("Existe el codigo ya en la lista y con la misma fecha", this.existeEs);
            if (element.payload.doc.data().turno === this._turno) {
              //console.log(this._turno);
              this.existeEs = 0;
              //console.log("Existe el codigo ya en la lista y con la misma fecha y mismo turno", this.existeEs);
            } else {
            }
          } else {
          }
        } else {
        }
        this.existe = this.existeEs;
      });
      //console.log("Fin del ciclo resultado: ", this.existeEs);
      //console.log("Fin del ciclo resultado: ", this.existe);
    });
    //console.log("Respuesta es: ", this.existe);
    return this.existe;
  }

  stopScan() {
    this.scanActive = false;
  }

  reset() {
    this.scanResult = null;
  }

  async presentToast(codigo: any) {
    const toast = await this.toastCtrl.create({
      header: 'Mensaje de Confirmación',
      message: 'Asistencia del estudiante insertado correctamente ' + codigo,
      icon: 'cloud-done',
      position: 'top',
      color: 'success',
      duration: 1500
    });
    toast.present();
  }

  async incorrectToast(codigo: any) {
    const toast = await this.toastCtrl.create({
      header: 'Mensaje de Negación',
      message: 'Estudiante ya registrado ' + codigo,
      icon: 'cloud-done',
      position: 'top',
      color: 'danger',
      duration: 1500
    });
    toast.present();
  }

  async showQrToast() {
    const toast = await this.toastCtrl.create({
      message: `Open ${this.scanResult}?`,
      position: 'top',
      buttons: [
        {
          text: 'Open',
          handler: () => {
            window.open(this.scanResult, '_system', 'location=yes');
          }
        }
      ]
    });
    toast.present();
  }


}
