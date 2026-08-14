## 2024-08-14 - Expensive Search Filtering in Render Loop
**Learning:** Found a performance bottleneck in `SearchModal.tsx` where string operations (`toLowerCase`) were redundantly executed inside a deeply nested loop over thousands of verses during the React render cycle, causing the input field to freeze during typing.
**Action:** Always decouple text input state from heavy filtering operations using `useDeferredValue`, extract static/redundant operations out of loops, and memoize the expensive calculations with `useMemo`.
