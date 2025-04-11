import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';

async function sleep() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, 2500);
    })
}


export class FormUtils {

    static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
    static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
    static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';

    static getTextErrors(errors: ValidationErrors) {
        for (const key of Object.keys(errors)) {
            switch (key) {
                case 'required':
                    return 'Este campo es obligatorio'
                case 'minlength':
                    return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;
                case 'min':
                    return `Valor mínimo de ${errors['min'].requiredLength}`;
                case 'email':
                    return `El valor ingresado no es un correo electrónico`;
                case 'emailTaken':
                    return `El correo ya está siendo usado por otro usuario`;
                case 'pattern':
                    if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
                        return 'El correo electrónico no es permitido';
                    }
                    return 'Error de patrón contra expresión regular ';
                default:
                    return 'Error no controlado';
            }
        }
        return null;
    }

    static isValidField(form: FormGroup, fieldName: string): boolean | null {
        return (form.controls[fieldName].errors && form.controls[fieldName].touched);
    }

    static getFieldError(form: FormGroup, fieldName: string): string | null {
        if (!form.controls[fieldName]) return null;

        const errors = form.controls[fieldName].errors;
        if (!errors) return null;

        return FormUtils.getTextErrors(errors);
    }

    static isValidFieldInArray(formArray: FormArray, index: number) {
        return (
            formArray.controls[index].errors && formArray.controls[index].touched
        )
    }

    static getFieldErrorInArray(formArray: FormArray, index: number): string | null {
        if (!formArray.controls[index]) return null;

        const errors = formArray.controls[index].errors;
        if (!errors) return null;

        return FormUtils.getTextErrors(errors);
    }

    static ifFieldOneEqualFieldTwo(field1: string, field2: string) {
        return (formGroup: AbstractControl) => {
            const field1Value = formGroup.get(field1)?.value;
            const field2Value = formGroup.get(field2)?.value;

            return field1Value === field2Value ? null : { passwordsNotEqual: true };
        };
    }

    static async checkingServerResponse(control: AbstractControl): Promise<ValidationErrors | null> {
        console.log('validando server')
        await sleep();

        const formValue = control.value;

        if (formValue === 'hola@gmail.com') {
            return {
                emailTaken: true
            }
        }

        return null;
    }
    static  notStrider(control: AbstractControl): ValidationErrors | null {
        const formValue = control.value;
        if (formValue === 'strider') {
            return {
                notStrider: true
            }
        }

        return null;
    }
}
