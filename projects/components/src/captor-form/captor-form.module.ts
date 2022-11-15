import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaptorFormDirective } from './captor-form.directive';

@NgModule({
  declarations: [
    CaptorFormDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CaptorFormDirective
  ]
})
export class CaptorFormModule { }
