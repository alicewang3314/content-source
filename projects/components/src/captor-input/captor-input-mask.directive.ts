import { AfterViewInit, Directive, ElementRef, forwardRef, OnInit, Optional, Self, ViewContainerRef, Renderer2, HostListener} from '@angular/core';
import {
  NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl
} from '@angular/forms';

@Directive({
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BasicMaskDirective), // todo: different while using forward(useExisting: forwardRef(() => SsnMaskDirective))
    multi: true
  }],
  host: {
    '(input)': '_onInput($event)',
    '(blur)': '_onTouched()'
  }
})
export class BasicMaskDirective implements ControlValueAccessor {
  protected mask = '';
  // private _touched = false;

  writeValue(val: string) {
    if (!val) return;

    const nextVal = this._transform(val);
    this._updateInputVal(nextVal);
  }

  _onTouched = (_: any) => { };

  /* Write value to formControl */
  _onChange = (val: any) => { };

  /* Update the form control value */
  registerOnChange(fn: any): void {
    this._onChange = fn;
  };

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  @HostListener('document:keydown', ['$event'])
  _onKeyDown($event: any) {
    // what I want to solve here?
    // console.log('!!!!!!!on key down called', $event);
  }

  /* Take user raw input and apply the format according to type */
  _onInput($event: any) {
    let val = $event.target.value;

    // Resolve backspace
    if ($event.inputType === 'deleteContentBackward') {
      this._onChange(val.slice(0, -1));
      return;
    }

    // If input length reach the limit
    if (val.length > this.mask.length) {
      val = val.substring(0, this.mask.length);
      this._updateInputVal(val);
      this._onChange(val);
    }

    const nextVal = this._transform(val);
    this._updateInputVal(nextVal);
    this._onChange(nextVal);
  }

  private _updateInputVal(val: string) {
    this._renderedr.setProperty(
      this._elementRef.nativeElement,
      'value',
      val
    );
  }

  private _transform(raw: string): string {
    let nextVal = raw.replace(/\D/g, '');
    let pad = this.mask.replace(/\D/g, '').replace(/9/g, '_');
    let nextValMask = nextVal + pad.substring(0, pad.length - nextVal.length);
    let nextValMaskPos = 0;
    nextVal = '';

    for (let i = 0; i < this.mask.length; i++) {
      if (isNaN(parseInt(this.mask.charAt(i)))) {
        nextVal += this.mask.charAt(i);
      } else {
        nextVal += nextValMask[nextValMaskPos++];
      }
    }

    if (nextVal.indexOf('_') > -1) {
      // nextVal = nextVal.substr(0, nextVal.indexOf('_'));
      nextVal = nextVal.substring(0, nextVal.indexOf('_'));
    }

    return nextVal;
  }

  constructor(
    protected _elementRef: ElementRef<HTMLInputElement>,
    private _renderedr: Renderer2
    // private _viewContainerRef: ViewContainerRef,
    // private ngControl: NgControl
  ) {
    //todo
    // this._inputValueAccessor = this._elementRef.nativeElement;
  }
}

@Directive({
  selector: '[phoneMask]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: PhoneMaskDirective,
    multi: true
  }]
})
export class PhoneMaskDirective extends BasicMaskDirective {
  override mask = '(999) 999 - 9999';
}

@Directive({
  selector: '[ssnMask]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: SsnMaskDirective,
    multi: true
  }]
})
export class SsnMaskDirective extends BasicMaskDirective {
  override mask = '999 - 99 - 9999';

  // constructor(
  //   @Optional() @Self() ngControl: NgControl,
  // ) {
  //   super(ngControl);
  // }
}

@Directive({
  selector: '[zipcodeMask]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ZipcodeDirective,
    multi: true
  }]
})
export class ZipcodeDirective extends BasicMaskDirective {
  override mask = '99999';
}

@Directive({
  selector: '[zipcodeExtMask]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ZipcodeExtDirective,
    multi: true
  }]
})
export class ZipcodeExtDirective extends BasicMaskDirective {
  override mask = '9999';
}

@Directive({
  selector: '[dateMask]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: DateMaskDirective,
    multi: true
  }]
})
export class DateMaskDirective extends PhoneMaskDirective {
  override mask = '99/99/9999';
}
