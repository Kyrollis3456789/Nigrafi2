## 2024-08-22 - ScriptureReader O(N*M) Rendering Bottleneck
**Learning:** React components rendering large datasets like `ScriptureReader` (which maps over `chapterData.verses`) are highly susceptible to performance degradation when array lookups (`.find`, `.includes`) are used inside the render loop, causing O(N*M) time complexity.
**Action:** Always pre-compute Maps or Sets using `React.useMemo` for derived states (like bookmarks or highlights) outside the render loop, achieving O(1) lookups per item and ensuring O(N) overall rendering complexity.
