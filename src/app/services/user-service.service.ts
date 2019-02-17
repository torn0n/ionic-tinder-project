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

/*
// CA MARCHE
takePicture(sourcetype: any): any {

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
    // If it's base64:
    const base64Image = 'data:image/jpeg;base64,' + imageData;
    return base64Image;
  }, (err) => {
    console.log('erreur ?');
    // this.presentToast('Error while selecting image.');
  });
}


  getCameraPermission(sourcetype: any): any {
    // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA);

    const successCallback = function (status: any) {
      if (status === this.diagnostic.permissionStatus.GRANTED) {
        return this.takePicture(sourcetype);
      } else {
        alert('Vous n\'avez pas la permission');
      }
    };
    const errorCallback = (e: any) => console.error(e);

    return this.diagnostic.getPermissionAuthorizationStatus(this.diagnostic.permission.READ_EXTERNAL_STORAGE).then(function (status) {
      switch (status) {
        case this.diagnostic.permissionStatus.GRANTED:
          console.log('Permission granted to use the camera');
          return this.takePicture(sourcetype);
        case this.diagnostic.permissionStatus.NOT_REQUESTED:
          console.log('Permission to use the camera has not been requested yet');
          return this.diagnostic.requestCameraAuthorization(successCallback, errorCallback, true);
        case this.diagnostic.permissionStatus.DENIED:
          console.log('Permission denied to use the camera - ask again?');
          return this.diagnostic.requestCameraAuthorization(successCallback, errorCallback, true);
        case this.diagnostic.permissionStatus.DENIED_ALWAYS:
          console.log('Permission permanently denied to use the camera - guess we won\'t be using it then!');
          break;
      }
    }, function (error) {
      console.error('The following error occurred: ' + error);
    }, );
  }


  openCamera(): any {

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      result => {
        alert(result.hasPermission);
        if (!result.hasPermission) {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
          .then( cam => {
            alert('permission result ' + JSON.stringify(cam) );
            return this.capturingPicture();
          })
          .catch( error => {
            alert('permission error occured ' + JSON.stringify(error) );
          });
        } else {
          return this.capturingPicture();
        }
      },
      err => {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA);
      });
  }

  capturingPicture(): any {
    alert('capturingPicture');

    const options: CameraOptions = {
      quality: 75,
      sourceType : this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      correctOrientation: true
    };

    this.camera.getPicture(options).then((imageData) => {
      const base64Image = 'data:image/jpeg;base64,' + imageData;
      return base64Image;
    }, (err) => {
      // Handle error
      alert('get picture error => ' + err);
    });
  }
*/
}
