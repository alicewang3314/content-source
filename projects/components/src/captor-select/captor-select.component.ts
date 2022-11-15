import { Component, OnInit, Input, AfterViewInit, OnDestroy, ViewChild, ElementRef, Optional } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CaptorFormDirective } from '../captor-form/captor-form.directive';

@Component({
  selector: 'captor-select',
  templateUrl: './captor-select.component.html',
  styleUrls: ['./captor-select.component.scss']
})
export class CaptorSelectComponent implements OnInit, AfterViewInit, OnDestroy {
  private _subscriptions: Array<Subscription> = [];
  private _canShowErr = false;

  @ViewChild('filter', { static: false, read: ElementRef }) filter: any = null;

  @Input() multi = false;

  @Input() control: FormControl = new FormControl();

  @Input() disabled = false;

  @Input() default: any[] | any | undefined;

  @Input() required = false;

  @Input() placeholder = '';

  @Input() customErrMsg: { errCode: string; errMsg: string }[] | undefined;

  @Input()
  set entries(val: { name: string, value: any }[]) {
    this._entries = val;
    this.displayEntries = val;
  }
  private _entries: { name: string, value: any }[] = [];
  displayEntries: { name: string, value: any }[] = [];

  query = '';


  onSelectToggle(isOpen: boolean) {
    if (!isOpen) {
      this.displayEntries = this._entries;
      this.query = '';
    } else {
      // focus on the filter when dropdown opened
      this.filter.nativeElement.focus();
    }
  }

  filterValue(query: any) {
    this.query = query;
    this.displayEntries = this._entries.filter(({ name }) => name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  selectAll() {
    const allValues = this._entries.map(({ value }) => value);
    this.control.setValue(allValues);
  }

  unselectAll() {
    this.control.reset();
  }

  getErrorMessage() {
    const errors = this.control.errors;

    if (!errors) return;

    const { required } = errors;

    if (required) {
      return 'You must enter a value';
    }

    return 'Unknown error';
  }

  get showErr() {
    return this.control.invalid && this._canShowErr;
  }

  initValidators() {
    if (this.required) {
      this.control.addValidators([Validators.required]);
    }
  }

  initStatus() {
    if (this.disabled) {
      this.control.disable();
    }
  }

  ngOnInit(): void {
    this.initValidators();
    this.initStatus();
    this.control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  ngAfterViewInit(): void {
    if (this.parentForm) {
      this._subscriptions.push(
        this.parentForm.onSubmit.asObservable().subscribe(() => this._canShowErr = true)
      );
    }

    this._subscriptions.push(
      this.control.valueChanges.subscribe(() => this._canShowErr = false)
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  constructor(
    @Optional() private parentForm: CaptorFormDirective
  ) { }
}
