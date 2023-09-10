import TicketModel from "../dao/models/ticket.model.js";
import Repository from "./Repository.js";


export default class TicketService extends Repository{
    constructor(dao){
        super(dao, TicketModel.model)
    }
}