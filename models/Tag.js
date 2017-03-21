import {Model} from "objection";
import Book from './Book'

export default class Tag extends Model {
    static get tableName() {
      return "tags";
    }

    static get relationMappings() {
      return {
        book: {
          relation: Model.ManyToManyRelation,
          modelClass: Book,
          join: {
            from: 'Tag.id',
            through: {
              from: 'Book_Tag.tagId',
              to: 'Book_Tag.bookId'
            },
            to: 'Book.id'
          }
        },
      };
    }
}
