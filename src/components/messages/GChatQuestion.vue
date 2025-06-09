<script setup lang="ts">
import GDropdownL from "@/components/ui/GDropdownL.vue";
import { computed, defineAsyncComponent, ref, watch } from "vue";
import {
  getCoursesQuestions,
  getCoursesQuestionsPostAnwser,
  getCoursesQuestionsFilter
} from "@/services/griot_service";
import {
  extractContent,
  formatDateT,
  formatDateTime,
  formatTimeFromDateTime,
  getFirstAndLastChars,
} from "@/utilities/UtilityFunction";
import { useAuthStore } from '@/composables/user'
import GDropdown from '@/components/ui/GDropdown.vue';
import { getInstructorCourses } from "@/services/griot_service";
import Button from "../ui/Button.vue";
import GRichTextEditor from "@/components/forms/FormElements/GRichTextEditor.vue";
const courseOptions = ref<any>([{ label: 'All course', value: 'AllCourse' }]);
const request = ref<any>([]);

// Dummy method to be implemented
function findQuestion(val: string) {
  if (val === "AllCourse") {
    request.value = allCourseId.value;
    getAllQuestion(true);
  } else {
    request.value = [val];
    getAllQuestion(true);
  }
}

const authStore = useAuthStore()
const user = computed(() => {
  const userData = authStore.user
  return JSON.parse(userData);
})

const SpinnerCmp = defineAsyncComponent(() => import("@/components/spinner/Spinner.vue"));

const props = defineProps<{
  showFilter?: boolean,

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
const question = ref<Record<string, any>>({});
const currentChat = ref<Record<string, any> | undefined>();
const pageNumber = ref<number>(1);
const pageSize = ref<number>(10);
const replyMessage = ref<string>('');
const selectedFilter = ref<string>("");
const sortBy = ref<string | null>(null);
const contentMessage = ref<HTMLElement | null>(null);
const scrollContainer = ref<HTMLElement | null>(null);
const allCourseId = ref([]);

const optionsMessage = [
  { icon: 'bi-pin-angle', name: "Pin", label: "Pin" },
  { icon: 'bi-person-x', name: "Mute", label: "Mute" },
  { icon: 'bi-eye-slash', name: "Hide", label: "Hide" },
  { icon: 'bi-pin-angle', name: "Pin", label: "Pin" }
];

const filterOptions = [
  { icon: 'bi-pin-angle', name: "All", label: "All" },
  { icon: 'bi-person-x', name: "Mute", label: "Unread" },
  { icon: 'bi-eye-slash', name: "Hide", label: "Read" },
  { icon: 'bi-pin-angle', name: "Pin", label: "Not answered" },
  { icon: 'bi-pin-angle', name: "Pin", label: "Answered" }
];


const getQuestionsLocal = async (load: boolean) => {
  isLoadingMessage.value = load;
  const result = await getCoursesQuestions(currentChat.value!.id);
  if (result.jsonResponse && result.httpStatusCode === 200) {
    question.value = result.jsonResponse;
    console.log(" question.value", question.value);
    isLoadingMessage.value = false;
  } else {
    // handle error
    isLoadingMessage.value = false;
    console.error("getMessagesLocal error:");
  }
};

const avatarText = (): string => {
  return getFirstAndLastChars("Griot User");
};

const extractContentLocal = (content: string): string => {
  return extractContent(content, true);
};

const viewMessage = (message: Record<string, any>): void => {
  selectM(message); // Assuming it’s treated as a chat object here
};

const getAllQuestion = async (load: boolean) => {
  isLoading.value = load;
  const result = await getCoursesQuestionsFilter(request.value);
  if (result.jsonResponse && result.httpStatusCode === 200) {
    chats.value = result.jsonResponse;
    console.log("chats error:", chats.value);
    question.value = {};
    currentChat.value = undefined;
    isLoading.value = false;
    isLoading.value = false;
  } else {
    // handle error
    isLoading.value = false;
    console.error("getMessagesLocal error:");
  }
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
    getQuestionsLocal(true);
  }
};

