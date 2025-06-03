<template>
  <label class="form-label g-input-label" v-if="label">{{ label }}</label>
  <div class="g-editor rounded mb-2">
    <div class="g-text-editor-header d-flex justify-content-between" v-if="showHeader">
      <div>
        <button type="button" :class="'g-rich-text-btn ' + apiName" data-element="bold" id="bold" @click="selectButton('bold')">
          <i class="bi bi-type-bold" ref="bold" />
        </button>
        <button type="button" :class="'g-rich-text-btn ' + apiName" data-element="italic" id="italic" @click="selectButton('italic')">
          <i class="bi bi-type-italic" ref="italic" />
        </button>
        <template v-if="justifyContent">
          <button type="button" :class="'g-rich-text-btn ' + apiName" data-element="underline" id="underline" @click="selectButton('underline')">
            <i class="bi bi-type-underline" ref="underline" />
          </button>
          <button type="button" :class="'g-rich-text-btn ' + apiName" data-element="insertUnorderedList">
            <i class="bi bi-list-ul" ref="insertUnorderedList" />
          </button>
          <button type="button" :class="'g-rich-text-btn ' + apiName" data-element="insertOrderedList">
            <i class="bi bi-list-ol" ref="insertOrderedList" />
          </button>
          <button type="button" :class="'g-rich-text-btn ' + apiName" data-element="justifyLeft">
            <i class="bi bi-justify-left" ref="justifyLeft" />
          </button>
          <button type="button" :class="'g-rich-text-btn ' + apiName" data-element="justifyCenter">
            <i class="bi bi-justify" ref="justifyCenter" />
          </button>
          <button type="button" :class="'g-rich-text-btn ' + apiName" data-element="justifyRight">
            <i class="bi bi-justify-right" ref="justifyRight" />
          </button>
        </template>
        <template v-if="showImage">
          <button type="button" :class="'g-rich-text-btn ' + apiName" data-element="insertImage" id="insertImage" @click="selectButton('insertImage')">
            <i class="bi bi-image" ref="insertImage" />
          </button>
        </template>
      </div>
      <span class="g-text-sm bg-gradient" v-if="optional">{{ $t?.('optional') || 'Optional' }}</span>
    </div>

    <div
      class="g-rich-text-content"
      contenteditable="true"
      @input="handleChange"
      ref="editor"
      @focusin="focusin"
      @focusout="focusout"
      :data-placeholder="dataPlaceholder"
      @paste="handlePaste"
    />
  </div>

  <div class="g-description">
    <div v-if="description">{{ description }}</div>
    <div v-if="max">{{ max - wordCount }}</div>
  </div>

  <input ref="imageInput" type="file" accept="image/*" style="display: none" @change="insertImage" />
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted, watch, computed } from 'vue';

const props = defineProps<{
  label?: string;
  content?: string;
  modelValue: string;
  min?: number;
  max?: number;
  description?: string;
  dataPlaceholder?: string;
  apiName?: string;
  justifyContent?: boolean;
  showImage?: boolean;
  showHeaderWhenEditing?: boolean;
  optional?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'focused'): void;
}>();

const wordCount = ref(0);
const showHeader = ref(true);
const isStarted = ref(true);
const editor = ref<HTMLElement | null>(null);
const imageInput = ref<HTMLInputElement | null>(null);

const handleChange = (event: Event) => {
  const target = event.target as HTMLElement;
  emit('update:modelValue', target.innerHTML);
  const text = target.innerText.trim();
  wordCount.value = text ? text.split(/\s+/).length : 0;
};

const selectButton = (id: string) => {
  const element = document.getElementById(id);
  if (element?.classList.contains('active_btn')) {
    element.classList.remove('active_btn');
  } else {
    element?.classList.add('active_btn');
  }
};

const focusin = () => {
  showHeader.value = true;
  if (props.showHeaderWhenEditing) {
    emit('focused');
  }
};

const focusout = () => {
  if (props.showHeaderWhenEditing) {
    showHeader.value = false;
  }
};

const triggerImageSelect = () => {
  imageInput.value?.click();
};

const insertImage = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target?.result as string;
      img.style.maxWidth = '100%';
      insertNodeAtCursor(img);
    };
    reader.readAsDataURL(file);
    input.value = '';
  }
};

const insertNodeAtCursor = (node: Node) => {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) {
    if (!editor.value) return;
    const range = document.createRange();
    range.setStart(editor.value, 0);
    range.collapse(true);
    sel?.removeAllRanges();
    sel?.addRange(range);
    range.insertNode(node);
    range.setStartAfter(node);
    range.setEndAfter(node);
    sel?.removeAllRanges();
    sel?.addRange(range);
  } else {
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(node);
    range.setStartAfter(node);
    range.setEndAfter(node);
    sel.removeAllRanges();
    sel.addRange(range);
  }
  emit('update:modelValue', editor.value?.innerHTML || '');
};

const handlePaste = (event: ClipboardEvent) => {
  if (props.showImage) return;
  const clipboardData = event.clipboardData;
  const hasImageFile = clipboardData?.files && Array.from(clipboardData.files).some(file => file.type.startsWith('image/'));
  const htmlData = clipboardData?.getData('text/html') || '';
  const containsImgTag = htmlData.includes('<img');
  if (hasImageFile || containsImgTag) {
    event.preventDefault();
  }
};

onMounted(() => {
  const elements = document.querySelectorAll(`.${props.apiName}`);
  elements.forEach((element) => {
    element.addEventListener('click', () => {
      const command = (element as HTMLElement).dataset.element;
      if (command === 'insertImage') {
        triggerImageSelect();
      } else {
        document.execCommand(command!, false, undefined);
      }
    });
  });

  if (props.content) {
    editor.value!.innerHTML = props.modelValue;
  }

  if (props.showHeaderWhenEditing) {
    showHeader.value = false;
  }
});

watch(() => props.content, (newValue) => {
  if (isStarted.value && editor.value) {
    editor.value.innerHTML = newValue || '';
    isStarted.value = false;
  }
});
</script>

<style scoped>
.g-text-editor-header {
  border-bottom: none;
  padding: 0.2em 0.5em;
}

.g-rich-text-btn {
  border: 0;
  margin: 0 0.3em;
  background-color: white;
}

.g-rich-text-content {
  border-top: 1px var(--griot-gray-400) solid;
  padding: 0.5em 1em;

  min-height: 70px;
  font-size: small;
}


.g-rich-text-content:focus {
  outline: none;
}

.g-editor {
  border: 1px var(--griot-gray-400) solid;
}

.g-editor:focus-within {
  border-color: darkslateblue;
  border-width: 2px;
}

.g-description {
  font-size: small;
  color: gray;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.g-rich-text-content:empty:before {
  content: attr(data-placeholder);
  color: gray;
}

.active_btn {
  background-color: var(--griot-gray-800) !important;
  color: white;
}
</style>
