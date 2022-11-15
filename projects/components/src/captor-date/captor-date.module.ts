import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptorDateComponent } from './captor-date.component';
import { CaptorFormModule } from '../captor-form/captor-form.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    CaptorDateComponent
  ],
  imports: [
    CommonModule,
    CaptorFormModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports: [
    CaptorDateComponent
  ]
})
export class CaptorDateModule { }
