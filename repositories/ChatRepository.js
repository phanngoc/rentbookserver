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

  async getOppositeUser(message, user_id) {
    let thread = await Thread.query().findById(message.thread_id)
    .eager('[person_one, person_two]')
    .pick(['member_one', 'member_two']);
    .then(function(result) {
      return _.difference([result.member_one, result.member_two], [user_id]);
    });
    if (thread.person_one.id == user_id) {
      return thread.person_two;
    } else {
      return thread.person_one;
    }
  }

  async pushNotification(message, user_id) {
    let deviceTokens = await this.getDeviceToken(user_id);
    let oppositeUser = await this.getOppositeUser(member, user_id);

    var gcmMessage = new gcm.Message({
      collapseKey: 'demo',
      priority: 'high',
      contentAvailable: true,
      delayWhileIdle: true,
      timeToLive: 3,
      dryRun: true,
      data: {
        book_id: message.book_id,
        user: oppositeUser
      },
      notification: {
        title: "New message from " + message.user.name,
        icon: "ic_launcher",
        body: message.text
      }
    });
    var gcm_api_key = config.get(process.env.NODE_ENV'.gcm_api_key');
    let sender = new gcm.Sender(gcm_api_key);

    return new Promise((resolve, reject) => {
      sender.send(gcmMessage, {registrationTokens: deviceTokens}, function (err, response) {
        if (err) {
            console.log(err);
            reject(err);
        }
        else {
            console.log(response);
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
    let thread = await this.startConversation(user_receive, user_send);
    let data = _.pick(obj, ['text', 'book_id']);

    data.user_id = user_send;
    data.thread_id = thread.id;

    let result = await Message.query()
      .insert(data)
      .then(function (response) {
        return response.$loadRelated('user');
      });
    return result;
  }

  checkConversationExisted(memberOne, memberTwo) {
    return Thread.query()
      .eager('[person_one, person_two]')
      .where(function () {
          this.where('member_one', memberOne).andWhere('member_two', memberTwo);
      })
      .orWhere(function () {
          this.where('member_one', memberTwo).andWhere('member_two', memberOne);
      })
      .first();
  }

  async startConversation(memberOne, memberTwo) {
    let conversation = await this.checkConversationExisted(memberOne, memberTwo);
    if (!conversation) {
      conversation = await this.addNewConversation(memberOne, memberTwo);
    }

    return this.getConversation(conversation.id);
  }

  addNewConversation(memberOne, memberTwo) {
    let data = {
      member_one: memberOne,
      member_two: memberTwo
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
