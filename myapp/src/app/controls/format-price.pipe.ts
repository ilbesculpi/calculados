import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatPrice'
})
export class FormatPricePipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {

        const currency = args[0] || '$';

        const str = value.toLocaleString('es', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        return currency + '' + str;
    }

}
