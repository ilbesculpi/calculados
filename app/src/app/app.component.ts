import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CalculatorService, CalcParams, CalcResults } from './services/calculator.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    form: FormGroup = new FormGroup({
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
    results: CalcResults;
    readonly currency: string = 'Bs. F.';

    constructor(private calculator: CalculatorService) {
        this.results = {
            unitPrice: 0,
            unitTaxes: 0,
            factor: 0,
            salesPrice: 0,
            productProfit: 0,
        }
    }

    ngOnInit() {
    }

    toggleTaxFree(val: boolean) {
        if( val ) {
            this.form.get('iva').disable();
        }
        else {
            this.form.get('iva').enable();
        }
    }

    calculate() {

        console.log('calculate');
        const isTaxFree = this.form.get('taxFree').value === 'true';
        const taxes = isTaxFree ? 0 : parseFloat( this.form.get('iva').value );

        const request = {
            price: parseFloat( this.form.get('price').value ),
            quantity: parseInt( this.form.get('quantity').value, 10 ),
            taxFree: isTaxFree,
            taxes,
            profit: parseFloat( this.form.get('profit').value )
        } as CalcParams;

        this.displayResults = true;
        this.results = this.calculator.calculate(request);
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
