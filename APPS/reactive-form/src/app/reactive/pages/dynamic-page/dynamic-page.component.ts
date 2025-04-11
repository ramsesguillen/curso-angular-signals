import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject } from '@angular/core';

import { FormUtils } from '../../../utils/form-utils';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-dynamic-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './dynamic-page.component.html',
})
export class DynamicPageComponent {
  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    favoriteGames: this.fb.array([], Validators.minLength(3)),
  });

  newFavorite = new FormControl('', Validators.required);

  get favoriteGames(): FormArray {
    return this.myForm.get('favoriteGames') as FormArray;
  }

  onAddToFavorite() {
    if(this.newFavorite.invalid) return undefined;

    const newGame = this.newFavorite.value;
    this.favoriteGames.push(new FormControl(newGame, Validators.required));
    this.newFavorite.reset();
  }

  onDeleteFavorite(index: number) {
    this.favoriteGames.removeAt(index);
  }

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched()
      return undefined;
    }

  }

}
