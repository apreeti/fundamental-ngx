import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef, HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges, ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PopoverComponent } from '../popover/popover.component';

@Component({
    selector: 'fd-multi-input',
    templateUrl: './multi-input.component.html',
    styleUrls: ['./multi-input.component.scss'],
    host: {
        '(blur)': 'onTouched()'
    },
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultiInputComponent),
            multi: true
        }
    ]
})
export class MultiInputComponent implements OnInit, ControlValueAccessor, OnChanges {

    @ViewChild(PopoverComponent)
    popoverRef: PopoverComponent;

    @HostBinding('class.fd-multi-input')
    multiInputClass = true;

    @Input()
    placeholder: string = '';

    @Input()
    disabled: boolean = false;

    @Input()
    compact: boolean = false;

    @Input()
    maxHeight: string = '200px';

    @Input()
    glyph: string = 'navigation-down-arrow';

    @Input()
    dropdownValues: any[] = [];

    @Input()
    searchTerm: string;

    @Input()
    selected: any[] = [];

    @Input()
    filterFn: Function = this.defaultFilter;

    @Input()
    displayFn: Function = this.defaultDisplay;

    @Output()
    searchTermChange: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    selectedChange: EventEmitter<any[]> = new EventEmitter<any[]>();

    displayedValues: any[] = [];

    isOpen = false;

    onChange: Function = () => {};

    onTouched: Function = () => {};

    constructor(private elRef: ElementRef) {}

    ngOnInit() {
        if (this.dropdownValues) {
            this.displayedValues = this.dropdownValues;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.dropdownValues && (changes.dropdownValues || changes.searchTerm)) {
            if (this.searchTerm) {
                this.displayedValues = this.filterFn(this.dropdownValues, this.searchTerm);
            } else {
                this.displayedValues =  this.dropdownValues;
            }
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(selected: any[]): void {
        this.selected = selected;
    }

    handleSelect(checked: any, value: any): void {
        const previousLength = this.selected.length;
        if (checked) {
            this.selected.push(value);
        } else {
            this.selected.splice(this.selected.indexOf(value), 1);
        }

        // Handle popover placement update
        if ((previousLength === 0 && this.selected.length === 1) ||
            (previousLength === 1 && this.selected.length === 0)) {
            this.popoverRef.updatePopover();
        }

        this.onChange(this.selected);
        this.selectedChange.emit(this.selected);
    }

    handleSearchTermChange(): void {
        this.searchTermChange.emit(this.searchTerm);
        this.displayedValues = this.filterFn(this.dropdownValues, this.searchTerm);
    }

    private defaultFilter(contentArray: any[], searchTerm: string): any[] {
        const searchLower = searchTerm.toLocaleLowerCase();
        return contentArray.filter(item => {
            if (item) {
                return this.displayFn(item).toLocaleLowerCase().includes(searchLower);
            }
        });
    }

    private defaultDisplay(str: string): string {
        return str;
    }

    @HostListener('document:click', ['$event'])
    clickHandler(event) {
        event.stopPropagation();
        if (!this.elRef.nativeElement.contains(event.target)) {
            this.isOpen = false;
        }
    }

}
