import { ref } from "vue";
import {
  useEventListener,
  MaybeRefOrGetter,
  useElementSize,
  MaybeComputedElementRef,
} from "@vueuse/core";
interface useDragParams {
  target: MaybeRefOrGetter<HTMLElement | null | undefined>;
  container: MaybeComputedElementRef;
}
function NOOP() {}
export function useDrag(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  container: MaybeComputedElementRef = document.body,
  callbacks: {
    onStart?: () => void;
    onMove?: () => void;
    onEnd?: () => void;
  }
) {
  const { onStart, onMove, onEnd } = callbacks;
  const isDragging = ref(false);
  const startX = ref(0);
  const left = ref(0);
  const { width } = useElementSize(container);
  function start(e: MouseEvent) {
    e.stopPropagation();
    isDragging.value = true;
    startX.value = e.clientX;
    onStart?.();
  }
  function move(e: MouseEvent) {
    if (isDragging.value) {
      const deltaX = e.clientX - startX.value;
      left.value += deltaX;
      left.value = Math.max(0, Math.min(left.value, width.value));
      startX.value = e.clientX;
      onMove?.();
    }
  }
  function end() {
    isDragging.value = false;
    onEnd?.();
  }
  const config = { capture: true };
  useEventListener(target, "mousedown", start, config);
  useEventListener(window, "mousemove", move, config);
  useEventListener(window, "mouseup", end, config);
  return {
    isDragging,
    left,
    width,
  };
}
