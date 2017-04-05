import {Model} from "objection"
import User from './User'

export default class DeviceToken extends Model {

    static get tableName() {
        return "device_tokens";
    }

    static get relationMappings() {
      return {
        user: {
          relation: Model.BelongsToOneRelation,
          modelClass: User,
          join: {
            from: 'device_tokens.user_id',
            to: 'users.id'
          }
        }
      };
    }
}
