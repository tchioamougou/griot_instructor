<script setup lang="ts">
import GDropdownL from "@/components/ui/GDropdownL.vue";
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
  formatDateTime,
  formatTimeFromDateTime,
  getFirstAndLastChars,
} from "@/utilities/UtilityFunction";
import { useAuthStore } from '@/composables/user'
import Button from "@/components/ui/Button.vue";
import { useI18n } from "vue-i18n";


const authStore = useAuthStore()
const user = computed(() => {
  const userData = authStore.user
  return JSON.parse(userData);
})

const SpinnerCmp = defineAsyncComponent(() => import("@/components/spinner/Spinner.vue"));

const props = defineProps<{
  showFilter?: boolean
}>()

const chatsRefs = ref<HTMLElement[] | null>(null);
const chatsRef = ref<HTMLElement[] | null>(null);
const searchText = ref<string | undefined>();
const isLoading = ref<boolean>(false);
const showSendMessage = ref<boolean>(false);
const typing = ref<boolean>(false);
const isLoadingMessage = ref<boolean>(false);
const isSaving = ref<boolean>(false);
const chats = ref<Record<string, any>[]>([]);
const messages = ref<Record<string, any>[] | null>([]);
const currentChat = ref<Record<string, any> | undefined>();
const pageNumber = ref<number>(1);
const pageSize = ref<number>(10);
const replyMessage = ref<string | null>(null);
const selectedFilter = ref<string>("");
const sortBy = ref<string | null>(null);
const contentMessage = ref<HTMLElement | null>(null);
const scrollContainer = ref<HTMLElement | null>(null);
const { t } = useI18n();
const optionsMessage = [
  { icon: 'bi-pin-angle', name: "Pin", label: "Pin" },
  { icon: 'bi-person-x', name: "Mute", label: "Mute" },
  { icon: 'bi-eye-slash', name: "Hide", label: "Hide" },
  { icon: 'bi-pin-angle', name: "Pin", label: "Pin" }
];

const filterOptions = [
  { icon: 'bi-pin-angle', name: "all", label: t("All") },
  { icon: 'bi-person-x', name: "unread", label: t("Unread") },
  { icon: 'bi-eye-slash', name: "read", label: t("Read") },
  { icon: 'bi-pin-angle', name: "not_answered", label: t("Not answered") },
  { icon: 'bi-pin-angle', name: "answered", label: t("Answered") }
];

const sendMessage = (): void => {
  showSendMessage.value = true;
};

const cancel = (): void => {
  showSendMessage.value = false;
};

const getMessagesLocal = (load: boolean): void => {
  isLoadingMessage.value = load;
  getMessages(currentChat.value!.id, pageNumber.value, pageSize.value)
    .then((response) => response.json())
    .then((result: Record<string, any>[]) => {
      messages.value = result;
      isLoadingMessage.value = false;
    })
    .catch((error) => {
      isLoadingMessage.value = false;
      console.error("getMessagesLocal error:", error);
    });
};

const avatarText = (): string => {
  return getFirstAndLastChars("Griot User");
};

const extractContentLocal = (content: string): string => {
  return extractContent(content, true);
};

const viewMessage = (message: Record<string, any>): void => {
  if (message.status === "Unread") {
    getReadMessage(message.id)
      .then((response) => response.json())
      .then((result: Record<string, any>) => {
        chats.value = chats.value.map((e) => (e.id === result.id ? result : e));
      })
      .catch((error) => {
        console.error("viewMessage error:", error);
      });
  }
  selectM(message as unknown as Record<string, any>); // Assuming it’s treated as a chat object here
};

const getChatLocal = (load: boolean): void => {
  isLoading.value = load;
  getChats(user.value.id, selectedFilter.value ?? "", "")
    .then((response) => response.json())
    .then((result: Record<string, any>[]) => {
      chats.value = result;
      messages.value = null;
      currentChat.value = undefined;
      isLoading.value = false;
    })
    .catch((error) => {
      isLoading.value = false;
      console.error("getChatLocal error:", error);
    });
};

const duration = (dt: string): string => {
  return formatDateTime(dt);
};

const formatDate = (dt: string): string => {
  return formatDateT(dt);
};

