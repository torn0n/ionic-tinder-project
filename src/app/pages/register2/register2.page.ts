import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserServiceService } from '../../services/user-service.service';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl
} from '@angular/forms';

import { NavController, ToastController } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

import { AgeValidator } from '../../validators/age';

const PICTURE_MAX: any = 'assets/imgs/cedric.jpg';
const PICTURE_THOMAS: any = 'assets/imgs/max.jpg';
const PICTURE_CEDRIC: any = 'assets/imgs/thomas.jpg';
@Component({
  selector: 'app-register2',
  templateUrl: './register2.page.html',
  styleUrls: ['./register2.page.scss']
})
export class Register2Page implements OnInit {
  registerForm2: FormGroup;
  user: any;
  description: AbstractControl;
  date: AbstractControl;
  target: AbstractControl;

  checkDescription = false;
  checkDate = false;
  checkTarget = false;

  workoutProgress: string;
  numberProgress: number;
  myBgColor = '#ed4264';

  form: any = {
    firstname: '',
    lastname: '',
    picture: '',
    birthday: '',
    target: '',
    description: ''
  };

  constructor(
    private userService: UserServiceService,
    public formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private localNotifications: LocalNotifications,
    public navCtrl: NavController
  ) {
    this.user = this.userService.getUserRegister();
    this.numberProgress = 50;
    this.updateProgress(this.numberProgress);

    this.registerForm2 = formBuilder.group({
      description: ['', Validators.compose([])],
      date: [
        '',
        Validators.compose([AgeValidator.isValid, Validators.required])
      ],
      target: ['', Validators.required]
    });

    this.description = this.registerForm2.controls['description'];
    this.date = this.registerForm2.controls['date'];
    this.target = this.registerForm2.controls['target'];

    this.barProgress(this.date, this.checkDate);
    // this.barProgress(this.description, this.checkDescription);
    this.barProgress(this.target, this.checkTarget);
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



  updateProgress(val) {
    // Update percentage value where the above is a decimal
     this.workoutProgress = val + '%';
     if (val === 100) {
      this.myBgColor = '#42ed4a';
     } else {
      this.myBgColor = '#ed4264';
     }
   }


  ngOnInit() {}

  goBack() {
    this.updateProgress(40);
    this.navCtrl.navigateBack('/');
  }

  goToMainPage() {
    this.navCtrl.navigateRoot('/home');
  }

  async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  onSubmit(form) {
    console.log(form);
    const user = {
      firstname : this.user.firstname,
      lastname : this.user.lastname,
      picture : this.user.picture,
      description : form.description,
      date : form.date,
      target : form.target,
      rank: 'Looser',
      gallery : [this.user.picture, PICTURE_MAX, PICTURE_CEDRIC, PICTURE_THOMAS]
    };
    this.userService.setUserInStorage(user);
    this.userService.setTokenLogIn(true);
    this.presentToast('Vos données ont bien été enregistrées');
    this.localNotifications.schedule({
      id: 1,
      title: 'Succès : Preparer le terrain',
      text: 'Terminer l\'inscription.',
      data: 'test'
     });
     if (user.target === 'both') {
      this.localNotifications.schedule({
        id: 2,
        title: 'Succès : Ouverture d\'esprit',
        text: 'Aimer les hommes et les femmes.',
        data: 'test',
       });
     }
    this.goToMainPage();
  }
}
