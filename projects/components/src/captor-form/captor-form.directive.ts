import { Directive, ElementRef, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: 'form[captorForm]'
})
export class CaptorFormDirective {
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  constructor(private host: ElementRef<HTMLFormElement>) {
    this.host.nativeElement.addEventListener('submit', () => {
      this.onSubmit.emit();
    });
  }
}