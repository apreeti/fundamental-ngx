import { Component, ElementRef, Inject, Input } from '@angular/core';
import { AbstractFdNgxClass } from '../utils/abstract-fd-ngx-class';

@Component({
    selector: 'fd-label',
    templateUrl: './badge-label.component.html'
})
export class LabelComponent extends AbstractFdNgxClass {
    /** @Input Color coded status for the label. Options are 'success', 'warning', and 'error'. Leave empty for default label. */
    @Input() status: string = '';
    /** @Input When set to 'true', the type of the label is 'Status Indicator Label'. Leave empty for default type. */
    @Input() isStatusLabel: boolean = false;
    /** @Input Built-in status icon. Options include 'available', 'away', 'busy', and 'offline'. */
    @Input() statusIcon: string = '';
    /** @Input The icon used with the status indicator. See the icon page for the list of icons. */
    @Input() icon: string = '';

    /** @hidden */
    _setProperties() {
        if (this.isStatusLabel) {
            this._addClassToElement('fd-status-label');
            if (this.status) {
                this._addClassToElement('fd-status-label--' + this.status);
            }
            if (this.statusIcon) {
                this._addClassToElement('fd-status-label--' + this.statusIcon);
            }
            if (this.icon) {
                this._addClassToElement('sap-icon--' + this.icon);
            }
        } else {
            this._addClassToElement('fd-label');
            if (this.status) {
                this._addClassToElement('fd-label--' + this.status);
            }
        }
    }

    /** @hidden */
    constructor(@Inject(ElementRef) elementRef: ElementRef) {
        super(elementRef);
    }
}
