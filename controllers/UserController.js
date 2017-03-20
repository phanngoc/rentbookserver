import async from 'async'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import passport from 'passport'
import User from '../models/User'
import BaseController from './BaseController'

export default class UserController extends BaseController {
  constructor(req, res) {
    super(req, res);
  }
  getLogin() {
    if (this.req.user) {
      return this.res.redirect('/');
    }
    this.res.render('account/login', {
      title: 'Login'
    });
  };

  allUsers() {
    var self = this;
    User
    .query()
    .then(function (user) {
      console.log("co vao day");
      self.res.json(user);
    })
    .catch(function (err) {
      console.log('oh noes');
    });
  }
}
