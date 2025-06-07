<template>
  <div class="g-file">
    <label :for="'input' + apiName">
      <label class="g-input-label" v-if="label">{{ label }}</label>
      <span class="file">
        <span class="input">{{ fileNameLocal }}</span>
        <span class="button">{{ buttonName }}</span>
      </span>
    </label>
    <input
      :id="'input' + apiName"
      type="file"
      class="g-input-file"
      :accept="allow"
      @change="handleChange"
    />
  </div>
  <div class="error" v-if="messageError">
    <span>{{ messageError }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineEmits, defineProps } from 'vue'

const emit = defineEmits<{
  (e: 'uploadFile', file: File): void
}>()

const props = defineProps<{
  modelValue?: string
  label?: string
  apiName: string
  buttonName?: string
  fileName?: string
  allow?: string
}>()

const messageError = ref<string | null>(null)
const file = ref<File | null>(null)
const fileNameLocal = ref<string>('')

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (selectedFile) {
    file.value = selectedFile
    fileNameLocal.value = selectedFile.name
    emit('uploadFile', selectedFile)
  }
}

onMounted(() => {
  if (props.fileName) {
    fileNameLocal.value = props.fileName
  }
})
</script>

<style scoped>
.g-input-file {
  display: none;
}
.g-file {
  display: flex;
  flex-direction: column;
  margin: 0.5em 0;
}
.input {
  padding: 0.4em;
  border: 0.01em black solid;
  width: 100%;
}
.button {
  text-align: center;
  padding: 0.4em;
  border: 0.01em black solid;
  width: 20%;
  cursor: pointer;
}
.button:hover {
  background-color: rgba(128, 128, 128, 0.2);
}
.file {
  display: flex;
  flex-direction: row;
}
.error {
  color: red;
}
</style>
