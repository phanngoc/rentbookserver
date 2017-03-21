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
}
