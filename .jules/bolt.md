## 2024-05-18 - Optimize Large Dataset Rendering in ScriptureReader
**Learning:** Found a performance bottleneck where large datasets (like scripture verses) were executing array lookups (.find, .includes) inside the render loop, resulting in O(N*M) time complexity. This caused sluggishness when rendering chapters.
**Action:** Always pre-compute Maps or Sets using React.useMemo before the render loop for arrays that will be searched repeatedly (like bookmarks or highlights).
