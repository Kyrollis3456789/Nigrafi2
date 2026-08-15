## 2024-08-15 - Array Lookups in Render Loops
**Learning:** Found multiple O(N) array lookups (`.find()` and `.includes()`) inside the main verse render loop in `ScriptureReader.tsx`, resulting in O(N*M) complexity when rendering chapters.
**Action:** Always check for linear lookups inside loops in render functions and convert arrays to `Set` or `Map` using `useMemo` for O(1) lookups.
