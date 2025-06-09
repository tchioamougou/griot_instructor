<template>
  <AdminLayout>
    <g-chat :filter-options="filterOptions">
    <template v-slot:header>
      <h1 class="mb-0 fw-bold h2">{{ $t('Messages') }}</h1>
    </template>
  </g-chat>
  </AdminLayout>
  
</template>
<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from "vue";
import {
  getChats,
  getMessages,
  getReadMessage,
  postMessage,
} from "@/services/griot_service";
import {
  extractContent,
  formatDateT,
  getFirstAndLastChars,
  getTimeAgoFromDateTime,
} from "@/utilities/UtilityFunction";
import GChat from '@/components/messages/GChat.vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
// Async components
//const GComposeMessage = defineAsyncComponent(() => import("./GComposeMessage.vue"));
//const GRichTextEditor = defineAsyncComponent(() => import("@/components/ui/GRichTextEditor.vue"));
//const GSpinner = defineAsyncComponent(() => import("./GSpinner.vue"));
//const SpinnerCmp = defineAsyncComponent(() => import("./Spinner.vue"));

import { useAuthStore } from '@/composables/user';

const authStore = useAuthStore();

const user = computed(() => {
  const userData = authStore.user;
  return JSON.parse(userData);
});
// Types
type Chat = any; // TODO: Replace with actual Chat type
type Message = any; // TODO: Replace with actual Message type

// Refs
const searchText = ref<string>("");
const chatsRef = ref<HTMLElement[] | null>(null);
const isLoading = ref<boolean>(false);
const showSendMessage = ref<boolean>(false);
const typing = ref<boolean>(false);
const isLoadingMessage = ref<boolean>(false);
const isSaving = ref<boolean>(false);
const chats = ref<Chat[]>([]);
const messages = ref<Message[] | null>(null);
const currentChat = ref<Chat | null>(null);
const pageNumber = ref<number>(1);
const pageSize = ref<number>(10);
const replyMessage = ref<string | null>(null);
const selectedFilter = ref<string>("");
const sortBy = ref<string | null>(null);
const contentMessage = ref<HTMLElement | null>(null);

// Options
const filterOptions = [
  { icon: 'bi-pin-angle', name: "All", label: "All" },
  { icon: 'bi-person-x', name: "Mute", label: "Unread" },
  { icon: 'bi-eye-slash', name: "Hide", label: "Read" },
  { icon: 'bi-pin-angle', name: "Pin", label: "Not answered" },
  { icon: 'bi-pin-angle', name: "Pin", label: "Answered" },
];

// Utility functions
const sendMessage = () => showSendMessage.value = true;
const cancel = () => showSendMessage.value = false;
const avatarText = () => getFirstAndLastChars("Griot User");
const extractContentLocal = (content: string) => extractContent(content, true);
const duration = (dt: string) => getTimeAgoFromDateTime(dt);
const formatDate = (dt: string) => formatDateT(dt);

// Core logic
const getMessagesLocal = () => {
  if (!currentChat.value) return;
  isLoadingMessage.value = true;
  getMessages(currentChat.value.id, pageNumber.value, pageSize.value)
    .then((response) => response.json())
    .then((result: Message[]) => {
      messages.value = result;
      isLoadingMessage.value = false;
    })
    .catch((error) => {
      isLoadingMessage.value = false;
      console.error("getMessagesLocal error:", error);
    });
};

const viewMessage = (message: Chat) => {
  if (message.status === "Unread") {
    getReadMessage(message.id)
      .then((response) => response.json())
      .then((result: Chat) => {
        chats.value = chats.value.map((e) => e.id === result.id ? result : e);
      })
      .catch((error) => console.error("viewMessage error:", error));
  }
  selectM(message);
};

const getChatLocal = () => {
  isLoading.value = true;
  getChats(user.value.id, selectedFilter.value || "", "")
    .then((response) => response.json())
    .then((result: Chat[]) => {
      chats.value = result;
      messages.value = null;
      currentChat.value = null;
      isLoading.value = false;
    })
    .catch((error) => {
      isLoading.value = false;
      console.error("getChatLocal error:", error);
    });
};

const selectM = (chat: Chat) => {
  chatsRef.value?.forEach((e) => {
    if (e.id === chat.id) {
      e.classList.add("active");
    } else {
      e.classList.remove("active");
    }
  });

  if (chat.id !== currentChat.value?.id) {
    currentChat.value = chat;
    getMessagesLocal();
  }
};

