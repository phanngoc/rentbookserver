import {Model} from "objection";

export default class Tag extends Model {
    static get tableName() {
      return "books";
    }

    static get relationMappings() {
      return {
        book: {
          relation: Model.ManyToManyRelation,
          modelClass: __dirname + '/Book',
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
