import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CalculatorService, CalcParams, CalcResults } from './services/calculator.service';

declare const $: any;
declare const toastr: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    form: FormGroup = new FormGroup({
        exchangeRate: new FormControl('', [
            Validators.min(0),
            Validators.maxLength(10)
        ]),
        price: new FormControl('', [
            Validators.required,
            Validators.min(0),
            Validators.maxLength(10)
        ]),
        quantity: new FormControl('1', [
            Validators.required,
            Validators.min(1)
        ]),
        taxFree: new FormControl('false'),
        iva: new FormControl({
            value: '16',
            disabled: false
        }, [
            Validators.required,
            Validators.min(0),
            Validators.max(100)
        ]),
        profit: new FormControl('45', [
            Validators.required,
            Validators.min(0),
            Validators.max(1000)
        ])
    });

    displayResults: boolean = false;
    results: CalcResults[];
    readonly currency: string = 'Bs. F. ';

    constructor(private calculator: CalculatorService) {
        this.results = [];
    }

    ngOnInit() {
        this.configToaster();
    }

    private configToaster() {
        toastr.options = {
            closeButton: false,
            debug: false,
            newestOnTop: false,
            progressBar: false,
            positionClass: 'toast-bottom-center',
            preventDuplicates: false,
            onclick: null,
            showDuration: '300',
            hideDuration: '500',
            timeOut: '2000',
            extendedTimeOut: '1000',
            showEasing: 'swing',
            hideEasing: 'linear',
            showMethod: 'fadeIn',
            hideMethod: 'fadeOut'
        };
    }

    toggleTaxFree(val: boolean) {
        if( val ) {
            this.form.get('iva').disable();
        }
        else {
            this.form.get('iva').enable();
        }
    }

    copyText(target) {

        console.log('copyValue', target);

        //const target = $( this ).data( 'target' );
        const value = $( '#' + target ).val();

        $( '#' + target ).select();
        document.execCommand('copy');

        console.log('Copied to clipboard', value);

        // display message
        toastr['info']('Texto copiado al portapapeles.');
    }

    calculate() {

        console.log('calculate');
        const isTaxFree = this.form.get('taxFree').value === 'true';
        const taxes = isTaxFree ? 0 : parseFloat( this.form.get('iva').value );

        const params: CalcParams = {
            exchangeRate: parseFloat( this.form.get('exchangeRate').value ),
            price: parseFloat( this.form.get('price').value ),
            quantity: parseInt( this.form.get('quantity').value, 10 ),
            taxFree: isTaxFree,
            taxes,
            profit: parseFloat( this.form.get('profit').value )
        };

        this.displayResults = true;
        this.results = this.calculator.calculate(params);
        console.log('params', params);
        console.log('results', this.results);
    }

    reset() {
        console.log('reset');
        this.displayResults = false;
        this.form.patchValue({
            price: '',
            quantity: 1
        });
    }

}