const addResponse = async () => {
  isSaving.value = true;
  const message = {
    content: replyMessage.value,
    userId: user.value.id,
    questionId: currentChat.value!.id,
  };
  const result = await getCoursesQuestionsPostAnwser(message);
  if (result.jsonResponse && result.httpStatusCode === 200) {
    isSaving.value = false;
    typing.value = false;
    console.log('result', result)
    replyMessage.value = '';
    getQuestionsLocal(true);
  } else {
    // handle error
    isSaving.value = false;
    console.error("getMessagesLocal error:");
  }
};

const chatTitle = (chat: Record<string, any>): string => {
  return chat.sender.name;
};

const conversationTitle = computed<string>(() => {
  return currentChat.value ? currentChat.value.sender.name : 'Griot user';
});

const applyFilter = (): void => {
  getAllQuestion(false);
};

const sortView = (): void => {
  getAllQuestion(false);
};

const handleScroll = (): void => {
  const scrollElement = scrollContainer.value;
  if (!scrollElement) return;

  const { scrollTop, scrollHeight, clientHeight } = scrollElement;
  const isAtBottom = scrollTop + clientHeight >= scrollHeight;

  if (isAtBottom) {
    getAllQuestion(false);
  }
};

watch(contentMessage, () => {
  if (contentMessage.value) {
    contentMessage.value.scrollTop = contentMessage.value.scrollHeight;
  }
});
// Get instructor courses
const getInstructorCoursesLocal = () => {
  isLoading.value = true;
  getInstructorCourses(user.value.id)
    .then((response) => response.json())
    .then((result) => {
      courseOptions.value = courseOptions.value.concat(
        result.map((e: any) => ({
          label: e.title,
          value: e.id
        }))
      );
      allCourseId.value = result.map((e: any) => e.id);
      request.value = allCourseId.value;
      getAllQuestion(true);
      isLoading.value = false;
    })
    .catch(() => {
      isLoading.value = false;
    });
};
/*** start */
getInstructorCoursesLocal();
</script>

