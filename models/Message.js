import {Model} from "objection"
import User from './User'
import Thread from './Thread'

export default class Message extends Model {

    static get tableName() {
        return "messages";
    }

    static get relationMappings() {
      return {
        thread: {
          relation: Model.BelongsToOneRelation,
          modelClass: Thread,
          join: {
            from: 'messages.thread_id',
            to: 'threads.id'
          }
        },
        user: {
          relation: Model.BelongsToOneRelation,
          modelClass: User,
          join: {
            from: 'messages.user_id',
            to: 'users.id'
          }
        }
      };
    }
}
