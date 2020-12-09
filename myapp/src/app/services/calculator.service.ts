import { Injectable } from '@angular/core';

export interface CalcParams {
    exchangeRate: number;
    price: number;
    quantity: number;
    taxFree: boolean;
    taxes: number;
    profit: number;
}

export interface CalcResults {
    unitPrice: number;
    unitTaxes: number;
    factor: number;
    salesPrice: number;
    productProfit: number;
}

@Injectable({
    providedIn: 'root'
})
export class CalculatorService {

    constructor() {
    }

    calculate(params: CalcParams) : CalcResults[] {

        const { price, quantity, taxFree, taxes, profit, exchangeRate } = params;

        const unitPrice = price / quantity;
        const unitTaxes = unitPrice * taxes / 100.0;
        const factor = (100.0 - profit) / 100.0;
        const salesPrice = (unitPrice + unitTaxes) / factor;
        const productProfit = salesPrice - (unitPrice + unitTaxes);

        const baseResult = {
            unitPrice,
            unitTaxes,
            factor,
            salesPrice,
            productProfit
        };

        const results = [baseResult];

        if( exchangeRate > 0 ) {
            results.push({
                unitPrice: unitPrice / exchangeRate,
                unitTaxes: unitTaxes / exchangeRate,
                factor,
                salesPrice: salesPrice / exchangeRate,
                productProfit: productProfit / exchangeRate
            });
        }

        return results;

    }

}