const addResponse = () => {
  if (!replyMessage.value || !currentChat.value) return;

  isSaving.value = true;

  const message = {
    content: replyMessage.value,
    ownerId: user.value.id,
    type: "message",
    status: "open",
    chatId: currentChat.value.id,
    toId: currentChat.value.you.id === user.value.id
      ? currentChat.value.him.id
      : currentChat.value.you.id,
  };

  postMessage(message)
    .then((response) => response.json())
    .then((result: Chat) => {
      isSaving.value = false;
      typing.value = false;
      chats.value = chats.value.map((e) => e.id === result.id ? result : e);
      getMessagesLocal();
    })
    .catch((error) => {
      isSaving.value = false;
      console.error("addResponse error:", error);
    });
};

const chatTitle = (chat: Chat) => {
  if (chat.lastPostedUser === user.value.id) return "You";
  return chat.you.id === user.value.id ? chat.him.name : chat.you.name;
};

const conversationTitle = computed(() => {
  if (!currentChat.value) return "";
  return currentChat.value.you.id === user.value.id
    ? currentChat.value.him.name
    : currentChat.value.you.name;
});

const applyFilter = () => getChatLocal();
const sortView = () => getChatLocal();

// Optional: Scroll handler (if needed)
const handleScroll = () => {
  const scrollElement = contentMessage.value;
  if (!scrollElement) return;

  const scrollTop = scrollElement.scrollTop;
  const scrollHeight = scrollElement.scrollHeight;
  const clientHeight = scrollElement.clientHeight;

  if (scrollTop + clientHeight >= scrollHeight) {
    getChatLocal();
  }
};

// Scroll watcher
watch(() => contentMessage.value, (value) => {
  if (value) value.scrollTop = value.scrollHeight;
});

// Init fetch
getChatLocal();
</script>


<style scoped>
.g-message {
  display: flex;
  flex-direction: column;
  margin: 2em 0;
}
.g-message-header {
  padding: 2em;
}
.g-message-header-filter {
  margin: 1em 0;
  display: flex;
}
.g-message-header-filter .filter {
}

.g-message-header-filter .filter label {
  margin-right: 2em;
  margin-left: 0.3em;
  font-family: sans-serif;
}

.g-message-header-filter .sortBy label {
  margin-right: 2em;
  margin-left: 0.3em;
  font-family: sans-serif;
}

.g-message-header .title {
  font-weight: 900;
  font-family: sans-serif;
  font-size: 1.7em;
  margin-bottom: 0.5em;
}
.g-message-content {
  margin: 2em 0;
  border: 0.1em solid rgb(106, 90, 204, 0.09);
  display: flex;
  flex-direction: row;
  height: 550px;
}
.g-message-content .block_list {
  width: 35%;
  border-right: 0.1em solid rgb(106, 90, 204, 0.09);
  height: 100%;
}
.g-message-content .block_list .block_list_head {
  width: 65%;
  border-bottom: 0.1em solid rgb(106, 90, 204, 0.09);
}

.g-message-content .block_list .block_list_head {
  display: flex;
  flex-direction: row;
}
.g-message-content .block_message {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 80%;
}
.block_message .block_message_header {
  width: 100%;
  border-bottom: 0.1em solid rgb(106, 90, 204, 0.09);
  padding: 0.5em 1em;
  padding-left: 3em;
  display: flex;
  justify-content: space-between;
  font-family: sans-serif;
}
.block_message_header .content {
  display: flex;
  flex-direction: column;
}
.block_message_header .icon {
  margin: 0.1em 0;
}
.block_message_header .icon i {
  font-size: 1.1em;
  margin: 0.5em;
  padding: 0.2em 0;
  cursor: pointer;
}
.block_message_header .content .details {
  font-family: sans-serif;
  font-size: 0.89em;
  color: dodgerblue;
}
.block_message_header .content .title {
  font-family: sans-serif;
  font-size: 1em;
  font-weight: 900;
}
.block_list_head .icon {
  padding: 0.5em;
  border-right: 0.1em solid rgb(106, 90, 204, 0.09);
  width: 10%;
}
.block_list_head .input {
  padding: 0.5em;
  width: 90%;
}
.block_message_content {
  padding: 2em;
  overflow: auto;
  height: 75%;
}
.block_list_content {
  padding: 0.1em;
  height: 92%;
  overflow: auto;
}

input[type="text"] {
  appearance: none;
  border: none;
  outline: none;
  width: 100%;
}
input[type="checkbox"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: 1px solid #0a0809;
  border-radius: 0px;
  width: 16px;
  height: 16px;
  outline: none;
  position: relative;
  transition: border-color 0.3s ease-in-out;
}

