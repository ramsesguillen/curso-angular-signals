import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject } from '@angular/core';

import { FormUtils } from '../../../utils/form-utils';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-register-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(FormUtils.namePattern)]],
    email: [
      '',
      [Validators.required, Validators.pattern(FormUtils.emailPattern)],
      [FormUtils.checkingServerResponse]
    ],
    username: [
      '',
      [Validators.required, Validators.minLength(6),Validators.pattern(FormUtils.notOnlySpacesPattern), FormUtils.notStrider]
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: [
      FormUtils.ifFieldOneEqualFieldTwo('password', 'confirmPassword')
    ]
  });


  onSubmit() {
    this.myForm.markAllAsTouched();
  }
}
