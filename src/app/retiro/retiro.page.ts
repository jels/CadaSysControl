import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, ToastController } from '@ionic/angular';
import jsQR from 'jsqr';

@Component({
  selector: 'app-retiro',
  templateUrl: './retiro.page.html',
  styleUrls: ['./retiro.page.scss'],
})
export class RetiroPage implements OnInit {

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

  constructor(private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore) { }

  ngOnInit() {

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
          console.log("La fecha es: ", this.fecha);
          this.firestore.collection("retiro").add({
            "codigoEstudiante": this.scanResult,
            "fechaIngreso": this.fecha,
            "horaIngreso": this.hora,
            "marca": "Retiro"
          });
          this.presentToast(this.scanResult);
          //this.showQrToast();
        } else if (code.data.length === 14) {
          this.scanActive = false;
          this.scanResult = code.data;
          console.log("La fecha es: ", this.fecha);
          this.firestore.collection("asistenciaProfe").add({
            "qrProfe": this.scanResult,
            "fechaIngreso": this.fecha,
            "horaIngreso": this.hora,
            "nombreProfe": "Jonathan Elias",
            "apellidoProfe": "Leonardi Sauer",
            "horaSalida": this.hora,
            "marca": "Inactivo"
          });
          this.presentToast(this.scanResult);
          //this.showQrToast();
        } else {
          requestAnimationFrame(this.scan.bind(this));
        }
        requestAnimationFrame(this.scan.bind(this));
      } else {
        if (this.scanActive) {
          requestAnimationFrame(this.scan.bind(this));
        }
      }

    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }

  async presentToast(codigo: any) {
    const toast = await this.toastCtrl.create({
      header: 'Mensaje de Confirmación',
      message: 'Retiro del estudiante insertado correctamente ' + codigo,
      icon: 'cloud-done',
      position: 'top',
      color: 'success',
      duration: 1500
    });
    toast.present();
  }



  stopScan() {
    this.scanActive = false;
  }

  reset() {
    this.scanResult = null;
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
