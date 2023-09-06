export default class Repository {
    constructor(dao, model) {
        this.dao = dao,
        this.model = model
    }

    get = async(params) => {
        return await this.dao.get(params, this.model)
    }

    save = async(data) => {
        return this.dao.insert(data, this.model)
    }

    find = async(criteria) => {
        return await this.dao.get(criteria, this.model)
    }
    delete = async(criteria) => {
        return await this.dao.delete(criteria, this.model)
    }

    getLeanExec = async(criteria) => {
        return await this.dao.getLeanExec(criteria, this.model)
    }
    getPagination = async(criteria, search, options) => {
        return await this.dao.getPaginate(criteria, search, options, this.model)
    }
}