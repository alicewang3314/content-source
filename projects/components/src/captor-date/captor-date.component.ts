import { Component, OnInit, Input, Optional, OnDestroy, AfterViewInit } from '@angular/core';
import { FormControl, Validators, FormGroup, ValidationErrors, ValidatorFn, AbstractControl, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CaptorFormDirective } from '../captor-form/captor-form.directive';

// // Validate when user not provide a valid date range
// function dateRangeFormatValidator(): ValidatorFn {
//   return (ctr: AbstractControl): ValidationErrors | null => {
//     console.log('dateRangeFormatValidator', ctr);
//     const { start, end } = ctr.value;
//     console.log('dateRangeFormatValidator', ctr);
//     return (start || end) && (start && end) ? null : { missingStartOrEndDate: { value: true } };
//   }
// }

@Component({
  selector: 'captor-date',
  templateUrl: './captor-date.component.html',
  styleUrls: ['./captor-date.component.scss']
})
export class CaptorDateComponent implements OnInit, OnDestroy, AfterViewInit {
  private _subscriptions: Array<Subscription> = [];
  private _isUpdated = true;

  @Input() control: FormControl = new FormControl();

  @Input() type: string = 'date';

  @Input() placeholder = '';

  @Input() readonly = false;

  @Input() disabled = false;

  @Input() required = false;

  @Input() minDate: Date | null = null;

  @Input() maxDate: Date | null = null;

  @Input() hint: string | undefined;

  @Input() customErrMsg: { errCode: string; errMsg: string }[] | undefined;

  dateRange: FormGroup = new FormGroup({});;

  private _initValidators() {
    if (this.type === 'dateRange') {
      if (this.disabled || this.readonly) this.control.disable();

      if (this.required) {
        this.control.addValidators([Validators.required]);
        this.dateRange?.controls['start'].addValidators([Validators.required]);
        this.dateRange?.controls['end'].addValidators([Validators.required]);
      }

      // Validate when user not provide a valid date range
      // function dateRangeFormatValidator(): ValidatorFn {
      //   return (ctr: AbstractControl): ValidationErrors | null => {
      //     const { start, end } = ctr.value;
      //     return (start || end) && (start && end) ? null : { missingStartOrEndDate: { value: 'missingStartOrEndDate' } };
      //   }
      // }
      // console.log('add dateRange format validator');
      // this.control.addValidators([dateRangeFormatValidator]);
      // // console.log(this.control.);

    }
    else {
      if (this.disabled || this.readonly) this.control.disable();
      if (this.required) this.control.addValidators([Validators.required]);
    }
  }

  get showDateErr() {
    return !this._isUpdated && this.control.invalid;
  }

  getDateErrMsg() {
    if (!this.control.errors) return;

    const { required } = this.control.errors;

    if (required) {
      return 'You must enter a value'
    }

    const customErrMsg = this._getCustomErrMsg();

    return customErrMsg ||  'Unknown error';
  }

  get showDateRangeErr() {
    return !this._isUpdated && this.dateRange.invalid;
  }


  getDateRangeErrMsg() {
    // When input has format issues
    if (this.dateRange.invalid) {
      const { start, end } = this.dateRange.controls;

      if (!start.value) {
        return 'Missing start date.';
      } else if (!end.value) {
        return 'Missing end date.';
      } else if (end.hasError('matEndDateInvalid')) {
        return 'Invalid date range.';
      }
    }

    if (this.control.hasError('required')) {
      return 'You must provide a date range.';
    }

    const customErrMsg = this._getCustomErrMsg();

    return customErrMsg || 'Unknown error.';
  }

  private _getCustomErrMsg(): string | undefined {
    const { errors } = this.control;

    if (!this.customErrMsg || !errors) return;

    const firstErr = this.customErrMsg.filter(({ errCode }) => errors[errCode])[0];

    return firstErr ? firstErr.errMsg : undefined;
  }

  ngOnInit(): void {
    if (this.type === 'dateRange') {
      this.dateRange = this.formBuilder.group({
        start: null,
        end: null
      });
      this._subscriptions.push(
        this.dateRange.valueChanges.subscribe(val => {
          this.control.setValue(val);
        }));
    }

    this._initValidators();
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

  // todo: dev log, remove
  get dateRangeErr() {
    if (!this.dateRange) return '';

    return `${JSON.stringify(this.dateRange.controls['start'].errors)} | ${JSON.stringify(this.dateRange.controls['end'].errors)}`;
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  constructor(
    @Optional() private parentForm: CaptorFormDirective,
    private formBuilder: FormBuilder
  ) {
  }
}
