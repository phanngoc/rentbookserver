import async from 'async'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import passport from 'passport'
import User from '../models/User'
import BaseController from './BaseController'
import bcrypt from 'bcrypt-nodejs';
import _ from 'underscore';
import DeviceToken from '../models/DeviceToken'

export default class UserController extends BaseController {
  constructor(req, res) {
    super(req, res);
  }

  async allUsers() {
    let users = await User
      .query()
      .then(function (user) {
        return user;
      })
      .catch(function (err) {
        console.log('oh noes');
      });

    this.response.json({
      success: true,
      messageCode: 200,
      messageInfo: null,
      body: users
    })
  }

  async updateToken() {
    let token = await DeviceToken
      .query()
      .insert({'token' : this.request.body.device_token, 'user_id' : this.request.decoded.id})
      .then(function (result) {
        return result;
      });

    this.responseSuccess(token);
  }

  async create() {
    this.request.checkBody('name', 'Name is required').notEmpty();
    this.request.checkBody('email', 'Email is required').notEmpty();
    this.request.checkBody('username', 'Username is required').notEmpty();
    this.request.checkBody('phone', 'Phone is required').notEmpty();

    var errors = this.request.validationErrors(true);

    if (errors) {
      this.responseErrors(errors);
    } else {
      let user = await User.query()
        .insert(_.extend(
          _.pick(this.request.body,
            'name', 'email', 'username', 'phone', 'address'),
            {
              'password': bcrypt.hashSync(this.request.body.password),
              'avatar': this.request.file.filename
            }
          )
        )
        .then(function(result) {
          return result;
        });

      if (_.has(this.request.body, "lat", "lng")) {
        let locationId = await Location.query()
          .insert(_.extend(_.pick(this.request.body, "lat", "lng"),
            {user_id: user.id})
          )
          .then(function(result) {
            return result.id;
          });
      }
      this.responseSuccess(user);
    }
  }

  async show() {
    let user = await User.query()
      .findById(this.request.params.id)
      .eager('[actions, actions.book, locations]')
      .then(function(result) {
        return result;
      });
    this.responseSuccess(user);
  }

  async myProfile() {
    let user = await User.query()
      .findById(this.request.decoded.id)
      .eager('[books, actions, actions.book, locations]')
      .then(function(result) {
        return result;
      });
    this.responseSuccess(user);
  }

  async signOut() {
    console.log("signOut", this.request.decoded.id, this.request.body.device_token);
    let deviceToken = await DeviceToken.query()
      .where({user_id: this.request.decoded.id, token: this.request.body.device_token})
      .delete()
      .then(function(result) {
        return result;
      });
    this.responseSuccess(deviceToken);
  }
}
