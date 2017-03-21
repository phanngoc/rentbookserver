import {Model} from "objection"
import User from './User'
import Tag from './Tag'
import Comment from './Comment'
import Image from './Image'

export default class Book extends Model {
    static get tableName() {
        return "books";
    }

    static get relationMappings() {
      return {
        user: {
          relation: Model.BelongsToOneRelation,
          modelClass: User,
          join: {
            from: 'books.user_id',
            to: 'users.id'
          }
        },
        comments: {
          relation: Model.HasManyRelation,
          modelClass: Comment,
          join: {
            from: 'books.id',
            to: 'comments.book_id'
          }
        },
        images: {
          relation: Model.HasManyRelation,
          modelClass: Image,
          join: {
            from: 'books.id',
            to: 'images.book_id'
          }
        },
        tags: {
          relation: Model.ManyToManyRelation,
          modelClass: Tag,
          join: {
            from: 'books.id',
            through: {
              from: 'book_tags.book_id',
              to: 'book_tags.tag_id'
            },
            to: 'tags.id'
          }
        },
      };
    }
}
