import async from 'async'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import passport from 'passport'
import Comment from '../models/Comment'
import BaseController from './BaseController'
import bcrypt from 'bcrypt-nodejs';
import _ from 'underscore';
import moment from 'moment'

export default class CommentController extends BaseController {
  constructor(req, res) {
    super(req, res);
  }

  async create() {
    this.request.checkBody('content', 'Content is required').notEmpty();
    var errors = this.request.validationErrors(true);
    if (errors) {
      this.responseErrors(errors);
    } else {
      let comment = await Comment.query()
        .insert({
          content: this.request.body.content,
          user_id: this.request.decoded.id,
          book_id: this.request.params.book_id,
        })
        .then(function(result) {
          return result;
        });
      this.responseSuccess(comment);
    }
  }

  async update() {
    var self = this;
    let comment = await Comment.query()
      .updateAndFetchById(this.request.params.id,
        {
          content: this.request.body.content,
          updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
        }
      )
      .then(function(result) {
        return result;
      }).catch(function(errors) {
        self.responseErrors(errors);
      });
    this.responseSuccess(comment);
  }

  async destroy() {
    var self = this;
    let comment = await Comment.query()
      .deleteById(this.request.params.id)
      .then(function(result) {
        return result;
      }).catch(function(errors) {
        self.responseErrors(errors);
      });

      this.responseSuccess(comment);
  }
}