input[type="checkbox"]:checked:before {
  content: "\2713";
  width: 16px;
  height: 16px;
  background-color: black;
  position: absolute;
  color: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding-bottom: 0px;
  display: block;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
}

input[type="checkbox"]:checked:focus {
}

input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 1;
}
input[type="radio"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: 2px solid #0a0809;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  outline: none;
  position: relative;
  transition: border-color 0.3s ease-in-out;
}
input[type="radio"]:checked:before {
  content: "";
  width: 10px;
  height: 10px;
  background-color: black;
  position: absolute;
  color: white;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block;
  font-size: 5px;
  line-height: 5px;
  text-align: center;
}

input[type="checkbox"]:checked:focus {
}
.g-message-item {
  padding: 1em 0;
  padding-right: 1.2em;
  display: flex;
  flex-direction: row;
  border-bottom: 0.1em solid rgb(106, 90, 204, 0.09);
  cursor: pointer;
}

.g-message-item:hover {
  background-color: rgb(207, 213, 219, 0.25);
}
.avatar-button {
  font-size: 1rem;
  text-align: center;
  overflow: visible;
  border: 0;
  background-color: transparent;
}
.g-message-item .image_bloc {
  margin-right: 0.2em;
}
.g-message-item .message_bloc {
  margin: 0 0.5em;
  width: 80%;
}
.message_bloc .message_summary {
  font-weight: 400;
  font-family: sans-serif;
  font-size: 0.9em;
  margin-bottom: 0.5em;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis;
  width: 95%;
  cursor: pointer;
}
.message_bloc .message_details {
  font-family: sans-serif;
  margin-bottom: 0.01em;
  display: flex;
  justify-content: space-between;
}
.message_bloc .message_details .name {
  font-weight: 900;
  font-size: 0.8em;
}
.message_bloc .message_details .time {
  font-weight: 700;
  font-size: 0.8em;
}
.message_bloc .message_link {
  margin-top: 2em;
}
.message_link {
  font-size: 0.85em;
}
.message_link a {
  color: #0a58ca;
  font-family: sans-serif;
}
.message_link .lecture {
  color: #0a58ca;
  cursor: pointer;
}
.g-message-item .icon_bloc {
  display: flex;
  flex-direction: column;
  width: 10%;
}
.icon_bloc .item {
  float: right;
  cursor: pointer;
  font-family: sans-serif;
  font-size: 1.2em;
}
.avatar-text {
  align-items: center;
  color: #fff;
  display: block;
  background-color: var(--g-c-blue-dark);
  font-size: 0.8rem;
  border-radius: 50%;
  vertical-align: middle;
  justify-content: center;
  padding: 0.7rem;
}

.message_content {
  margin: 1.5em 0;
}
.block_message_content_item .content .message_content {
  display: flex;
}
.block_message_content_item .date {
  text-align: center;
  font-family: sans-serif;
  font-weight: 900;
  font-size: 0.9em;
}
.message_content .author {
  color: blue;
  font-size: 1.05em;
  font-weight: 900;
  cursor: pointer;
  margin-bottom: 0.5em;
}
.newMessage {
}
.g-message-header_title {
  display: flex;
  justify-content: space-between;
}
.newMessage button {
  padding: 0.5em 1em;
  font-weight: 700;
  background-color: white;
  border: 0.1em solid black;
}
.compose {
  width: 95%;
}
.block_message_footer {
  border-top: 0.1em solid rgb(106, 90, 204, 0.09);
}
.typing_Text button {
  width: 100%;
  outline: none;
  border: none;
  background-color: white;
  text-align: left;
  padding: 0.5em 1em;
  cursor: text;
}
.button_send {
  display: flex;
  justify-content: right;
}
.button_send button {
  outline: none;
  border: none;
  background-color: white;
  text-align: left;
  padding: 0.25em 1em;
  font-weight: 700;
  font-size: 0.9em;
  color: white;
  background-color: black;
  margin-bottom: 0.4em;
  margin-top: 0.4em;
  margin-right: 0.5em;
}
.button_send button:disabled {
  background-color: gray;
}
.no_message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  text-align: center;
}
.no_message_image {
}
.no_message_title {
  font-weight: 900;
  font-family: sans-serif;
}
.active {
  background-color: rgb(128, 128, 128, 0.11);
}
.no_selected_message{
  width: 80%;
  text-align: center;
}
.no_selected_message .no_message_image{
  height: 600px;
}
.filter input, .filter label, .sortBy input, .sortBy label{
  cursor: pointer;
}
</style>
