const currency = 'Bs. F.';

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-bottom-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "500",
    "timeOut": "2000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

$( document ).ready(function() {

    $( '#price, #quantity' ).on('input', function() {
        if( isValidForm() ) {
            $( '#btn-calculate' ).removeAttr( 'disabled' );
        }
        else {
            $( '#btn-calculate' ).attr( 'disabled', true );
        }
    });

    $( '#price, #quantity' ).on('change', function() {
        if( isValidForm() ) {
            $( '#btn-calculate' ).removeAttr( 'disabled' );
        }
        else {
            $( '#btn-calculate' ).attr( 'disabled', true );
        }
    });

    $( '.check-tax' ).change(function() {
        if( $( '#check-tax-yes' ).prop('checked') ) {
            $( '#iva' ).attr('disabled', true);
        }
        else {
            $( '#iva' ).removeAttr( 'disabled' );
        }
    });

    $( '#btn-calculate' ).click(function(e) {

        e.preventDefault();

        const price = parseFloat( $( '#price' ).val() );
        const quantity = parseInt( $( '#quantity' ).val() );
        const isTaxFree = $('#check-tax-yes').prop('checked');
        const iva = isTaxFree ? 0 : parseFloat( $('#iva').val() );
        const wval = parseFloat( $('#wval').val() );

        if( !validateForm() ) {
            return;
        }

        const results = calculate(price, quantity, iva, wval);
        console.log('results', results);
        displayResults( results );
    });

    $( '#btn-reset' ).click(function(e) {
        
        e.preventDefault();

        // hide results
        if( !$('#results').hasClass( 'hidden' ) ) {
            $( '#results' ).addClass( 'hidden' );
        }

        // clear price and quantity
        $( '#price' ).val('');
        $( '#quantity' ).val('');

        // disable calculate button
        $( '#btn-calculate' ).attr( 'disabled', true );

    });

    $( '.btn-copy' ).click(function(e) {
        
        e.preventDefault();

        const target = $( this ).data( 'target' );
        const value = $( '#' + target ).val();

        $( '#' + target ).select();
        document.execCommand('copy');

        console.log('Copied to clipboard', value);

        // display message
        toastr["info"]("Texto copiado al portapapeles.");
    });

});

const calculate = (price, quantity, iva, wval) => {
    const unitPrice = price / quantity;
    const taxes = unitPrice * iva / 100.0;
    const unitTaxes = taxes / quantity;
    const pricePlusEarnings = (unitPrice + unitTaxes) / ((100 - wval) / 100.0);
    const earnings = pricePlusEarnings - unitPrice - unitTaxes;
    const salesPrice = unitPrice + unitTaxes + earnings;
    return {
        unitPrice,
        taxes,
        earnings,
        salesPrice
    };
};

const formatAmount = (value) => {
    
    let str = value.toLocaleString('es', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return currency + ' ' + str;
}

const displayResults = (results) => {

    $( '#results' ).removeClass( 'hidden' );

    $( '#unitPriceLabel' ).text( formatAmount( results.unitPrice ) );
    $( '#unitPriceValue' ).val( results.unitPrice.toFixed(2) );

    $( '#taxesLabel' ).text( formatAmount( results.taxes ) );
    $( '#taxesValue' ).val( results.taxes.toFixed(2) );

    $( '#earningsLabel' ).text( formatAmount( results.earnings ) );
    $( '#earningsValue' ).val( results.earnings.toFixed(2) );

    $( '#salesPriceLabel' ).text( formatAmount( results.salesPrice ) );
    $( '#salesPriceValue' ).val( results.salesPrice.toFixed(2) );

};

const isTaxFreeChecked = () => {
    const isTaxFree = $('#check-tax-yes').prop('checked');
    return isTaxFree;
};

const isValidForm = () => {
    const price = $( '#price' ).val();
    const quantity = $( '#quantity' ).val();
    const wval = $('#wval').val();
    return price != '' && price > 0 && quantity != '' && price > 0 && wval != '' && wval > 0;
};

const validateForm = () => {

    const price = parseFloat( $( '#price' ).val() );
    const quantity = parseInt( $( '#quantity' ).val() );
    const wval = parseFloat( $('#wval').val() );

    if( isNaN(price) || price <= 0 ) {
        toastr["error"]("Campo 'precio' inválido", "Error");
        return false;
    }

    if( isNaN(quantity) || quantity <= 0 ) {
        toastr["error"]("Campo 'cantidad' inválido", "Error");
        return false;
    }

    if( isNaN(wval) || wval <= 0 ) {
        toastr["error"]("Campo 'ganancia' inválido", "Error");
        return false;
    }

    if( !isTaxFreeChecked() ) {
        const iva = parseFloat( $('#iva').val() );
        if( isNaN(iva) || iva <= 0 || iva >= 100 ) {
            toastr["error"]("Campo 'IVA' inválido", "Error");
            return false;
        }
    }

    return true;
};