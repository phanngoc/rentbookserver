import {Model} from "objection";

export default class Book extends Model {
    static get tableName() {
        return "books";
    }

    static get relationMappings() {
      return {
        user: {
          relation: Model.BelongsToOneRelation,
          modelClass: __dirname + '/User',
          join: {
            from: 'books.user_id',
            to: 'users.id'
          }
        },
        tag: {
          relation: Model.ManyToManyRelation,
          modelClass: __dirname + '/Tag',
          join: {
            from: 'Book.id',
            through: {
              from: 'Book_Tag.bookId',
              to: 'Book_Tag.tagId'
            },
            to: 'Tag.id'
          }
        },
      };
    }
}
