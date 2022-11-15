import { AfterViewInit, Component, Input, ViewEncapsulation, OnInit, Optional, OnDestroy, forwardRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CaptorFormDirective } from '../captor-form/captor-form.directive';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const EXE_COUNTER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CaptorInputComponent),
  multi: true,
};

@Component({
  selector: 'captor-input',
  exportAs: 'captorInput',
  templateUrl: './captor-input.component.html',
  styleUrls: ['./captor-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EXE_COUNTER_VALUE_ACCESSOR]
})
export class CaptorInputComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {
  private _subscriptions: Array<Subscription> = [];
  private _isUpdated = true;
  //todo
  private _value = '';

  @Input() control: FormControl = new FormControl();

  @Input() type: string | undefined;

  @Input()
  set placeholder(val: string) {
    this._placeholder = val;
  }
  get placeholder() {
    return this._placeholder;
  }
  private _placeholder = '';

  @Input()
  set readonly(val: boolean) {
    this._readonly = val;
  }
  get readonly() {
    return this._readonly;
  }
  private _readonly = false;

  @Input() disabled = false;

  @Input() maxLen = -1;

  @Input() minLen = -1;

  @Input() required = false;

  @Input() hint: string | undefined;

  @Input() customErrMsg: { errCode: string; errMsg: string }[] | undefined;

  // todo
  /* Implement interface ControlValueAccessor */
  propagateChange = (_: any) => { };

  writeValue(value: any) {
    if (value !== undefined) {
      this.value = value;
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) { }

  get value() {
    return this._value;
  }

  set value(val: string) {
    this._value = val;
  }

  /* Apply format validator according to input type */
  private _initValidators() {
    switch (this.type) {
      case 'email':
        this.control.addValidators(Validators.email);
        break;
      case 'tel':
        this.control.addValidators(Validators.pattern(/^\(\d{3}\)\s\d{3}\s-\s\d{4}$/));
        break;
      case 'ssn':
        this.control.addValidators(Validators.pattern(/^\d{3}\s-\s\d{2}\s-\s\d{4}$/));
        break;
      case 'zipcode':
        this.control.addValidators(Validators.pattern(/^\d{5}$/));
        break;
      case 'zipcodeExt':
        this.control.addValidators(Validators.pattern(/^\d{4}$/));
        break;
      default:
        return;
    }
  }

  private _initGeneralValidators() {
    if (this.disabled) {
      this.control.disable();
    }

    if (this.required) {
      this.control.addValidators([Validators.required]);
    }

    if (this.minLen !== -1) {
      this.control.addValidators(Validators.minLength(this.minLen));
    }

    if (this.maxLen !== -1) {
      this.control.addValidators(Validators.maxLength(this.maxLen));
    }
  }

  getErrorMessage() {
    if (!this.control.errors) return;

    const {
      required,
      pattern,
      email,
      minlength,
      maxlength
    } = this.control.errors;

    if (required) {
      return 'You must enter a value';
    } else if (email) {
      return 'Not a valid email';
    } else if (pattern) {
      switch (this.type) {
        case 'tel':
          return 'Not a valid phone number';
        case 'ssn':
          return 'Not a valid SSN';
        case 'zipcode':
          return 'Not a valid zipcode';
        case 'zipcodeExt':
          return 'Not a valid zipcode extension';
        default:
          return 'Not a valid format';
      }
    } else if (minlength) {
      return `Minimum length ${this.minLen}`;
    } else if (maxlength) {
      return `Maximum length ${this.maxLen}`;
    }

    // User custom error message
    if (this.customErrMsg) {
      const customErr = this.customErrMsg.find(({ errCode }) => this.control.errors?.[errCode]);

      if (customErr) {
        return customErr.errMsg;
      }
    }

    return 'Unknown error';
  }

  get showErr() {
    return !this._isUpdated && this.control.invalid;
  }

  ngOnInit(): void {
    this._initValidators();
    this._initGeneralValidators();
    this.control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  ngAfterViewInit() {
    if (this.parentForm) {
      this._subscriptions.push(
        this.parentForm.onSubmit.asObservable().subscribe(() => this._isUpdated = false)
      );
    }

    this._subscriptions.push(
      this.control.valueChanges.subscribe(() => this._isUpdated = true)
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  constructor(
    @Optional() private parentForm: CaptorFormDirective
  ) {
  }
}