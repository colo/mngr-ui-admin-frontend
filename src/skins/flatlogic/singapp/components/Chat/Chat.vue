<template>
  <aside :class="{chat: true, chatOpen}">
    <header class="chatHeader">
      <h4 class="chatTitle">Contacts</h4>
      <div class="chatSearch">
        <b-input size="sm" placeholder="Search..." @input="handleSearchInput"/>
        <i class="fa fa-search" />
      </div>
    </header>
    <div :class="{'chatPanel chatContacts': true, chatMessageOpen: chatMessageOpened}">
      <h5 class="navTitle">TODAY</h5>
      <b-list-group id="chat-sidebar-user-group" class="chatSidebarUserGroup">
        <b-list-group-item
          v-for="conversation in todayConversations.filter(filterConversations)"
          @click="(e) => openMessages(conversation, e)"
          :key="conversation.name"
        >
          <i :class="`fa fa-circle float-right text-${conversation.status}`" />
          <span class="thumb-sm float-left mr">
            <img class="rounded-circle" :src="conversation.image" alt="..." />
          </span>
          <div>
            <h6 class="messageSender">{{conversation.name}}</h6>
            <p class="messagePreview">{{conversation.lastMessage}}</p>
          </div>
        </b-list-group-item>
      </b-list-group>
      <h5 class="navTitle">LAST WEEK</h5>
      <b-list-group id="chat-sidebar-user-group" class="chatSidebarUserGroup">
        <b-list-group-item
          v-for="conversation in lastWeekConversations.filter(filterConversations)"
          @click="(e) => openMessages(conversation, e)"
          :key="conversation.name"
        >
          <i :class="`fa fa-circle float-right text-${conversation.status}`" />
          <span class="thumb-sm float-left mr">
            <img class="rounded-circle" :src="conversation.image" alt="..." />
          </span>
          <div>
            <h6 class="messageSender">{{conversation.name}}</h6>
            <p class="messagePreview">{{conversation.lastMessage}}</p>
          </div>
        </b-list-group-item>
      </b-list-group>
    </div>
    <div :class="{'chatPanel chatMessages': true, chatMessageOpen: !chatMessageOpened}">
      <h6 class="messagesTitle">
        <a @click="chatMessageOpened = true">
          <i class="fa fa-angle-left mr-xs" />
          {{conversation.name}}
        </a>
      </h6>
      <b-list-group>
        <b-list-group-item
          v-for="message in conversation.messages"
          :key="message.id"
          :class="{fromMe: message.fromMe, 'messageItem': true}"
        >
            <span class="thumb-sm">
              <img v-if="message.fromMe"
                class="rounded-circle" src="@skins/flatlogic/singapp/assets/people/a5.jpg" alt="..." />
              <img v-else
                class="rounded-circle" :src="conversation.image" alt="..." />
            </span>
          <div class="messageBody">{{message.text}}</div>
        </b-list-group-item>
      </b-list-group>
      <footer class="chatFooter form-group">
        <input class="form-control fs-mini"
          type="text" placeholder="Type your message" @keydown="addMessage"/>
      </footer>
    </div>
  </aside>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import $ from 'jquery';

import a1 from '@skins/flatlogic/singapp/assets/people/a1.jpg';
import a2 from '@skins/flatlogic/singapp/assets/people/a2.jpg';
import a3 from '@skins/flatlogic/singapp/assets/people/a3.jpg';
import a4 from '@skins/flatlogic/singapp/assets/people/a4.jpg';
import a5 from '@skins/flatlogic/singapp/assets/people/a5.jpg';
import a6 from '@skins/flatlogic/singapp/assets/people/a6.jpg';

export default {
  name: 'Chat',
  data() {
    return {
      // chatOpen: true,
      todayConversations: [{
        name: 'Chris Gray',
        status: 'success',
        lastMessage: 'Hey! What\'s up? So many times since we',
        image: a2,
        messages: [{
          id: 0,
          text: 'Hey! What\'s up?',
        }, {
          id: 1,
          text: 'Are you there?',
        }, {
          id: 2,
          text: 'Let me know when you come back.',
        }, {
          id: 3,
          text: 'I am here!',
          fromMe: true,
        }],
      }, {
        name: 'Jamey Brownlow',
        status: 'gray-light',
        lastMessage: 'Good news coming tonight. Seems they agreed to proceed',
        image: a1,
      }, {
        name: 'Livia Walsh',
        status: 'danger',
        lastMessage: 'Check out my latest email plz!',
        image: a1,
      }, {
        name: 'Jaron Fitzroy',
        status: 'gray-light',
        lastMessage: 'What about summer break?',
        image: a1,
      }, {
        name: 'Mike Lewis',
        status: 'success',
        lastMessage: 'Just ain\'t sure about the weekend now. 90% I\'ll make it.',
        image: a4,
      }],
      lastWeekConversations: [{
        name: 'Freda Edison',
        status: 'gray-light',
        lastMessage: 'Hey what\'s up? Me and Monica going for a lunch somewhere. Wanna join?',
        image: a6,
      }, {
        name: 'Livia Walsh',
        status: 'success',
        lastMessage: 'Check out my latest email plz!',
        image: a5,
      }, {
        name: 'Jaron Fitzroy',
        status: 'warning',
        lastMessage: 'What about summer break?',
        image: a3,
      }, {
        name: 'Mike Lewis',
        status: 'gray-light',
        lastMessage: 'Just ain\'t sure about the weekend now. 90% I\'ll make it.',
        image: a1,
      }],
      chatMessageOpened: true,
      conversation: Object,
      searchValue: '',
    };
  },
  methods: {
    filterConversations(item) {
      const isFindName = item.name.toLowerCase()
        .indexOf(this.searchValue.toLowerCase()) !== -1;
      const isFindMessage = item.lastMessage.toLowerCase()
        .indexOf(this.searchValue.toLowerCase()) !== -1;
      return isFindName || isFindMessage;
    },
    handleSearchInput(value) {
      Vue.set(this, 'searchValue', value);
    },
    openMessages(conversation, e) {
      Vue.set(this, 'conversation', conversation);
      Vue.set(this, 'chatMessageOpened', false);

      $(e.currentTarget).removeClass('active').find('.badge').remove();
    },
    addMessage(e) {
      if (e.key === 'Enter' && e.target.value) {
        const value = {
          text: e.target.value,
          fromMe: true,
        };

        Vue.set(this, 'conversation', Object.assign({}, this.conversation, {
          messages: [
            ...this.conversation.messages || [],
            value,
          ],
        }));

        e.target.value = '';
      }
    },
  },
  computed: {
    ...mapState('layout', {
      chatOpen: state => state.chatOpen,
    }),
  },
};
</script>

<style src="./Chat.scss" lang="scss" />
