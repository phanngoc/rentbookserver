import {Model} from "objection";
import Book from './Book'

export default class Action extends Model {
    static get tableName() {
      return "actions";
    }

    static get relationMappings() {
      return {
        book: {
          relation: Model.BelongsToOneRelation,
          modelClass: Book,
          join: {
            from: 'actions.book_id',
            to: 'books.id'
          }
        },
      };
    }
}
