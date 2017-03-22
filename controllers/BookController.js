import Book from '../models/Book';
import User from '../models/User';
import Location from '../models/Location'
import Comment from '../models/Comment'
import Image from '../models/Image'
import Action from '../models/Action'
import _ from 'underscore';
import async from 'async';
import BaseController from './BaseController'
import knex from 'knex'
import Promise from 'promise';
import fs from 'fs';

export default class BookController extends BaseController {

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = BookController.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = BookController.deg2rad(lon2-lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(BookController.deg2rad(lat1)) * Math.cos(BookController.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  constructor(req, res) {
    super(req, res);
  }

  async nearest() {
    var lat = this.request.query.lat;
    var lng = this.request.query.lng;
    var distance = this.request.query.distance;

    let querySelect = "2 * 3961 * asin(sqrt((sin(radians((\"user:locations\".\"lat\" - "+lat+") / 2))) ^ 2 + \
      cos(radians("+lat+")) * cos(radians(\"user:locations\".\"lat\")) * (sin(radians((\"user:locations\".\"lng\" - "+lng+") / 2))) ^ 2)) as distance";

    let nearestUsers = await Book.query()
      .eager('[user, user.locations]')
      .joinRelation('user.locations')
      .distinct('books.id')
      .select('books.*', Book.raw(querySelect))
      .orderBy('distance')
      .then(function(results) {
        var uniques = _.map(_.groupBy(results, function(doc){
          return doc.id;
        }),function(grouped){
          return grouped[0];
        });
        return uniques
      });

    this.response.json({
        success: true,
        statusCode: 200,
        body: nearestUsers
    });
  }

  async show() {
    var id = this.request.params.id;
    let bookDetail = await Book.query()
      .eager('[user, comments, images]')
      .findById(id)
      .then(function(results) {
        return results;
      });

    this.response.json({
        success: true,
        statusCode: 200,
        body: bookDetail
    });
  }

  async create() {
    let bookId = await Book.query()
      .insert(_.extend(_.pick(this.request.body, 'title', 'description'),
        {user_id: this.request.decoded.id})
      )
      .then(function(result) {
        return result.id;
      });

    let locationId = await Location.query()
        .insert(_.extend(_.pick(this.request.body, 'lat', 'lng'),
          {user_id: this.request.decoded.id})
        )
        .then(function(result) {
          return result.id;
        });

    _.each(this.request.files, function(elem) {
      let image = Image.query()
        .insert({
          name: elem.originalname,
          link: elem.filename,
          book_id: bookId,
        })
        .then(function(result) {
          return result.id;
        });
      return image;
    });

    this.response.json({
      success: true,
      statusCode: 200,
      body: {bookId: bookId}
    });
  }

  async update() {
    var self = this;
    let book = await Book.query()
      .updateAndFetchById(this.request.params.id,
        _.pick(this.request.body, 'title', 'description')
      )
      .then(function(result) {
        return result;
      });

    let locationId = await Location.query()
      .insert(_.extend(_.pick(this.request.body, 'lat', 'lng'),
        {user_id: this.request.decoded.id})
      )
      .then(function(result) {
        return result.id;
      });

    let idsImage = await Image.query()
      .where('book_id', book.id)
      .then(function(result) {
        return _.pluck(result, 'id') ;
      });

    let oldimages = _.map(this.request.body.oldimages, function(idImage){
      return parseInt(idImage, 10);
    });

    let idsRemove = _.difference(idsImage, oldimages);

    if (idsRemove.length != 0) {
      let linkPrepared = await Image.query()
        .whereIn('id', idsRemove)
        .then(function(result) {
          return _.pluck(result, 'link');
        });

      _.each(linkPrepared, function(link) {
        fs.unlink("public/uploads/" + link);
      });
    }

    let numDeleted = await Image.query()
      .whereIn('id', idsRemove)
      .delete()
      .then(function(result) {
        return result;
      });

    let filesPromise = [];
    _.each(this.request.files, function(elem) {
      let image = Image.query()
        .insert({
          name: elem.originalname,
          link: elem.filename,
          book_id: book.id,
        })
        .then(function(result) {
          return result;
        });
      filesPromise.push(image);
    });

    let allFiles = await Promise.all(filesPromise);

    this.response.json({
      success: true,
      statusCode: 200,
      body: {bookId: book.id}
    });
  }

  async borrow() {
    var self = this;
    let book = await Book.query().findById(this.request.params.id)
      .then(function(result) {
        return result;
      });
    if (book.user_id == this.request.decoded.id) {
      this.responseErrors(0);
    } else {
      let action = await Action.query()
        .insert({
          user_id: this.request.decoded.id,
          book_id: this.request.params.id,
          type: Book.BORROW
        })
        .then(function(result) {
          return result;
        }).catch(function(errors) {
          self.responseErrors(errors);
        });
      this.responseSuccess(action);
    }
  }

  async accept() {
    var self = this;
    let book = await Book.query().findById(this.request.params.book_id)
      .then(function(result) {
        return result;
      });
    if (book.user_id == this.request.decoded.id) {
      this.responseErrors(0);
    } else {
      let action = await Action.query()
        .update({type: Book.ACCEPT})
        .where("user_id", this.request.params.id)
        .andWhere("book_id", this.request.params.book_id)
        .andWhere("type", Book.BORROW)
        .then(function(result) {
          return result;
        }).catch(function(errors) {
          self.responseErrors(errors);
        });
      this.responseSuccess(action);
    }
  }

  async reback() {
    var self = this;
    let book = await Book.query().findById(this.request.params.book_id)
      .then(function(result) {
        return result;
      });

    if (book.user_id == this.request.decoded.id) {
      let action = await Action.query()
        .where("user_id", this.request.params.id)
        .andWhere("book_id", this.request.params.book_id)
        .andWhere("type", Book.ACCEPT)
        .update({type: Book.READY})
        .then(function(result) {
          return result;
        }).catch(function(errors) {
          self.responseErrors(errors);
        });
      this.responseSuccess(action);
    } else {
      self.responseErrors(0);
    }
  }

  async search() {
    var lat = this.request.query.lat;
    var lng = this.request.query.lng;
    var q = this.request.query.q;

    let querySelect = "2 * 3961 * asin(sqrt((sin(radians((\"user:locations\".\"lat\" - "+lat+") / 2))) ^ 2 + \
      cos(radians("+lat+")) * cos(radians(\"user:locations\".\"lat\")) * (sin(radians((\"user:locations\".\"lng\" - "+lng+") / 2))) ^ 2)) as distance";

    let booksSearch = await Book.query()
      .where('title', 'like', '%' + q + '%')
      .andWhere('description', 'like', '%' + q + '%')
      .eager('[user, user.locations]')
      .joinRelation('user.locations')
      .distinct('books.id')
      .select('books.*', Book.raw(querySelect))
      .orderBy('distance')
      .then(function(results) {
        var uniques = _.map(_.groupBy(results, function(doc){
          return doc.id;
        }),function(grouped){
          return grouped[0];
        });
        return uniques
      });

    this.response.json({
        success: true,
        statusCode: 200,
        body: booksSearch
    });
  }


}
