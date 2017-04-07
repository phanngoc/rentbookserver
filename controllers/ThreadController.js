import async from 'async'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import passport from 'passport'
import Comment from '../models/Comment'
import Thread from '../models/Thread'
import BaseController from './BaseController'

export default class ThreadController extends BaseController {
  constructor(req, res) {
    super(req, res);
  }

  async index() {
    let self = this;
    let book_id = this.request.query.book_id;
    this.request.checkQuery('book_id', 'Book id is required.').notEmpty();

    console.log('current user id', self.request.decoded.id);

    var errors = this.request.validationErrors(true);
    if (errors) {
      this.responseErrors(errors);
    } else {
      let threads = await Thread.query()
        .eager('[person_one, person_two, messages]')
        .modifyEager('messages', builder => {
          builder.limit(4);
        })
        .where(builder => {
          builder.where('threads.member_one', self.request.decoded.id)
          .where('threads.book_id', book_id)
        })
        .orWhere(builder => {
          builder.where('threads.member_two', self.request.decoded.id)
          .where('threads.book_id', book_id)
        })
        .then(function(results) {
          return results;
        });
      this.responseSuccess(threads);
    }
  }
}
