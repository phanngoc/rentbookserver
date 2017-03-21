import {Model} from "objection";
import Location from "./Location"
import Book from "./Book"
import Comment from "./Comment"

export default class User extends Model {
  static get tableName() {
    return "users";
  }

  static get relationMappings(){
      return {
        books: {
          relation: Model.HasManyRelation ,
          modelClass: Book,
          join:{
              from: 'users.id',
              to: 'books.user_id'
          }
        },
        locations: {
          relation: Model.HasManyRelation ,
          modelClass: Location,
          join:{
              from: 'users.id',
              to: 'locations.user_id'
          }
        },
        comments: {
          relation: Model.HasManyRelation,
          modelClass: Comment,
          join:{
              from: 'users.id',
              to: 'comments.user_id'
          }
        }
      };
  }
}
