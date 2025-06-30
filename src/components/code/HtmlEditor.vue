<template>
    <div :class="[
        'flex items-center justify-between bg-gray-900 text-white px-4 py-2 rounded-t-xl transition-all duration-300',
        isFullscreen ? 'fixed inset-0 z-50 w-full h-full rounded-none flex-col' : ''
    ]" ref="headerRef">
        <div class="flex items-center space-x-2">
            <FileText class="w-5 h-5 text-gray-400" />
            <span class="font-medium truncate">Éditeur </span>
        </div>
        <template v-if="isFullscreen">
            <div class="h-full w-full flex items-center justify-between mt-2">

                <div class="w-full h-full  shadow-xl overflow-hidden mb-6 flex flex-col md:flex-row "
                    v-if="isPreview">
                    <!-- Zone de sortie (Iframe pour la prévisualisation HTML) -->
                    <div class="w-full p-4 flex-1">
                        <iframe id="html-output" ref="iframeRef" title="Prévisualisation HTML"
                            class="w-full h-full bg-white rounded-md border border-gray-700"
                            sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin"></iframe>
                    </div>
                </div>

                <div class="w-full overflow-hidden mb-6 flex flex-col md:flex-row flex-1 h-full" v-else>
                    <!-- Zone de l'éditeur de code -->
                    <div class="w-full p-4 border-b md:border-b-0  border-gray-700 flex-1">
                        <textarea id="code-input"
                            class="w-full h-full p-3 bg-gray-900 text-green-300 font-mono text-sm rounded-md focus:ring-2 focus:ring-black outline-none resize-none"
                             v-model="code" spellCheck="false"
                            placeholder="Écrivez votre code HTML ici..."></textarea>
                    </div>
                </div>
            </div>


        </template>

        <div class="flex items-center space-x-2">
            <button class="p-2 rounded hover:bg-gray-800 transition" title="Undo">
                <Undo2 class="w-5 h-5" />
            </button>
            <button class="p-2 rounded hover:bg-gray-800 transition" title="Redo">
                <Redo2 class="w-5 h-5" />
            </button>
            <button class="p-2 rounded hover:bg-gray-800 transition" title="Sauvegarder" @click="saveHtml">
                <Save class="w-5 h-5" />
            </button>
            <div class="flex bg-gray-800 rounded overflow-hidden ml-2">
                <button class="px-3 py-1 text-white font-semibold focus:outline-none"
                    :class="(!isPreview) ? ' bg-primary' : ''" @click="codeDer">Code</button>
                <button class="px-3 py-1 text-gray-300 hover:bg-gray-700 transition" @click="preview"
                    :class="(isPreview) ? ' bg-primary' : ''">Aperçu</button>
            </div>
            <button
                class="ml-2 px-3 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded transition font-semibold flex items-center text-xs sm:text-sm"
                @click="toggleFullscreen" :title="isFullscreen ? 'Réduire' : 'Plein écran'">
                <component :is="isFullscreen ? Minimize2 : Maximize2" class="w-5 h-5" />
                <span class="ml-1 hidden sm:inline">{{ isFullscreen ? 'Réduire' : 'Plein écran' }}</span>
            </button>
        </div>
    </div>
    <!-- Barre de progression sous le header -->
    <div v-if="showProgress" class="w-full bg-gray-200 h-2 rounded-b">
        <div class="bg-blue-600 h-2 rounded-b transition-all duration-200" :style="{ width: progress + '%' }"></div>
    </div>



    <template v-if="!isFullscreen">

        <div class="w-full md:h-96 bg-gray-800 shadow-xl overflow-hidden mb-6 flex flex-col md:flex-row "
            v-if="isPreview">
            <!-- Zone de sortie (Iframe pour la prévisualisation HTML) -->
            <div class="w-full p-4 flex-1">
                <iframe id="html-output" ref="iframeRef" title="Prévisualisation HTML"
                    class="w-full h-64 md:h-[350px] bg-white rounded-md border border-gray-700"
                    sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin"></iframe>
            </div>
        </div>

        <div class="w-full bg-gray-800 overflow-hidden mb-6 flex flex-col md:flex-row" v-else>
            <!-- Zone de l'éditeur de code -->
            <div class="w-full p-4 border-b md:border-b-0 md:border-r border-gray-700 flex-1">
                <textarea id="code-input"
                    class="w-full h-64 md:h-96 p-3 bg-gray-900 text-green-300 font-mono text-sm rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    :class="isFullscreen ? 'h-full min-h-[400px]' : ''" v-model="code" spellCheck="false"
                    placeholder="Écrivez votre code HTML ici..."></textarea>
            </div>
        </div>
    </template>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { FileText, Undo2, Redo2, Save, Maximize2, Minimize2 } from 'lucide-vue-next';
import { useUploader } from '@/utilities/useUploader';
const { uploadWithProgress, progress } = useUploader();
const props = defineProps<{
    course?: Record<string, any>;
    item: Record<string, any>;
}>();
const emit = defineEmits(["selected"])
const code = ref(``)

const iframeRef = ref<HTMLIFrameElement | null>(null);
const isPreview = ref(false)
const isFullscreen = ref(false)
const headerRef = ref<HTMLElement | null>(null)
const showProgress = ref(false);
const renderHtml = () => {
    if (iframeRef.value) {
        const iframeDoc = iframeRef.value.contentWindow!.document;
        iframeDoc.open();
        iframeDoc.write(code.value);
        iframeDoc.close();
    }
};

watch(code, () => {
    renderHtml();
});
watch(
    () => iframeRef.value,
    () => {
        renderHtml();
    }
)
onMounted(async() => {
    console.log(props.item);
 if (props.item?.contentLink && props.item.documentType === 'webPage'  ) {
       try {
            const response = await fetch(props.item.contentLink);
            if (!response.ok) throw new Error('Network response was not ok');
            code.value = await response.text();
        } catch (error) {
            console.error('Error fetching HTML content:', error);
        }
      }



    renderHtml();
});
const preview = () => {
    isPreview.value = true;
    renderHtml()
}
const codeDer = () => {
    isPreview.value = false;
}
function toggleFullscreen() {
    isFullscreen.value = !isFullscreen.value
    if (isFullscreen.value) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
}

// Fonction de sauvegarde et upload
async function saveHtml() {
    if (!code.value.trim()) return;
    const blob = new Blob([code.value], { type: 'text/html' });
    const file = new File([blob], props.item.id + '.html', { type: 'text/html' });

    try {
        showProgress.value = true;
        const path = `video/courses/${props.course?.id}`;
        const filename = props.item.id + '.html';
        // uploadWithProgress doit retourner l'event ou l'url
        const downloadURL = await uploadWithProgress(file, filename, path);
        showProgress.value = false;

        const value = {
            downloadURL,
            filesize: file.size,
            duration: undefined,
            fileName: filename,
        };
        emit("selected", value);
    } catch (e) {
        showProgress.value = false;
    }
}
</script>