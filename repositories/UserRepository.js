import User from '../models/User'
import Thread from '../models/Thread'
import Message from '../models/Message'
import _ from 'lodash'

export default class UserRepository {
  constructor(db) {

  }

  async updateSocketId(userId, socketId) {
    let user = await User.query()
      .updateAndFetchById(userId,
        {socket_id: socketId}
      )
      .then(function(result) {
        return result;
      });
  }

  async findOne(userId) {
    return User.query()
      .where('id', userId)
      .first();
  }

  async addNewMessage(obj, user_send) {
    let user_receive = _.result(obj, 'user.id');
    let thread = await this.startConversation(user_receive, user_send);
    let data = _.pick(obj, ['text']);

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
