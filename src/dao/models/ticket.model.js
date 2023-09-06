export default class TicketModel {
    static get model() {
        return 'tickets'
    }

    static get schema() {
        return {
            code: String,
            // purchase_datetime: 'created_at',
            purchase_datetime: String,
            amount: Number,
            puchaser: String 
        }
    }
}