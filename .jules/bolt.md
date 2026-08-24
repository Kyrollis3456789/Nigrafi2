## 2024-08-24 - O(M*N) Verse Rendering
**Learning:** The frontend renders large arrays of scripture verses (O(M)). Lookups for bookmarks and highlights using `.find()` or `.includes()` (O(N)) inside this mapping loop cause quadratic O(M*N) complexity, slowing down rendering significantly for long chapters with many highlights/bookmarks.
**Action:** Always extract inner-loop array searches into `React.useMemo` backed `Set` (for existence) and `Map` (for object lookup) structures to achieve O(M) rendering time.
