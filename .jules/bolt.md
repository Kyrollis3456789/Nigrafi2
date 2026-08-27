## 2024-05-15 - O(1) Lookups in ScriptureReader render loop
**Learning:** Rendering large lists like verses with inline array methods like `find()` and `includes()` for bookmarks and highlights introduces O(N*M) bottlenecks during React component rendering.
**Action:** Always pre-compute Maps or Sets using `React.useMemo` before rendering lists of elements with dependent lookup requirements, resulting in O(1) lookups during rendering.