const selectM = (chat: Record<string, any>): void => {
  chatsRefs.value?.forEach((e: HTMLElement) => {
    if (e.id === chat.id) {
      e.classList.add("g-active");
    } else {
      e.classList.remove("g-active");
    }
  });

  if (chat.id !== currentChat.value?.id) {
    currentChat.value = chat;
    getMessagesLocal(true);
  }
};

const addResponse = (): void => {
  isSaving.value = true;
  const message = {
    content: replyMessage.value,
    ownerId: user.value.id,
    type: "message",
    status: "open",
    chatId: currentChat.value!.id,
    toId:
      currentChat.value!.you.id === user.value.id
        ? currentChat.value!.him.id
        : currentChat.value!.you.id,
  };
  postMessage(message)
    .then((response) => response.json())
    .then((result: Record<string, any>) => {
      isSaving.value = false;
      typing.value = false;
      chats.value = chats.value.map((e) => (e.id === result.id ? result : e));
      replyMessage.value = null;
      getMessagesLocal(false);
    })
    .catch((error) => {
      isSaving.value = false;
      console.error("addResponse error:", error);
    });
};

const chatTitle = (chat: Record<string, any>): string => {
  return chat.lastPostedUser === user.value.id
    ? "You"
    : chat.you.id === user.value.id
      ? chat.him.name
      : chat.you.name;
};

const conversationTitle = computed<string>(() => {
  if (currentChat.value && (currentChat.value.you || currentChat.value.him)) {
    return currentChat.value.you.id === user.value.id
      ? currentChat.value.him.name
      : currentChat.value.you.name;
  }
  return 'Griot user';
});

const applyFilter = (): void => {
  getChatLocal(false);
};

const sortView = (): void => {
  getChatLocal(false);
};

const handleScroll = (): void => {
  const scrollElement = scrollContainer.value;
  if (!scrollElement) return;

  const { scrollTop, scrollHeight, clientHeight } = scrollElement;
  const isAtBottom = scrollTop + clientHeight >= scrollHeight;

  if (isAtBottom) {
    getChatLocal(false);
  }
};

watch(contentMessage, () => {
  if (contentMessage.value) {
    contentMessage.value.scrollTop = contentMessage.value.scrollHeight;
  }
});

/*** start */
getChatLocal(true);
</script>

