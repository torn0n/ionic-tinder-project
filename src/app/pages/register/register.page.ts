import {
  Component,
  ANALYZE_FOR_ENTRY_COMPONENTS
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl
} from '@angular/forms';
import {
  Camera,
  CameraOptions
} from '@ionic-native/camera/ngx';
import {
  AlertController,
  NavController,
  NavParams,
  ActionSheetController,
  ToastController,
  LoadingController
} from '@ionic/angular';

import {
  UserServiceService
} from '../../services/user-service.service';

const USER_DEFAULT_PICTURE: any = 'assets/imgs/default-avatar.png';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerForm: FormGroup;
  user_picture = USER_DEFAULT_PICTURE;
  workoutProgress: string = '0' + '%';
  numberProgress = 0;
  firstname: AbstractControl;
  lastname: AbstractControl;
  checkLastName = false;
  checkFirstName = false;

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private toastCtrl: ToastController,
    private userService: UserServiceService,
    private alertCtrl: AlertController,
    public formBuilder: FormBuilder) {

    userService.setTokenLogIn(false);

    this.registerForm = formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('^[a-zA-Zéèï ,.\'-]+$'), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('^[a-zA-Zéèï ,.\'-]+$'), Validators.required])]
    });

    this.firstname = this.registerForm.controls['firstName'];
    this.lastname = this.registerForm.controls['lastName'];

    userService.getUserInStorage().subscribe(data => {
      this.registerForm.get('firstName').setValue(data.firstname);
      this.registerForm.get('lastName').setValue(data.lastname);
      this.user_picture = data.picture;
    });


    this.barProgress(this.firstname, this.checkFirstName);
    this.barProgress(this.lastname, this.checkLastName);
  }

  updateProgress(val) {
    // Update percentage value where the above is a decimal
    this.workoutProgress = val + '%';
  }

  barProgress(nameData, checkData) {
    nameData.statusChanges.subscribe(data => {
      if (data === 'VALID' && !checkData) {
        this.numberProgress += 25;
        checkData = true;
      }
      if (data === 'INVALID' && checkData) {
        this.numberProgress -= 25;
        checkData = false;
      }
      this.updateProgress(this.numberProgress);
    });
  }

  onSubmit(form) {
    console.log(form);
    const user = {
      firstname: form.firstName,
      lastname: form.lastName,
      picture: this.user_picture
    };
    // this.userService.setUserInStorage(user);
    this.goToReg2(user, this.numberProgress);
  }

  goToReg2(data, numberProgress) {
    this.navCtrl.push(Register2Page, {
      user : data,
      barProgress: numberProgress
    });
  }

  async useCameraOrGallery(sourcetype: any) {
    const loading = await this.loadingCtrl.create();
    return this.userService.openCameraOrGallery(sourcetype).then((picture) => {
      if (picture) {
        this.user_picture = picture;
      }
      loading.dismiss();
    }, error => {
      alert(error);
    });
  }

  async onWelcome() {
    const alert = await this.alertCtrl.create({
      message: '<p>Le monde se divise en deux catégories : <br><br>"Les Instanic\'eurs, et les autres. <br> Toi, tu instanikes !"</p>',
      buttons: ['J\'instanike !']
    });
    await alert.present();
  }

  async presentAlert() {
    const alert = await this.actionSheetCtrl.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Choisis ta photo de profil',
      backdropDismiss: true,
      buttons: [{
          text: 'Galerie',
          icon: 'ios-images',
          handler: () => {
            // this.getCameraPermission(this.camera.PictureSourceType.PHOTOLIBRARY);
            this.useCameraOrGallery(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Photo',
          icon: 'ios-camera',
          handler: () => {
            // this.getCameraPermission(this.camera.PictureSourceType.CAMERA);
            this.useCameraOrGallery(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            this.presentToast('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
