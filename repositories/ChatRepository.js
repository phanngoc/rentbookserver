import User from '../models/User'
import Thread from '../models/Thread'
import Message from '../models/Message'
import DeviceToken from '../models/DeviceToken'
import _ from 'lodash'
import gcm from 'node-gcm'
import config from 'config'

export default class ChatRepository {
  constructor(db) {

  }

  async getDeviceToken(user_id) {
    return await DeviceToken.query()
      .where("user_id", user_id)
      .pluck('token')
      .then(function(results) {
        return results;
    });
  }

  async getOppositeUser(message) {
    let userIdAnother = await Thread.query().findById(message.thread_id)
    .eager('[person_one, person_two]')
    .pick(['member_one', 'member_two'])
    .then(function(result) {
      return _.difference(_.values(result), [message.user_id])[0];
    });

    return await User.query().findById(userIdAnother).then(function(user) {
      return user;
    });
  }

  async pushNotification(message) {

    let oppositeUser = await this.getOppositeUser(message);
    let deviceTokens = await this.getDeviceToken(oppositeUser.id);

    var gcmMessage = new gcm.Message({
      collapseKey: 'demo',
      priority: 'high',
      contentAvailable: true,
      delayWhileIdle: true,
      timeToLive: 3,
      dryRun: false,
      data: {
        book_id: message.book_id,
        user: message.user
      },
      notification: {
        title: "New message from " + message.user.name,
        icon: "ic_launcher",
        body: message.text
      }
    });
    var gcm_api_key = config.get('development.gcm_api_key');
    let sender = new gcm.Sender('AAAACRgMV2w:APA91bEmaGfUuPssp989DzBzFvLiC8X8uZV17GnMoFIxI1-Tvaq9nYquZhgpqmfNdLDlT0Ihwv3VJhT4y8P1a6cuBjUHIxykoZTe0DmJIEyQTDsaXKpMp4hLXo4hJM6sotBbjXmY0Nwj');

    return new Promise((resolve, reject) => {
      sender.send(gcmMessage, {registrationTokens: deviceTokens}, function (err, response) {
        if (err) {
            reject(err);
        }
        else {
            resolve(response);
        }
      });
    });
  }

  async getMessageByMember(user_id_one, user_id_two) {
    let response = await Message.query().joinRelation('[thread]')
      .eager('[user, thread]')
      .where(builder => {
        builder.where('thread.member_one', user_id_one)
        .where('thread.member_two', user_id_two)
      })
      .orWhere(builder => {
        builder.where('thread.member_one', user_id_two)
        .where('thread.member_two', user_id_one)
      })
     .then(function(response) {
        return response;
      });
    return response;
  }

  async getSocketIdByThread(threadId) {
    let results = Thread.query()
      .eager('[person_one, person_two]')
      .pick(User, ['socket_id'])
      .where('id', threadId)
      .first().then(function(response) {
        return [response.person_one.socket_id, response.person_one.socket_id];
      });
    return results;
  }

  async addNewMessage(obj, user_send) {
    let user_receive = _.result(obj, 'user.id');
    let thread = await this.startConversation(user_receive, user_send, obj.book_id);
    let data = _.pick(obj, ['text']);

    data.user_id = user_send;
    data.thread_id = thread.id;

    let result = await Message.query()
      .insert(data)
      .then(function (response) {
        return response.$loadRelated('user');
      });

    this.pushNotification(result).then(function(response) {
      console.log("Response push", response);
    }).catch(function(e){
      console.log("Catch error", e);
    });
    return result;
  }

  checkConversationExisted(memberOne, memberTwo, book_id) {
    return Thread.query()
      .eager('[person_one, person_two]')
      .where(function () {
          this.where('member_one', memberOne).andWhere('member_two', memberTwo)
            .andWhere('book_id', book_id);
      })
      .orWhere(function () {
          this.where('member_one', memberTwo).andWhere('member_two', memberOne)
            .andWhere('book_id', book_id);
      })
      .first();
  }

  async startConversation(memberOne, memberTwo, book_id) {
    let conversation = await this.checkConversationExisted(memberOne, memberTwo, book_id);
    if (!conversation) {
      conversation = await this.addNewConversation(memberOne, memberTwo, book_id);
    }

    return this.getConversation(conversation.id);
  }

  addNewConversation(memberOne, memberTwo, book_id) {
    let data = {
      member_one: memberOne,
      member_two: memberTwo,
      book_id: book_id
    };
    return Thread.query()
        .insert(data).then(function(result) {
          return result;
        });
  }

  getConversation(conversationId) {
    return Thread.query()
      .eager('[person_one, person_two]')
      .pick(User, ['name', 'id', 'avatar'])
      .where('id', conversationId)
      .first();
  }
}
