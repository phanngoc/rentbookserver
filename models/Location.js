import {Model} from "objection";
import User from "./User"

export default class Location extends Model {
  static get tableName() {
    return "locations";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
            from: 'locations.user_id',
            to: 'users.id'
        }
      }
    };
  }
}
