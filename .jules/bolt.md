## 2024-08-25 - O(N*M) Frontend Bottleneck
**Learning:** The Politia App frontend frequently renders large datasets (e.g., scripture verses), making it susceptible to O(N*M) bottlenecks when mapping over verses and checking array inclusions (like .find() or .includes() for highlights/bookmarks).
**Action:** Always use pre-computed Maps or Sets with React.useMemo instead of array lookups inside rendering loops for this app's large dataset rendering.
