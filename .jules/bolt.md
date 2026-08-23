## 2025-03-09 - O(N*M) Rendering Loops in React Lists
**Learning:** Found an O(N) array lookup (`.includes()` and `.find()`) inside a long list rendering loop (`map` over verses). This creates a hidden O(N*M) bottleneck during React renders, especially problematic for large text lists like scriptures.
**Action:** When rendering long lists where each item requires checking existence in another collection (like highlights or bookmarks), always convert the collection to a `Set` or `Map` using `React.useMemo` beforehand to ensure O(1) lookups during the render cycle.
