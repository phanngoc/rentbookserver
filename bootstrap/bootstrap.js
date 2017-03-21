import dbConfig from "../config/database";
import Knex from "knex";
import {Model} from "objection";
import mogan from "morgan";
import expressValidator from "express-validator";
import pluralize from "pluralize";
import _ from "lodash"

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = function (app){
  let env = app.get('env');
  var knex = Knex(dbConfig[env].postgresConnection);
  Model.knex(knex);
  app.set("knex", knex);
  app.use(expressValidator({
    customValidators: {
      isUnique: function(input, params) {
        var modelName = _.upperFirst(pluralize.singular(params[0]));
        console.log("isUnique", modelName, params);
        return false;
      }
    }
  }));
}
