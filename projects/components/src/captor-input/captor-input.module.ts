import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PhoneMaskDirective, SsnMaskDirective, DateMaskDirective, ZipcodeDirective, ZipcodeExtDirective } from './captor-input-mask.directive';
import { CaptorInputComponent } from './captor-input.component';
import { CaptorFormModule } from '../captor-form/captor-form.module';

@NgModule({
  declarations: [
    PhoneMaskDirective,
    SsnMaskDirective,
    DateMaskDirective,
    ZipcodeDirective,
    ZipcodeExtDirective,
    CaptorInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    CaptorFormModule
  ],
  exports: [
    PhoneMaskDirective,
    SsnMaskDirective,
    DateMaskDirective,
    ZipcodeDirective,
    ZipcodeExtDirective,
    CaptorInputComponent
  ]
})
export class CaptorInputModule { }
