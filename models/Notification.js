import {Model} from "objection"
import User from './User'
import Thread from './Thread'

export default class Notification extends Model {

    static get tableName() {
        return "notifications";
    }

    static get relationMappings() {
      return {
        notification_details: {
          relation: Model.HasManyRelation,
          modelClass: Thread,
          join: {
            from: 'notifications.id',
            to: 'notification_details.notification_id'
          }
        },
      };
    }
}
