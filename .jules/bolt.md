## 2024-08-21 - [Pre-computing Maps/Sets for verse lookup in rendering loops]
**Learning:** Using array `.includes()` and `.find()` inside rendering loops creates an O(N*M) bottleneck for large scripture datasets.
**Action:** Use pre-computed Maps or Sets with React.useMemo instead of array lookups inside rendering loops.
