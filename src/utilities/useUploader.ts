import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";

export function useUploader() {
  const progress = ref(0);

  const uploadWithProgress = async (file: File, filename: string, path: string) => {
    const id = uuidv4();
    // Listen to SSE for progress
    const eventSource = new EventSource(`${import.meta.env.VITE_APP_STORAGE_URL}/progress/${id}`);
    eventSource.onmessage = (event) => {
      progress.value = parseInt(event.data);
    };

    return new Promise<string>((resolve, reject) => {
      eventSource.addEventListener("done", (event) => {
        progress.value = 100;
        eventSource.close();
        resolve((event as MessageEvent).data);
      });

      eventSource.onerror = (err) => {
        eventSource.close();
        reject(err);
      };

      // Send the file to the backend
      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", path);

      fetch(`${import.meta.env.VITE_APP_STORAGE_URL}/upload/${id}`, {
        method: "POST",
        body: formData,
      }).catch(reject);
    });
  };

  return { uploadWithProgress, progress };
}