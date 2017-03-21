import {Model} from "objection"

export default class Book_Tag extends Model {
    static get tableName() {
        return "book_tags";
    }
}
