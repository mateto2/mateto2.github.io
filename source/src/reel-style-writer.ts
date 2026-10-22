/** Cache only successful writes; a failed apply must remain retryable. */
export function createWriteCache() {
  const written = new Map<string, string>();
  return (key: string, value: string, apply: () => void) => {
    if (written.get(key) === value) return;
    apply();
    written.set(key, value);
  };
}

/**
 * One cache per real DOM element, so equal values on separate/replaced cards
 * still get written. Weak keys do not retain removed elements.
 * These properties must remain exclusively owned by this writer.
 */
export function createStyleWriter() {
  const writers = new WeakMap<HTMLElement, ReturnType<typeof createWriteCache>>();
  return (element: HTMLElement | null, key: string, value: string) => {
    if (!element) return;
    let write = writers.get(element);
    if (!write) {
      write = createWriteCache();
      writers.set(element, write);
    }
    write(key, value, () => element.style.setProperty(key, value));
  };
}