<template>
  <div class="w-full">
    <section class="w-full px-0">
      <div class="flex flex-col xl:flex-row">
        <!-- Sidebar -->
        <div class="xl:w-1/4 w-full h-screen border-r border-t bg-white">
          <div class="sticky top-0 bg-white z-10 px-4 pt-3 pb-4">
            <div class="flex justify-between items-center">
              <slot name="header"></slot>
              <div class="flex items-center space-x-2">
                <Button size="sm" class="bg-violet-600 text-white rounded-full">
                  <i class="bi bi-pencil-square text-sm"></i>
                </Button>
                <g-dropdown-l :options="filterOptions" />
              </div>
            </div>
            <div class="mt-4 mb-4">
              <input type="search" placeholder="Search people, group and messages"
                class="w-full px-4 py-2 rounded border border-gray-300 text-base focus:outline-none focus:ring focus:border-blue-300">
            </div>
          </div>
          <div class="overflow-y-auto h-[calc(100vh-9rem)]">
            <div v-if="isLoading" class="text-center py-6">
              <spinner-cmp color="text-black" />
            </div>
            <ul v-if="chats && chats.length > 0" class="divide-y">
              <li v-for="ch in chats" :key="ch.id" @click="viewMessage(ch)" ref="chatsRefs"
                class="flex justify-between items-center px-4 py-4 hover:bg-gray-50 cursor-pointer">
                <div class="flex w-3/4 space-x-3">
                  <img src="../../assets/images/home/cameroun.png" class="w-10 h-10 rounded-full">
                  <div :class="[ch.status === 'Unread' && ch.lastPostedUser !== user.id ? 'font-bold' : '', 'w-full']">
                    <h5 class="truncate">
                      {{ chatTitle(ch) }}
                    </h5>
                    <p class="text-gray-500 truncate">
                      {{ extractContentLocal(ch.lastMessage) }}
                    </p>
                  </div>
                </div>
                <small class="text-gray-500 whitespace-nowrap">{{ duration(ch.lastPostDate) }}</small>
              </li>
            </ul>
            <div v-else class="text-center py-6">{{ $t('no_message') }}</div>
          </div>
        </div>

        <!-- Chat Body -->
        <div class="xl:w-3/4 w-full h-screen overflow-hidden">
          <div class="flex flex-col h-full">
            <!-- Header -->
            <div class="bg-white px-4 py-3 sticky top-0 border-b z-10 flex justify-between items-center">
              <div class="flex items-center space-x-2">
                <button class="block xl:hidden"><i class="fe fe-arrow-left"></i></button>
                <img src="../../assets/images/home/tanzanie.png" class="w-10 h-10 rounded-full">
                <div>
                  <h4 class="font-semibold">{{ conversationTitle }}</h4>
                  <p class="text-sm text-gray-500">{{ $t("Online") }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <a href="#" title="Voice Call"><i class="bi bi-telephone-outbound text-xl"></i></a>
                <a href="#" title="Video Call"><i class="bi bi-camera-video text-xl"></i></a>
              </div>
            </div>

            <!-- Messages -->
            <div ref="contentMessage" class="flex-1 overflow-y-auto px-4 py-5 space-y-6">
              <div v-if="isLoadingMessage" class="text-center">
                <spinner-cmp color="text-black" />
              </div>
              <template v-else-if="messages && messages.length > 0">
                <template v-for="(me, i) in messages" :key="i">
                  <div v-if="i == 0 || formatDate(me.createdDate) !== formatDate(messages[i - 1].createdDate)"
                    class="text-center text-xs text-gray-400">{{ formatDate(me.createdDate) }}</div>

                  <!-- Message left -->
                  <div v-if="me.owner.id !== user.id" class="flex space-x-3 max-w-lg">
                    <img src="../../assets/images/home/Instructor.svg" class="w-10 h-10 rounded-full">
                    <div>
                      <small>{{ me.owner.name }}, {{ duration(me.createdDate) }}</small>
                      <div class="bg-white shadow rounded mt-2 p-3">
                        <p class="text-gray-800" v-html="me.content"></p>
                      </div>
                    </div>
                  </div>

                  <!-- Message right -->
                  <div v-else class="flex justify-end max-w-lg ml-auto">
                    <div class="text-right">
                      <small>{{ formatTimeFromDateTime(me.createdDate) }}</small>
                      <div class="flex justify-end mt-2">
                        <div class="bg-white shadow rounded p-3">
                          <p class="text-gray-800 text-left" v-html="me.content"></p>
                        </div>
                        <img src="../../assets/images/home/cameroun.png" class="w-10 h-10 rounded-full ml-2">
                      </div>
                    </div>
                  </div>
                </template>
              </template>
              <div v-else class="text-center">{{ $t('no_message') }}</div>
            </div>

            <!-- Footer -->
            <div class="bg-white px-4 py-3 border-t">
              <form class="flex items-center space-x-3">
                <textarea v-model="replyMessage" rows="1"
                  class="flex-1 border rounded p-2 resize-none focus:outline-none"
                  placeholder="Type a New Message"></textarea>
                <button type="button" @click="addResponse" class="text-primary text-xl">
                  <i class="bi bi-send"></i>
                </button>
              </form>
              <div class="mt-3 flex space-x-3 text-xl text-gray-600">
                <a href="#"><i class="bi bi-emoji-smile"></i></a>
                <a href="#"><i class="bi bi-paperclip"></i></a>
                <a href="#"><i class="bi bi-mic"></i></a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@import url(@/assets/css/chat.css);

a {
  text-decoration: none;
}

.btn-icon {
  align-items: center;
  display: inline-flex;
  flex-shrink: 0;
  font-size: .92969rem;
  font-weight: 400;
  height: 3.5rem;
  justify-content: center;
  padding: 0;
  position: relative;
  width: 3.5rem
}

.g-active {
  background-color: var(--griot-gray-100);
}

.date {
  text-align: center;
  font-family: sans-serif;
  font-weight: 900;
  font-size: 0.9em;
  margin: 1em 0em;
}
</style>