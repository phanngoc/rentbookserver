import {Model} from "objection";

export default class Image extends Model {
  static get tableName() {
    return "images";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/Book',
        join: {
            from: 'images.book_id',
            to: 'books.id'
        }
      }
    };
  }
}
