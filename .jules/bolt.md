## 2024-08-19 - ScriptureReader O(N*M) Lookup Optimization
**Learning:** Found a performance bottleneck specific to this codebase's architecture where `.includes()` and `.find()` were used repeatedly inside `.map()` loops when rendering verses. This caused an O(N*M) lookup bottleneck.
**Action:** Always use pre-computed Maps or Sets with React.useMemo instead of array lookups like `.find()` or `.includes()` inside rendering loops.
