import {Model} from "objection";

export default class User extends Model {
  static get tableName() {
    return "users";
  }

  static get relationMappings() {
    return {
      book: {
        relation: Model.OneToManyRelation ,
        modelClass: __dirname + '/Book',
        join:{
            from: 'users.id',
            to: 'book.user_id'
        }
      },
      localtion: {
        relation: Model.OneToManyRelation ,
        modelClass: __dirname + '/Location',
        join:{
            from: 'users.id',
            to: 'locations.user_id'
        }
      },
      comment: {
        relation: Model.ManyToManyRelation,
        modelClass: __dirname + '/Comment',
        join:{
            from: 'users.id',
            to: 'comments.user_id'
        }
      }
    };
  }
}
