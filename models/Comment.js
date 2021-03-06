import {Model} from "objection";

export default class Comment extends Model {
    static get tableName() {
        return "comments";
    }

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/User',
                join: {
                    from: 'comments.user_id',
                    to: 'users.id'
                }
            }
        };
    }
}
