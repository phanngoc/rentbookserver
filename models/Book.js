import {Model} from "objection"
import User from './User'
import Tag from './Tag'
import Comment from './Comment'
import Image from './Image'
import Action from './Action'

export default class Book extends Model {

    static get tableName() {
        return "books";
    }

    static get relationMappings() {
      return {
        actions: {
          relation: Model.HasManyRelation,
          modelClass: Action,
          join: {
            from: 'books.id',
            to: 'actions.book_id'
          }
        },
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

Book.BORROW = 0;
Book.ACCEPT = 1;
Book.READY = 2;