<template>
  <div class="">
    <section class="w-full px-0">
      <div class="flex flex-col xl:flex-row">
        <!-- Sidebar -->
        <div class="xl:w-1/4 w-full  border-r border-t bg-white">
          <div class="sticky top-0 bg-white z-10 px-4 pt-3 pb-4">
            <div class="flex justify-between items-center">
              <slot name="header"></slot>
              <g-dropdown :options="courseOptions" label-class="small" :disabled="isLoading" @selected="findQuestion" />
              <div class="flex items-center space-x-2">
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
                  <img :src="ch.sender.picture" class="w-10 h-10 rounded-full">
                  <div :class="[ch.status === 'Unread' && ch.lastPostedUser !== user.id ? 'font-bold' : '', 'w-full']">
                    <h5 class="truncate">
                      {{ chatTitle(ch) }}
                    </h5>
                    <p class="text-gray-500 truncate" v-if="ch.lastMessage">
                      {{ extractContentLocal(ch.summary) }}
                    </p>
                  </div>
                </div>
                <small class="text-gray-500 whitespace-nowrap">{{ duration(ch.lastModifyDate) }}</small>
              </li>
            </ul>
            <div v-else class="text-center py-6">{{ $t('No questions') }}</div>
          </div>
        </div>

        <!-- Chat Body -->
        <div class="xl:w-3/4 w-full  overflow-hidden">
          <div class="flex flex-col h-full">
            <!-- Header -->
            <div class="bg-white px-4 py-3 sticky top-0 border-b z-10 flex justify-between items-center"
              v-if="currentChat">
              <div class="flex items-center space-x-2">
                <button class="block xl:hidden"><i class="fe fe-arrow-left"></i></button>
                <img :src="currentChat.sender.picture" class="w-10 h-10 rounded-full">
                <div>
                  <h4 class="font-semibold">{{ conversationTitle }}</h4>
                  <p class="text-sm text-gray-500">{{ $t('Online') }}</p>
                </div>
              </div>
            </div>

            <!-- Messages -->
            <div ref="contentMessage" class="flex-1 overflow-y-auto px-4 py-5 space-y-6">
              <div v-if="isLoadingMessage" class="text-center">
                <spinner-cmp color="text-black" />
              </div>
              <template v-else-if="question && question.id">
                <!-- Message left -->
                <div class="flex space-x-3 max-w-lg">
                  <img v-if="question.sender.picture" :src="question.sender.picture" class="w-10 h-10 rounded-full">
                  <img src="../../assets/images/home/Instructor.svg" class="w-10 h-10 rounded-full" v-else>
                  <div>
                    <small>{{ question.sender.name }}, {{ duration(question.createdDate) }}</small>
                    <div class="bg-white shadow rounded mt-2 p-3">
                      <p class="text-gray-800" v-html="question.content"></p>
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-center my-6">
                  <div class="flex-grow h-px bg-gray-300"></div>
                  <span class="px-4 text-xs font-semibold tracking-wider text-blue-900 uppercase whitespace-nowrap">
                    {{ question.answers?.length }} {{ $t('Answers') }}
                  </span>
                  <div class="flex-grow h-px bg-gray-300"></div>
                </div>
                <template v-for="(me, i) in question.answers" :key="i">
                  <div v-if="i == 0 || formatDate(me.createdAt) !== formatDate(question.answers[i - 1].createdAt)"
                    class="text-center text-xs text-gray-400">{{ formatDate(me.createdAt) }}</div>

                  <!-- Message left -->
                  <div v-if="me.user.id !== user.id" class="flex space-x-3 max-w-lg">
                    <img v-if="me.user.picture" :src="me.user.picture" class="w-10 h-10 rounded-full ml-2">
                    <img v-else src="../../assets/images/home/Instructor.svg" class="w-10 h-10 rounded-full ml-2">
                    <div>
                      <small>{{ me.user.name }}, {{ duration(me.createdAt) }}</small>
                      <div class="bg-white shadow rounded mt-2 p-3">
                        <p class="text-gray-800" v-html="me.content"></p>
                      </div>
                    </div>
                  </div>

                  <!-- Message right -->
                  <div v-else class="flex justify-end max-w-lg ml-auto">
                    <div class="text-right">
                      <small>{{ formatTimeFromDateTime(me.createdAt) }}</small>
                      <div class="flex justify-end mt-2">
                        <div class="bg-white shadow rounded p-3">
                          <p class="text-gray-800 text-left" v-html="me.content"></p>
                        </div>
                        <img v-if="me.user.picture" :src="me.user.picture" class="w-10 h-10 rounded-full ml-2">
                        <img v-else src="../../assets/images/home/Instructor.svg" class="w-10 h-10 rounded-full ml-2">
                      </div>
                    </div>
                  </div>
                </template>
              </template>
              <div v-else class="text-center">{{ $t('No questions') }}</div>
            </div>

            <!-- Footer -->
            <div class="bg-white px-4 py-3 border-t" v-if="currentChat">
              <form class="flex items-center space-x-3" v-if="!typing">
                <input v-model="replyMessage" rows="1" @focus="typing = true"
                  class="flex-1 border rounded p-1 px-2 resize-none focus:outline-none"
                  placeholder="Type a New Message" />
              </form>
              <GRichTextEditor v-model="replyMessage" :justify-content="true" :show-image="true" v-else />
              <div class="flex justify-end mt-2">
                <Button size="sm" :disabled="!(typing && replyMessage && !isSaving)" @click="addResponse">
                  <SpinnerCmp v-if="isSaving"></SpinnerCmp>
                  {{ $t("post") }}
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
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