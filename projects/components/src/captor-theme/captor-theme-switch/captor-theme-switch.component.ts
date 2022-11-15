import { Component, OnInit } from '@angular/core';
import { CaptorThemeService } from '../captor-theme.service'

@Component({
  selector: 'captor-theme-switch',
  templateUrl: './captor-theme-switch.component.html',
  styleUrls: ['./captor-theme-switch.component.scss']
})
export class CaptorThemeSwitchComponent implements OnInit {
  private _theme = 'light';

  toggle() {
    this._theme = this._theme === 'light' ? 'dark' : 'light';
    // console.log('>>>>>>> toggle theme', this._theme);
    this._themeService.updateTheme(this._theme);
  }

  get theme() {
    return this._theme;
  }

  constructor(private _themeService: CaptorThemeService) {
    this._theme = this._themeService.appTheme;
   }

  ngOnInit(): void {
  }
}
