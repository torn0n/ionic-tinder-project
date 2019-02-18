import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Observable, of, from } from 'rxjs';

import { mergeMap, map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import {  ToastController } from '@ionic/angular';

/**
 * Service gérant l'utilisateur aka le prof
 */
const USER_STORAGE_TAG: any = 'userStorage';
const TOKEN_LOGIN: any = 'tokenLogIn';
const USER_DEFAULT_PICTURE: any = 'assets/imgs/default-avatar.png';
const PICTURE_MAX: any = 'assets/imgs/cedric.jpg';
const PICTURE_THOMAS: any = 'assets/imgs/max.jpg';
const PICTURE_CEDRIC: any = 'assets/imgs/thomas.jpg';
@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  user: any;
  rank = '';

  constructor(public http: HttpClient,
    private storage: Storage,
    public diagnostic: Diagnostic,
    public androidPermissions: AndroidPermissions,
    private camera: Camera,
    private toastCtrl: ToastController) {
    console.log('Hello UserServiceProvider Provider');
    this.user = {};
  }

  public setUserRegister(data) {
    this.user = data;
  }

  public getUserRegister() {
    return this.user;
  }



  setRank(nbMatch: number) {
    if (nbMatch < 10) {
      this.rank = 'Looser';
    }
    if (nbMatch >= 10 && nbMatch < 20) {
      this.rank = 'Dragueur';
    }
    if (nbMatch >= 20 && nbMatch < 30) {
      this.rank = 'Tombeur';
    }
    if (nbMatch >= 30 && nbMatch < 40) {
      this.rank = 'Séducteur';
    }
    if (nbMatch >= 40 && nbMatch < 50) {
      this.rank = 'Don Juan';
    }
    if (nbMatch >= 50) {
      this.rank = 'Instanic\'eur';
    }
    return this.rank;
  }

  getUserInStorage(): Observable<any> {
    return from(this.storage.get(USER_STORAGE_TAG)).pipe(mergeMap((val: any) => {
      if (val == null) {
        this.user = {
          firstname: '',
          lastname: '',
          picture: USER_DEFAULT_PICTURE,
          date: '',
          target: '',
          description: '',
          rank: 'Looser',
          gallery: [USER_DEFAULT_PICTURE, PICTURE_MAX, PICTURE_CEDRIC, PICTURE_THOMAS]
        };
        return of(this.user);
      } else {
        this.user = val;
        return of(this.user);
      }
    }));
  }

  setUserInStorage(user: any) {
    this.storage.set(USER_STORAGE_TAG, user);
  }

  getTokenLogIn(): Observable<any> {
    return from(this.storage.get(TOKEN_LOGIN)).pipe(mergeMap((val: any) => {
      if (val == null) {
        return of(false);
      } else {
        return of(val);
      }
    }));
  }

  setTokenLogIn(token: any) {
    this.storage.set(TOKEN_LOGIN, token);
  }




  openCameraOrGallery(sourcetype: any): any {
    const options: CameraOptions = {
      quality: 75,
      sourceType: sourcetype,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      correctOrientation: true
    };

    return this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     const base64Image = 'data:image/jpeg;base64,' + imageData;
     return base64Image;
    }, (err) => {
      this.presentToast('You don\'t have permission, enable it for use');
    });
}

async presentToast(text) {
  const toast = await this.toastCtrl.create({
    message: text,
    duration: 3000,
    position: 'bottom'
  });
  toast.present();
}

}
