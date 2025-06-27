<template>
  <div class="flex flex-col space-y-2">
    <label :for="'input' + apiName" class="text-sm font-medium text-gray-700" v-if="label">
      {{ label }}
    </label>

    <label :for="'input' + apiName" class="flex border rounded overflow-hidden cursor-pointer hover:bg-gray-100 transition">
      <span class="flex-grow px-4 py-2 text-gray-800 truncate">{{ fileName }}</span>
      <span class="px-4 py-2 border-l text-blue-600 font-medium">{{ buttonName }}</span>
    </label>

    <input
      :id="'input' + apiName"
      type="file"
      class="hidden"
      @change="handleChange"
      :accept="acceptType"
    />

    <!-- Progress Bar -->
    <div v-if="(progress >= 0 && progress <= 100) && showProgration" class="w-full bg-gray-100 rounded h-2 overflow-hidden">
      <div class="bg-blue-500 h-full transition-all duration-200" :style="{ width: progress + '%' }"></div>
    </div>

    <!-- Error -->
    <div v-if="messageError" class="text-sm text-red-600">
      {{ messageError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { v4 as uuidv4 } from "uuid";
import { ALLOW_FILE, IMAGE_RESOLUTION } from "@/utilities/utilityConstant";

// Props
const props = defineProps<{
  modelValue: string;
  repository: string;
  user?: Record<string, any>;
  allowFile: string;
  course?: Record<string, any>;
  source: string;
  label?: string;
  placeholder: string;
  apiName: string;
  fileName?: string;
  buttonName?: string;
  type?: "Image" | "Video" | "Document";
}>();

// Emits
const emit = defineEmits<{
  (e: "update:modelValue", val: string): void;
  (e: "selected", val: any): void;
}>();

// State
const allow = ALLOW_FILE;
const progress = ref(0);
const messageError = ref<string | null>(null);
const fileName = ref(props.placeholder);
const videoUrl = ref('');
const showProgration = ref(false);
let duration: number | undefined;
let filesize: number | undefined;

const acceptType = computed(() => {
  return props.type === "Video"
    ? allow.video
    : props.type === "Image"
    ? allow.image
    : allow.documents;
});

const updateValue = (url: string) => {
  emit("update:modelValue", url);
};

const launchSelected = (value: any) => {
  emit("selected", value);
};

// Upload with SSE tracking
const uploadWithProgress = async (file: File, filename: string, path:string) => {
  const id = uuidv4();
  showProgration.value = true;
  // Listen to SSE for progress
  const eventSource = new EventSource(`${ import.meta.env.VITE_APP_STORAGE_URL}/progress/${id}`);
  eventSource.onmessage = (event) => {
    progress.value = parseInt(event.data);
     console.log("value", event.data)
  };

  eventSource.addEventListener("done", (event) => {
    videoUrl.value = event.data;
    progress.value = 100;
    showProgration.value = false;
    eventSource.close();

    const value = {
      downloadURL: event.data,
      filesize,
      duration,
      fileName: fileName.value,
    };
    console.log("value", value)
    if (props.type === "Video" || props.type === "Document") {
      launchSelected(value);
    } else {
      updateValue(event.data);
    }
  });

  // Send the file to the backend
  const formData = new FormData();
  formData.append("file", file);
  formData.append("path", path);

  await fetch(`${import.meta.env.VITE_APP_STORAGE_URL}/upload/${id}`, {
    method: "POST",
    body: formData,
  });
};

const handleChange = (e: Event) => {
  messageError.value = null;

  const target = e.target as HTMLInputElement;
  const file = target?.files?.[0];
  if (!file) return;

  fileName.value = file.name;
  filesize = file.size;

  let filename = "";
  let path  =''
   if (props.source === "Profile") {
    filename = `${props.repository}/${props.user?.id}__p`;
    path = `images/profiles/${props.user?.id}`
  } else if (props.source === "CourseImage") {
    filename = `${props.repository}/${props.course?.id}__ci`;
    path = `images/courses/${props.course?.id}`
  } else if (props.type === "Video") {
    path = `video/courses/${props.course?.id}`
    filename = `Video/${props.course?.id}__pv`;
  }else{
    path='default';
    filename="default"
  }

  if (props.type === "Video") {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.addEventListener("loadedmetadata", function () {
      duration = Math.floor(video.duration);
      video.remove();
      uploadWithProgress(file, filename,path);
    });
  } else if (props.type === "Image") {
    const image = new Image();
    image.onload = function () {
      if (image.width >= IMAGE_RESOLUTION.width && image.height >= IMAGE_RESOLUTION.height) {
        uploadWithProgress(file, filename,path);
      } else {
        messageError.value = "The resolution of the image is not good.";
      }
    };
    image.src = URL.createObjectURL(file);
  } else {
    uploadWithProgress(file, filename,path);
  }
};
</script>

<style scoped>
input[type="file"] {
  display: none;
}
</style>
