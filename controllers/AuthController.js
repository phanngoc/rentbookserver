import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import User from '../models/User';
import BaseController from './BaseController';

export default class AuthController extends BaseController {
  constructor(req, res) {
    super(req, res);
  }

  authenticate() {
    // find the user
    User.where('username', '>', 40)
    .first()
    .then(function(user) {
      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {
        // check if password matches
        if (!bcrypt.compareSync(req.body.password, user.password)) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {
          // if user is found and password is right
          // create a token
          var token = jwt.sign(user, process.env.KEY_SECRET, {
            expiresIn: 60 * 60 // expires in 24 hours
          });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }
      }
    });
  }
};
