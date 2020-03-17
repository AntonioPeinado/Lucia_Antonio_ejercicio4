const PAYMENTS_MOCK = [{
        "id": "91ce34cf-f3de-4294-a2a7-b49885b12efb",
        "ammount": "1704.45",
        "company": "TERASCAPE",
        "date": "Monday, April 24, 2017 11:00 PM"
    },
    {
        "id": "853a6daa-4d79-416f-a794-64161b18e433",
        "ammount": "2283.43",
        "company": "KLUGGER",
        "date": "Friday, September 2, 2016 7:37 AM"
    },
    {
        "id": "1a04cfe4-6fb3-41b6-9d5c-bebe4b2c159e",
        "ammount": "3991.88",
        "company": "CONFERIA",
        "date": "Thursday, June 9, 2016 3:47 PM"
    },
    {
        "id": "2abf4cd7-361a-4a2f-bacd-f9ddbd36e8df",
        "ammount": "3165.27",
        "company": "SINGAVERA",
        "date": "Wednesday, December 6, 2017 10:37 PM"
    },
    {
        "id": "298beeae-1881-4dfc-88a7-97f767e01d10",
        "ammount": "2731.79",
        "company": "GEEKOLA",
        "date": "Monday, June 2, 2014 11:33 PM"
    },
    {
        "id": "f24919e7-b1ee-4896-afa8-3ba484b463b8",
        "ammount": "1015.75",
        "company": "ACCUPHARM",
        "date": "Thursday, January 22, 2015 2:20 AM"
    },
    {
        "id": "e0460877-86f6-499e-9a04-29d11edb37c7",
        "ammount": "3805.97",
        "company": "FROLIX",
        "date": "Wednesday, July 24, 2019 6:35 PM"
    },
    {
        "id": "3cfad057-c9c2-447e-8b62-dcdc18e1ef2b",
        "ammount": "2183.6",
        "company": "BLEEKO",
        "date": "Saturday, September 10, 2016 6:01 AM"
    }
];
/**
 * En una aplicación bancaria tenemos la necesidad de gestionar
 * los pagos pendientes de las compras online de los usuarios.
 * 
 * Para ello tenemos un servicio REST que permite recuperar todos los pagos
 * pendientes en formato JSON, aceptarlos y denegarlos. 
 */
class PaymentService { //creamos el servidor
    getAll() {
        return PAYMENTS_MOCK;
    }
    accept(paymentId) {
        if (Math.random() <= 0.2) {
            throw new Error(`Error accepting payment ${paymentId}`);
        }
        return `payment ${paymentId} accepted`;
    }
    decline(paymentId) {
        if (Math.random() <= 0.2) {
            throw new Error(`Error declining payment ${paymentId}`);
        }
        return `payment ${paymentId} declined`;
    }
}

/**
 * Implemente la clase Payment que permite
 * representar pagos pendientes.
 * 
 * Los pagos pendientes tienen id, cantidad, compañia, fecha
 * y un estado que puede ser PENDING, ACCEPTED, DECLINED, ERROR
 */

// enum
var PAYMENT_STATES = {
    PENDING: 0,
    ACCEPTED: 1,
    DECLINED: 2,
    ERROR: 3
};

class Payment {
    constructor(id, ammount, company, date) {
        this.id = id;
        this.ammount = Number.parseFloat(ammount);
        this.company = company;
        this.date = new Date(date);
        this.state = PAYMENT_STATES.PENDING;
    }
    get state() {
        return this._state;
    }
    set state(value) {
        var validStates = Object.values(PAYMENT_STATES);
        var isValidState = validStates.includes(value);
        if (!isValidState) {
            throw new Error('Invalid state!');
        }
        this._state = value;
    }
}

function createPayment(payment) {
    return new Payment(payment.id, payment.ammount, payment.company, payment.date);
}

/**
 * Implemente la clase PaymentManager que nos
 * permite gestionar los distintos pagos pendientes.
 */
class PaymentManager {
    constructor(paymentService) {
        this._paymentService = paymentService;
        this._payments = [];
    }
    get payments() {
            return this._payments;
        }
        /**
         * Devuelve el pago con ese indice
         * o undefined si no hay más pagos
         */
    get(index) {
            return this._payments[index];
        }
        /**
         * Recuperar y almacenar los pagos
         */
    fetchPayments() {
            this._payments = this._paymentService.getAll().map(createPayment);
        }
        /**
         * Aceptar un pago
         */
    acceptPayment(payment) {
            try {
                var result = this._paymentService.accept(payment.id);
                payment.state = PAYMENT_STATES.ACCEPTED;
                return result;
            } catch (err) {
                payment.state = PAYMENT_STATES.ERROR;
                throw err;
            }
        }
        /**
         * Declinar un pago
         */
    declinePayment(payment) {
        // try cacth finally javascript
        try {
            var result = this._paymentService.decline(payment.id);
            payment.state = PAYMENT_STATES.DECLINED;
            return result;
        } catch (err) {
            payment.state = PAYMENT_STATES.ERROR;
            throw err;
        }
    }
}

class App {
    constructor(paymentManager) {
            // guardar paymentManager
            this._currentPaymentIndex = 0;
        }
        /**
         * Devuelve el pago actual en funcion del indice
         */
    get _currentPayment() {
            return this._paymentManager.get(this._currentPaymentIndex);
        }
        /**
         * Recuperar los pagos y pintar el primero
         */
    start() {
            return this._paymentManager.fetchPayments();

            // hacer que el paymentManager pida todos los pagos
            this.printPayment();
            // llamar a printPayment
        }
        /**
         * Pintar por consola el siguiente pago
         */
    printPayment() {
            if (!this._currentPayment) {
                this.printSummary();

            } else {
                console.log(paymetString(this._currentPayment.ammount, this._currentPayment.date, this._currentPayment.company));


            }

            // escribir por consola la informacion del pago actual
            // y si no hay mas pagos llamar a printSummary
        }
        /**
         * Pinta todos los pagos incluyendo el estado
         * en el que finalizaron
         */
    printSummary() {
            for (var i = 0; i < paymentManager.length; i++) {
                console.log(paymentManager[i]);
            }
            // escribir por consola la informacion de todos los pagos
            // que estan en el paymentManager
        }
        /**
         * Acepta el pago actual y pasa
         * al siguiente pago.
         */
    accept() {
            try {
                this._paymentManager.accept(this._currentPayment);

            } catch (err) {
                console.log(err);

            } finally {
                this._currentPaymentIndex++;
                this.printPayment();

            }
        }
        // llamar a paymentManager.accept pasandole el pago 
        // actual y si hay algun error pintarlo por consola
        // al terminar, tengas o no error tienes que
        // actualizar this._currentPaymentIndex sumando 1
        // y pintar el pago nuevo

    /**
     * Declina el pago actual y pasa
     * al siguiente pago.
     */
    decline() {
        try {
            this._paymentManager.decline(this._currentPayment);

        } catch (err) {
            console.log(err);
        } finally {
            this._currentPaymentIndex++;
            this.printPayment();
        }


        // llamar a paymentManager.decline pasandole el pago 
        // actual y si hay algun error pintarlo por consola
        // al terminar, tengas o no error tienes que
        // actualizar this._currentPaymentIndex sumando 1
        // y pintar el pago nuevo
    }
}

var app = new App(new PaymentManager(new PaymentService))
    /* PRUEBAS */
var app = new App(new PaymentManager(new PaymentService))
    /* PRUEBAS */