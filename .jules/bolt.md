## 2025-02-18 - Search Filtering Optimization
**Learning:** In React applications with large local search datasets (like `CHAPTER_DATA` with multiple books and verses), filtering the entire dataset synchronously on every keystroke blocks the main thread and makes the input unresponsive.
**Action:** Use `useDeferredValue` for the search query combined with `useMemo` for the filtering logic to keep the UI responsive during expensive searches.
