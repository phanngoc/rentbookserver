import dbConfig from "../config/database";
import Knex from "knex";
import {Model} from "objection";
import mogan from "morgan";

module.exports = function (app){
  let env = app.get('env');
  var knex = Knex(dbConfig[env].postgresConnection);

  knex.schema.createTable('tests', function (table) {
    table.increments();
    table.string('name');
    table.timestamps();
  }).then((res) => {
    console.log("ok ne create", res);
  })
  .catch((err) => {
    console.log("error ne", err);
  });

  knex.select('name').from('users').then((res) => {
    console.log("ok ne", res);
  })
  .catch((err) => {
    console.log("error", err);
  });
  Model.knex(knex);
  app.set("knex", knex);
}
