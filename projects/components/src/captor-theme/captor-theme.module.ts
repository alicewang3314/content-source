import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon';
// import { CaptorThemeService } from './captor-theme.service';
import { CaptorThemeSwitchComponent } from './captor-theme-switch/captor-theme-switch.component';

@NgModule({
  declarations: [
    CaptorThemeSwitchComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    CaptorThemeSwitchComponent
  ],
  // providers: [
  //   CaptorThemeService
  // ]
})
export class CaptorThemeModule { }
