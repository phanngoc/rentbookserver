import {Model} from "objection"
import User from './User'
import Message from './Message'
import Notification from './Notification'

export default class Notification extends Model {

    static get tableName() {
        return "notification_details";
    }

    static get relationMappings() {
      return {
        message: {
          relation: Model.BelongsToOneRelation,
          modelClass: Message,
          join: {
            from: 'notification_details.message_id',
            to: 'messages.id'
          }
        },
        user: {
          relation: Model.BelongsToOneRelation,
          modelClass: User,
          join: {
            from: 'notification_details.user_id',
            to: 'users.id'
          }
        },
        notification: {
          relation: Model.BelongsToOneRelation,
          modelClass: Notification,
          join: {
            from: 'notification_details.notification_id',
            to: 'notifications.id'
          }
        }
      };
    }
}
