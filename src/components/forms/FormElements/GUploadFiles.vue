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
    <div v-if="progress > 0 && progress < 100" class="w-full bg-gray-100 rounded h-2 overflow-hidden">
      <div class="bg-blue-500 h-full transition-all duration-200" :style="{ width: progress + '%' }"></div>
    </div>

    <!-- Error -->
    <div v-if="messageError" class="text-sm text-red-600">
      {{ messageError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
  ref as storageReference,
} from "firebase/storage";
import { ref, computed } from "vue";
import { ALLOW_FILE, IMAGE_RESOLUTION } from "@/utilities/utilityConstant";

// Props
const props = defineProps<{
  modelValue: string;
  repository: string;
  user?: Record<string, any>;
  allowFile: string;
  course: Record<string, any>;
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

// Constants
const allow = ALLOW_FILE;
const progress = ref(0);
const messageError = ref<string | null>(null);
const uploadTask = ref<any>(null);
const fileName = ref(props.placeholder);
const profileImage = ref<string>("");

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

const loadOnFireStore = (file: File, filename: string) => {
  const storage = getStorage();
  const storageRef = storageReference(storage, filename);
  uploadTask.value = uploadBytesResumable(storageRef, file);

  uploadTask.value.on(
    "state_changed",
    (snapshot: any) => {
      progress.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    },
    (error: any) => {
      console.error("Upload error:", error.code);
      messageError.value = "Upload failed: " + error.code;
    },
    () => {
      getDownloadURL(uploadTask.value.snapshot.ref).then((downloadURL: string) => {
        profileImage.value = downloadURL;
        const value = {
          downloadURL,
          filesize,
          duration,
          fileName: fileName.value,
        };
        if (props.type === "Video" || props.type === "Document") {
          launchSelected(value);
        } else {
          updateValue(downloadURL);
        }
      });
    }
  );
};

const handleChange = (e: Event) => {
  messageError.value = null;

  const target = e.target as HTMLInputElement;
  const file = target?.files?.[0];
  if (!file) return;

  fileName.value = file.name;
  filesize = file.size;

  let filename = "";
  if (props.fileName && props.repository) {
    filename = `${props.repository}/${props.fileName}__iv`;
  } else if (props.source === "Profile") {
    filename = `${props.repository}/${props.user?.id}__p`;
  } else if (props.source === "CourseImage") {
    filename = `${props.repository}/${props.course.id}__ci`;
  } else {
    filename = `Video/${props.course.id}__pv`;
  }

  if (props.type === "Video") {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.addEventListener("loadedmetadata", function () {
      duration = Math.floor(video.duration);
      video.remove();
      loadOnFireStore(file, filename);
    });
  } else if (props.type === "Image") {
    const image = new Image();
    image.onload = function () {
      if (image.width >= IMAGE_RESOLUTION.width && image.height >= IMAGE_RESOLUTION.height) {
        loadOnFireStore(file, filename);
      } else {
        messageError.value = "The resolution of the image is not good.";
      }
    };
    image.src = URL.createObjectURL(file);
  } else {
    loadOnFireStore(file, filename);
  }
};
</script>

<style scoped>
/* Remove default browser input styling */
input[type="file"] {
  display: none;
}
</style>
