import { FormControl } from '@angular/forms';


import * as moment from 'moment';
import "../../node_modules/moment/locale/fr";
 
export class AgeValidator {




    static isValid(control: FormControl): any {
        moment.locale('fr');
        var age = moment().diff(control.value, 'years');
        
        if(age < 1){
            return {
                "my_error_text" : "Tu es trop jeune !"
            };
        }

        if(age < 18){
            return {
                "my_error_text" : "Tu dois avoir au moins 18 ans !"
            };
        }
 
        if (age > 80){
            return {
                "my_error_text": "Tu es trop vieux pour cette application !"
            };
        }
 
        return null;
    }

    
 
}