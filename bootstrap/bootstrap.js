import dbConfig from "../config/database";
import Knex from "knex";
import {Model} from "objection";
import mogan from "morgan";

module.exports = function (app){
  let env = app.get('env');
  var knex = Knex(dbConfig[env].postgresConnection);
  Model.knex(knex);
  app.set("knex", knex);
}
