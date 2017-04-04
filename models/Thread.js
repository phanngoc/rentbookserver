import {Model} from "objection"
import User from './User'

export default class Thread extends Model {

    static get tableName() {
        return "threads";
    }

    static get relationMappings() {
      return {
        person_one: {
          relation: Model.BelongsToOneRelation,
          modelClass: User,
          join: {
            from: 'threads.member_one',
            to: 'users.id'
          }
        },
        person_two: {
          relation: Model.BelongsToOneRelation,
          modelClass: User,
          join: {
            from: 'threads.member_two',
            to: 'users.id'
          }
        }
      };
    }
}
