import {Model} from "objection"
import User from './User'
import Message from './Message'

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
        },
        messages: {
          relation: Model.HasManyRelation,
          modelClass: Message,
          join: {
            from: 'threads.id',
            to: 'messages.thread_id'
          }
        }
      };
    }
}
