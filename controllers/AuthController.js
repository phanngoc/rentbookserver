import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import User from '../models/User';
import BaseController from './BaseController';

export default class AuthController extends BaseController {
  constructor(req, res) {
    super(req, res);
  }

  async authenticate() {
    // find the user
    var self = this;
    let token = await User.query().where('username', this.request.body.username)
      .first()
      .then(function(user) {
        if (!user) {
          return { success: false, message: 'Authentication failed. User not found.' };
        } else if (user) {
          // check if password matches
          if (!bcrypt.compareSync(self.request.body.password, user.password)) {
            return { success: false, message: 'Authentication failed. Wrong password.' };
          } else {
            // if user is found and password is right
            // create a token
            var token = jwt.sign(user, process.env.KEY_SECRET, {
              expiresIn: 60 * 60 * 60 // expires in 24 hours
            });

            return {
              success: true,
              message: 'Enjoy your token!',
              body: {
                token: token,
                user: user
              }
            };
          }
        }
    });

    this.response.json(token);
  }
};
