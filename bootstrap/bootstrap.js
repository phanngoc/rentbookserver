import dbConfig from "../config/database";
import Knex from "knex";
import {Model} from "objection";
import mogan from "morgan";
import expressValidator from "express-validator";
import pluralize from "pluralize";
import _ from "lodash"

module.exports = function (app){
  let env = app.get('env');
  var knex = Knex(dbConfig[env].postgresConnection);
  Model.knex(knex);
  app.set("knex", knex);
  app.use(expressValidator({
    customValidators: {
      // isUnique: function(value, params) {
      //   return new Promise(function(resolve, reject) {
      //     var condition = {};
      //     condition[params[1]] = value;
      //     var count = knex(params[0]).where(condition).
      //       select(knex.raw('count(*) as num')).then(function(result) {
      //         let num = parseInt(result[0].num);
      //         if (num == 0) {
      //           resolve(true);
      //         } else {
      //           resolve(false);
      //         }
      //     });
      //   });
      // }
    }
  }));
}
