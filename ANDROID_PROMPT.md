# Politia App — Android

## 1. TECHNOLOGY STACK

**Current Web Stack:**
- **Framework:** Next.js 15.1.0
- **UI Library:** React 19.0.1
- **Language:** TypeScript (~5.8.2)
- **Styling:** Tailwind CSS 4.1.14, PostCSS 8.4.38
- **Icons:** Lucide React 0.546.0, Material Symbols Outlined (via Google Fonts)
- **State Management:** Zustand (custom stores: `reader-store.ts`, `bookmarks-store.ts`)
- **Animations:** Motion 12.23.24 (framer-motion), CSS animations/transitions
- **Data/Fetching:** Local static data structures (`src/lib/scriptureData.ts`), internal Next.js API routes (`/api/health`, `/api/search`, `/api/scripture`)
- **i18n:** Custom translation hook (`useTranslation`) with local JSON files in `locales/`
- **Image Handling:** `html-to-image` for generating shareable verse images
- **Testing:** Vitest 4.1.10, Playwright 1.62.1, React Testing Library

**Recommended Android Stack:**
- **Language:** Kotlin
  - *Why:* Standard, modern, null-safe language for Android development.
- **UI Toolkit:** Jetpack Compose
  - *Why:* Declarative UI paradigm, maps perfectly to the existing React component model, handles complex adaptive layouts well.
- **Styling:** Material 3 (M3)
  - *Why:* Native Android design system, supports dynamic theming and standard components, adaptable to the custom 20-theme system.
- **Navigation:** Navigation Compose
  - *Why:* Standard declarative routing for Compose applications, replacing Next.js file-based routing.
- **State Management:** ViewModel + StateFlow / Flow
  - *Why:* Native Android architecture for managing UI state and lifecycle, replacing Zustand.
- **Dependency Injection:** Hilt
  - *Why:* Standard DI framework for Android, simplifies ViewModel instantiation and dependency management.
- **Persistence:** DataStore (Preferences) + Room (Database)
  - *Why:* DataStore is perfect for user settings (theme, font size, reading mode, active language). Room is required to store the large `scriptureData` efficiently for querying, search, and bookmarks offline.
- **Networking:** Ktor or Retrofit (if external APIs are used later, currently mostly local data/internal APIs)
  - *Why:* Standard network clients for Android.
- **Icons:** Compose Material Icons Extended + Custom SVGs
  - *Why:* To replicate the Lucide and Material Symbols used in the web app natively.
- **Image/Sharing:** Core Graphics/Canvas + Android ShareSheet
  - *Why:* To replace `html-to-image` functionality for generating and sharing verse images.

## 2. GLOBAL DESIGN SYSTEM

### Colors (Theme Engine)
The application relies heavily on CSS variables and features a robust 20-theme system (10 light, 10 dark).

**Core Tokens:**
- `--bg-color`: Primary screen background
- `--text-color`: Primary text color
- `--text-muted`: Secondary text, borders
- `--border-color`: Dividers, borders
- `--accent-color`: Primary branding color, active states, buttons, links
- `--accent-hover`: Hover/pressed states for accent elements
- `--card-bg`: Surface color for cards, modals, dropdowns
- `--accent-light`: Light background for accent elements (e.g., selected items)
- `--slider-bg`: Background for track elements (sliders)

**Example Curated Themes:**
*Light Themes:*
- `theme-light-ivory` (Default/Ivory): bg `#FDFBF7`, text `#2c2a29`, accent `#990000`
- `theme-warm-sepia` (Sepia): bg `#f5efe6`, text `#433422`, accent `#8c4300`
- `theme-nordic-frost` (Nordic): bg `#f3f6f7`, text `#2c3539`, accent `#4682b4`

*Dark Themes:*
- `theme-charcoal-night` (Charcoal): bg `#121212`, text `#e3e3e3`, accent `#990000`
- `theme-dark-espresso` (Espresso): bg `#1c1512`, text `#ebdcc9`, accent `#d97706`
- `theme-midnight-gold` (Midnight): bg `#0b132b`, text `#d2d7df`, accent `#f5b041`
- `theme-liquid-glass` (Special): Uses radial gradients and backdrop filters (glassmorphism).

*Android Equivalent:* Implement a custom `ColorScheme` data class or extend Material 3 `ColorScheme` to support the 20 themes. Use `CompositionLocalProvider` (`LocalPolitiaTheme`) to provide custom theme colors down the Compose tree. For glassmorphism (`theme-liquid-glass`), use `Modifier.background(Brush...)` and potentially RenderEffect blur for supported API levels.

### Typography
- **Primary Serif (English/Coptic):** Merriweather, Georgia, serif
- **Primary Sans (UI):** Plus Jakarta Sans, system-ui, sans-serif
- **Arabic Serif:** Amiri, serif (used for Arabic scripture text)
- **Arabic Sans:** Cairo, sans-serif (used for Arabic UI text)

**Usage:**
- `font-serif`: Headings, scripture text (depending on language)
- `font-sans`: UI elements, small tags, buttons
- Font sizes range dynamically based on user settings (`fontSize` state in `reader-store`).

*Android Equivalent:* Create custom `FontFamily` definitions for Merriweather, Plus Jakarta Sans, Amiri, and Cairo. Create a custom Compose `Typography` object mapping these to standard Material roles (display, headline, title, body, label).

### Spacing & Shapes
- **Corner Radii:** Heavy use of rounded corners.
  - Buttons/Small elements: `rounded` (0.25rem), `rounded-md` (0.375rem)
  - Cards/Modals/Drawers: `rounded-xl` (0.75rem), `rounded-2xl` (1rem)
  - Circular elements: `rounded-full` (9999px)
- **Spacing:** Standard Tailwind 4-point grid.
  - Screen padding: `p-4` (16dp), `p-6` (24dp)
  - Component gaps: `gap-2` (8dp), `gap-4` (16dp), `gap-6` (24dp)

*Android Equivalent:* Map to Compose `dp`. Define standard shapes using `RoundedCornerShape` (e.g., `12.dp` or `16.dp` for cards and dialogs).

### Shadows / Elevation
- Subtle shadows used for cards and floating elements.
- `shadow-sm`, `shadow-md`, `shadow-xl` (for modals and hover states).
- `backdrop-blur-xs` (for modal overlays).

*Android Equivalent:* Use `Modifier.shadow` or the `elevation` parameter on `Surface`/`Card`. Use `Modifier.background(Color.Black.copy(alpha = 0.4))` for modal scrims.

### Icons
- Lucide React (e.g., `BookOpen`, `Settings`, `ChevronDown`, `Headphones`)
- Material Symbols Outlined (used via CSS class `material-symbols-outlined`)
- Sizing: Usually `w-6 h-6` (24dp) or `text-xl`/`text-lg`.

*Android Equivalent:* Use Compose Material Icons Extended. For Lucide-specific icons without direct Material equivalents, import SVGs as VectorDrawables.

### Animation
- Transitions: Standard `duration-150`, `duration-300` for color and transform changes (hover, active).
- Entrance Animations (Dashboard/Modals): `animate-in fade-in slide-in-from-bottom-6`, `zoom-in-95`.
- Loading: Spinning dashed border (60s linear infinite).
- Splash screen timeout (2.5s).

*Android Equivalent:* Use Compose Animation APIs (`AnimatedVisibility`, `animateColorAsState`, `animateFloatAsState`, `updateTransition`). Use `tween` and `spring` spec to match web timings.

## 3. APPLICATION STRUCTURE

**Route / Page Map:**
The web app is essentially an SPA residing on a single page (`/`) managed by a custom router in `App` component (`page.tsx`).

- `SCREEN-001` — Main Dashboard (`MainDashboard.tsx`)
- `SCREEN-002` — Splash Screen (`PiGraphiSplashScreen.tsx`)
- `SCREEN-003` — Scripture Reader (`PiGraphiReader.tsx` - Main Container)
  - Nested Components: `Header`, `LeftSidebar`, `RightSidebar`, `ScriptureReader`, `AudioPlayer`
- `MODAL-001` — Settings Modal (`SettingsModal.tsx`)
- `MODAL-002` — Bookmarks Modal (`BookmarksModal.tsx`)
- `MODAL-003` — Search Modal (`SearchModal.tsx`)
- `OVERLAY-001` — Context Menu (`ContextMenu.tsx`)

## 4. SCREEN-BY-SCREEN ANALYSIS

### SCREEN-001 — Main Dashboard
- **ID:** `SCREEN-MAIN-DASHBOARD`
- **Original Route:** `/` (default state)
- **Purpose:** Entry point for selecting application modules.
- **Android Presentation:** Full screen, immersive. Status bar should match `--bg-color` or be transparent.
- **Visual Description:**
  - **Background:** `--bg-color`, with two absolute positioned large decorative rings (border only, 3% opacity) in top-right and bottom-left.
  - **Header Section (Centered):**
    - Circular logo: Accent colored cross `✝` inside a circle with a spinning dashed outer ring.
    - Title: Large font, bold, accent color (`text-4xl md:text-5xl`).
    - Subtitle: Small uppercase sans font, tracking wide.
  - **Module Grid (Bottom half):**
    - Grid layout (1 column on mobile, 2 on tablet).
    - **Card 1 (Pi Graphi):** Active state. Icon `BookOpen`, Title, "ACTIVE" badge, Subtitle, Description. Hover/Press effect: elevates (`-translate-y-1`), shadow increases, border changes to accent.
    - **Card 2 (Settings):** Active state. Icon `Settings`. Similar layout to Card 1.
    - **Card 3 & 4 (Services, Library):** Locked state. Opacity 50%, grayscale icons, "LOCKED" badge. Not interactive.
  - **Footer:** Separator line, copyright text, tagline. Muted text.
- **Android Equivalent:** `Scaffold` -> `Box` (for absolute rings) -> `Column` (centered vertically). Use `ElevatedCard` for the active modules with custom click indications.

### SCREEN-002 — Splash Screen
- **ID:** `SCREEN-PI-GRAPHI-SPLASH`
- **Purpose:** Transition state when opening a module (2.5 seconds).
- **Visual Description:**
  - Full screen background (`--bg-color`).
  - Centered animated logo (spinning cross, similar to dashboard).
  - Title text pulsing opacity (`animate-pulse`).
- **Android Equivalent:** A composable displaying the logo, utilizing a `LaunchedEffect(Unit)` with `delay(2500)` that then calls a navigation callback to proceed to the reader.

### SCREEN-003 — Scripture Reader (Main View)
- **ID:** `SCREEN-PI-GRAPHI-READER`
- **Purpose:** Core reading experience, holding sidebars, header, and content.
- **Android Presentation:** Main app screen. Top App Bar for Header. Bottom Navigation/persistent bottom sheet for Audio Player. Drawers for Sidebars.
- **Visual Description & Components:**
  - **Header (`Header.tsx`):**
    - Top bar. Left: Logo/Back button. Middle: Book & Chapter selector (opens LeftSidebar/Navigation). Right: Action icons (Search, Bookmarks, Audio toggle, Settings toggle, RightSidebar toggle).
  - **Left Sidebar (`LeftSidebar.tsx`):** Navigation drawer.
    - Contains tabs: "Books" (OT/NT categorization) and "Chapters".
    - Scrollable list of books/chapters.
  - **Scripture Content (`ScriptureReader.tsx`):** Main area.
    - Scrollable list of verses.
    - Chapter Title at the top.
    - Verse presentation depends on `readingMode` (verse-by-verse vs paragraph) and `displayLang` (AR, EN, COP, PARALLEL).
    - In Parallel mode, verses are displayed side-by-side or stacked.
  - **Audio Player (`AudioPlayer.tsx`):**
    - Appears at the bottom when audio is active.
    - Controls: Play/Pause, Skip back/forward, Speed control, Close.
  - **Right Sidebar (`RightSidebar.tsx`):** (Implied by Header toggle, likely for notes/commentary).
- **Android Equivalent:**
  - Use `ModalNavigationDrawer` for the Left Navigation.
  - Use `Scaffold` with `TopAppBar` for the header.
  - The main content is a `LazyColumn` containing the verses.
  - The Audio Player should be a persistent bottom component (perhaps part of the `Scaffold`'s `bottomBar`).

### MODAL-001 — Settings Modal
- **ID:** `MODAL-SETTINGS`
- **Purpose:** Configure user preferences.
- **Visual Description:**
  - Dialog or Bottom Sheet format. Background `black/40 backdrop-blur-xs`.
  - Header: Icon, Title, Close button.
  - Scrollable content area with sections:
    - **Language:** Primary Language, Display Language, Active Languages (for parallel).
    - **Typography:** Font Family (Sans, Serif, Amiri, Cairo), Font Size (slider).
    - **Layout:** Columns (1 or 2), Reading Mode (Verse, Paragraph), Show Diacritics toggle.
    - **Theme:** Grid of theme color circles (20 themes), Custom Theme picker.
- **Android Equivalent:** Use `ModalBottomSheet` or a full-screen `Dialog` for mobile. Use `Slider` for font size, `Switch` for toggles, and custom circular `Surface` components for theme selection.

### MODAL-002 — Bookmarks Modal
- **ID:** `MODAL-BOOKMARKS`
- **Purpose:** View and manage saved bookmarks.
- **Visual Description:**
  - Dialog/Bottom Sheet format.
  - List of saved bookmarks. Empty state if none.
  - Each item shows book, chapter, verse number, snippet of text, date added.
  - Action to delete or tap to navigate to verse.
- **Android Equivalent:** `ModalBottomSheet` with a `LazyColumn` of `ListItem`s.

### MODAL-003 — Search Modal
- **ID:** `MODAL-SEARCH`
- **Purpose:** Full-text and navigation search.
- **Visual Description:**
  - Large input field at the top.
  - Real-time search results appearing below.
  - Categorized results (Navigation, Categories, Verses).
- **Android Equivalent:** A full-screen `Scaffold` overlay or `SearchBar` component (M3) that expands to show a `LazyColumn` of results.

### OVERLAY-001 — Context Menu
- **ID:** `OVERLAY-CONTEXT-MENU`
- **Purpose:** Actions on a specific verse.
- **Visual Description:**
  - Appears near the tapped verse or as a bottom sheet.
  - Actions: Highlight (colors), Bookmark, Copy, Share, Notes.
- **Android Equivalent:** For mobile, a `ModalBottomSheet` is usually preferred over an arbitrary popup for touch targets. Alternatively, an M3 `DropdownMenu` anchored to the verse.

## 5. INTERACTION SPECIFICATION

**Interaction:** Open Bookmarks
- **USER ACTION:** Tap Bookmark icon in Header.
- **CURRENT UI:** Reader Screen.
- **RESULT:** Opens Bookmarks Modal.
- **NAVIGATION:** None (stays on screen, opens modal).
- **STATE CHANGE:** `setBookmarksModalOpen(true)` in store.
- **DATA CHANGE:** None.
- **ANIMATION:** Modal slides up or fades in (`animate-in fade-in`).
- **ANDROID EQUIVALENT:** Update ViewModel state, which triggers a `ModalBottomSheet` to expand.

**Interaction:** Select a Theme
- **USER ACTION:** Tap a theme circle in Settings Modal.
- **CURRENT UI:** Settings Modal open.
- **RESULT:** Entire application color scheme changes immediately.
- **NAVIGATION:** None.
- **STATE CHANGE:** `setTheme('theme-id')` in store.
- **DATA CHANGE:** None.
- **ANIMATION:** Crossfade to new colors.
- **ANDROID EQUIVALENT:** Update `DataStore`. The root `CompositionLocalProvider` observing this state recomposes the entire app with the new `ColorScheme`.

**Interaction:** Verse Tap
- **USER ACTION:** Tap a verse text in `ScriptureReader`.
- **CURRENT UI:** Reader Screen.
- **RESULT:** Context Menu opens for that specific verse.
- **NAVIGATION:** None.
- **STATE CHANGE:** `showContextMenu({ verse, x, y ... })`.
- **DATA CHANGE:** None.
- **ANIMATION:** Menu appears with a fade-in.
- **ANDROID EQUIVALENT:** Detect tap via `Modifier.clickable`. Update ViewModel with selected verse data, triggering the `BottomSheet` context menu.

**Interaction:** Toggle Audio Player
- **USER ACTION:** Tap Headphones icon in Header.
- **CURRENT UI:** Reader Screen.
- **RESULT:** Audio Player appears at the bottom.
- **NAVIGATION:** None.
- **STATE CHANGE:** `setIsPlayingAudio(!isPlayingAudio)` in store.
- **DATA CHANGE:** None.
- **ANIMATION:** Audio player slides up from bottom.
- **ANDROID EQUIVALENT:** Update ViewModel state, triggering `AnimatedVisibility` for a persistent `BottomAppBar`.

**Interaction:** Sidebar Tab Switch
- **USER ACTION:** Tap "Chapters" tab in Left Sidebar.
- **CURRENT UI:** Left Sidebar open, showing "Books" list.
- **RESULT:** List switches to display chapters for the selected book.
- **NAVIGATION:** None.
- **STATE CHANGE:** Local component state (e.g., `activeTab = 'chapters'`).
- **DATA CHANGE:** None.
- **ANIMATION:** Immediate switch or slight fade.
- **ANDROID EQUIVALENT:** Use a Compose `TabRow` and switch the visible `LazyColumn` based on the selected tab state.

**Interaction:** Search Input Typing
- **USER ACTION:** Type text into Search Modal input field.
- **CURRENT UI:** Search Modal open, empty or previous results.
- **RESULT:** Results list populates below input.
- **NAVIGATION:** None.
- **STATE CHANGE:** Local component search query state updates.
- **DATA CHANGE:** Search function processes query against local `scriptureData`.
- **ANIMATION:** Results list updates instantly.
- **ANDROID EQUIVALENT:** Update TextField value state, trigger a coroutine in ViewModel to search Room Database, updating a `StateFlow` collected by the UI.

**Interaction:** Font Size Slider Change
- **USER ACTION:** Drag slider in Settings Modal.
- **CURRENT UI:** Settings Modal open.
- **RESULT:** Text size throughout app changes in real-time.
- **NAVIGATION:** None.
- **STATE CHANGE:** `setFontSize(value)` in store.
- **DATA CHANGE:** None.
- **ANIMATION:** Instant resize.
- **ANDROID EQUIVALENT:** Update DataStore font size preference. Provide new font sizes through custom `Typography` in `CompositionLocalProvider`.

## 6. COMPLETE USER FLOWS

**Flow: Reading and Navigation**
START (Dashboard)
→ Tap "Pi Graphi"
→ SCREEN-PI-GRAPHI-SPLASH (Wait 2.5s)
→ SCREEN-PI-GRAPHI-READER (Defaults to Genesis 1)
→ Tap Book/Chapter in Header
→ Opens Left Sidebar
→ Tap "Psalms" -> Tap "Chapter 23"
→ Sidebar closes, ScriptureReader scrolls to top and loads Psalms 23 data.

**Flow: Bookmark a Verse**
START (Reader Screen)
→ Tap Verse 5
→ OVERLAY-CONTEXT-MENU opens
→ Tap "Bookmark" icon
→ Verse is saved to `bookmarks-store`. Toast message appears: "Bookmark added". Context menu closes.
→ Tap Bookmark icon in Header
→ MODAL-BOOKMARKS opens, showing the newly saved verse.

## 7. RESPONSIVE WEB → MOBILE INTERPRETATION

- **Web Sidebars:** On desktop, `LeftSidebar` might be fixed. On mobile, it acts as an off-canvas drawer or full-screen overlay.
  - *Android:* Use `ModalNavigationDrawer` or `ModalBottomSheet` for navigation.
- **Web Modals:** Settings/Bookmarks appear as centered popups with backdrops on desktop.
  - *Android:* Translate to `ModalBottomSheet` or full-screen `Dialog` for better mobile ergonomics.
- **Parallel Reading (Columns):** Web allows 2 columns side-by-side.
  - *Android:* On phones, side-by-side text might be too cramped. Suggest stacking translations vertically per verse, or only allowing side-by-side in landscape mode.

## 8. STATES

- **Loading:** Used during splash screen and when fetching chapter data.
- **Empty:** "No bookmarks yet" in BookmarksModal.
- **Active/Selected:** Highlighted tabs in sidebars, selected theme in settings, playing verse in audio mode.
- **Disabled/Locked:** "Services" and "Library" modules on the Dashboard.

## 9. DATA AND BACKEND BEHAVIOR

- **State Management (Zustand -> Android):**
  - Web uses Zustand stores (`reader-store.ts`, `bookmarks-store.ts`).
  - Settings (Theme, Font, Lang) are persisted (likely LocalStorage).
  - *Android:* Use `androidx.datastore.preferences` for simple settings (theme, font size).
- **Scripture Data:**
  - Web imports static data from `src/lib/scriptureData.ts`.
  - *Android:* For a robust app, parse this data and store it in a local SQLite database using **Room**. This allows fast querying, search, and referencing for bookmarks.
- **Audio:**
  - Web uses HTML5 Audio API.
  - *Android:* Use `ExoPlayer` (Media3) for robust audio playback, handling background play and playback speed.

## 10. COMPONENT INVENTORY

- `AppCard`: Reusable elevated container. -> Compose `ElevatedCard` or `Surface` with shadow.
- `IconButton`: Button with icon and hover effects. -> Compose `IconButton`.
- `VerseItem`: Displays a single verse with multiple translations. -> Compose `Column` (if stacked) or `Row` (if parallel) representing the verse.
- `ThemeSelector`: Grid of theme options. -> Compose `LazyVerticalGrid` of custom colored circular `Surface` components.

## 11. ANDROID ARCHITECTURE

**Proposed Architecture: MVVM with Clean Architecture principles (simplified)**

- **UI Layer (`ui/`):**
  - Compose screens and components.
  - ViewModels managing screen state (e.g., `ReaderViewModel`).
- **Data Layer (`data/`):**
  - `local/`: Room Database (`ScriptureDatabase`, `BookmarkDao`), DataStore (`PreferencesManager`).
  - `repository/`: `ScriptureRepository` (fetches chapters/books from Room), `SettingsRepository`.
- **Domain Layer (`domain/`):**
  - Models (`Book`, `Chapter`, `Verse`, `Bookmark`).
- **DI (`di/`):** Hilt modules.

## 12. ANDROID PACKAGE / FILE PLAN

```
com.politia.app
├── PolitiaApp.kt
├── MainActivity.kt
├── ui
│   ├── theme
│   │   ├── Color.kt (Defines the 20 theme palettes)
│   │   ├── Theme.kt (LocalPolitiaTheme provider)
│   │   └── Type.kt (Merriweather, Plus Jakarta, Amiri, Cairo)
│   ├── components
│   │   ├── PolitiaCard.kt
│   │   └── TopBar.kt
│   ├── screens
│   │   ├── dashboard
│   │   │   ├── DashboardScreen.kt
│   │   │   └── DashboardViewModel.kt
│   │   ├── reader
│   │   │   ├── ReaderScreen.kt
│   │   │   ├── ReaderViewModel.kt
│   │   │   ├── components
│   │   │   │   ├── VerseItem.kt
│   │   │   │   ├── AudioPlayerBottomSheet.kt
│   │   │   │   └── ContextMenuBottomSheet.kt
│   │   └── settings
│   │       ├── SettingsBottomSheet.kt
│   │       └── SettingsViewModel.kt
│   └── navigation
│       └── PolitiaNavGraph.kt
├── data
│   ├── local
│   │   ├── PreferencesManager.kt (DataStore)
│   │   ├── db
│   │   │   ├── AppDatabase.kt
│   │   │   ├── BookmarkDao.kt
│   │   │   └── ScriptureDao.kt
│   │   └── entity
│   │       ├── BookmarkEntity.kt
│   │       └── VerseEntity.kt
│   └── repository
│       ├── ScriptureRepository.kt
│       └── SettingsRepository.kt
└── domain
    └── model
        ├── Book.kt
        ├── Chapter.kt
        └── Bookmark.kt
```

## 13. SCREEN IMPLEMENTATION ORDER

1. **Foundation & Theme:** Setup Compose project, Hilt, DataStore. Implement the custom Theme Engine (Colors, Typography).
2. **Data Layer:** Setup Room Database, parse `scriptureData.ts` into the DB. Implement Repositories.
3. **Dashboard:** Implement `DashboardScreen` and basic navigation.
4. **Settings:** Implement `SettingsBottomSheet` linked to DataStore to test Theme Engine changes globally.
5. **Reader Core:** Implement `ReaderScreen`, Header, and `ScriptureReader` (LazyColumn of verses).
6. **Navigation (Sidebars):** Implement LeftSidebar for Book/Chapter selection.
7. **Interactions:** Implement Context Menu (Highlight, Bookmark).
8. **Bookmarks:** Implement Bookmarks Modal and Room integration.
9. **Audio:** Implement `ExoPlayer` integration and Audio UI.

## 14. IMPLEMENTATION PROMPTS

### PROMPT-001 — Android Project Foundation & Theme Engine
- **Exact Task:** Create the Android project structure, setup Hilt, Navigation, DataStore, and build the custom Theme Engine.
- **Files/Classes to create or modify:** `PolitiaApp.kt`, `MainActivity.kt`, `ui/theme/Color.kt`, `ui/theme/Theme.kt`, `ui/theme/Type.kt`, `di/AppModule.kt`, `navigation/PolitiaNavGraph.kt`.
- **UI Requirements:** No visual screens yet, just define the foundational 20 themes (extracted from web `globals.css`) as data classes. Setup custom fonts (Merriweather, Plus Jakarta, Amiri, Cairo) in Compose Typography.
- **Behavior Requirements:** Provide the selected theme via `CompositionLocalProvider` so it can be dynamically swapped later.
- **Data Requirements:** None yet.
- **Navigation Requirements:** Setup an empty `NavHost` with placeholder routes for Dashboard and Reader.
- **Dependencies:** Hilt, Navigation Compose, DataStore Preferences.
- **Acceptance Criteria:** App compiles. Theme engine is fully defined with all 20 palettes. Hilt is configured.
- **What must NOT be changed:** Do not implement full UI screens in this step.

### PROMPT-002 — Data Layer (Room & DataStore)
- **Exact Task:** Implement local persistence for preferences and scripture data.
- **Files/Classes to create or modify:** `data/local/PreferencesManager.kt`, `data/local/db/AppDatabase.kt`, `data/local/db/BookmarkDao.kt`, `data/local/db/ScriptureDao.kt`, `data/repository/ScriptureRepository.kt`, `data/repository/SettingsRepository.kt`, Domain models (`Book`, `Chapter`, `Verse`, `Bookmark`).
- **UI Requirements:** None.
- **Behavior Requirements:** Provide data access mechanisms for viewmodels.
- **Data Requirements:** Define Room entities for Books, Chapters, Verses, Bookmarks. Create a mechanism to parse static scripture data (JSON or static Kotlin lists) and pre-populate the Room database. Define DataStore for theme, fontSize, readingMode.
- **Navigation Requirements:** None.
- **Dependencies:** Room Database, DataStore.
- **Acceptance Criteria:** Repositories can fetch data correctly. DataStore reads/writes preferences.
- **What must NOT be changed:** Existing web data structures should map logically to Kotlin data classes.

### PROMPT-003 — Dashboard Screen
- **Exact Task:** Implement the Main Dashboard UI.
- **Files/Classes to create or modify:** `ui/screens/dashboard/DashboardScreen.kt`, `ui/screens/dashboard/DashboardViewModel.kt`.
- **UI Requirements:** Replicate `MainDashboard.tsx`. Use a Scaffold. Create the spinning cross animation. Implement elevated Cards for modules (Pi Graphi, Settings, Services, Library). Ensure Services and Library are visually locked (opacity 50%).
- **Behavior Requirements:** Clicking "Pi Graphi" animates a splash logo briefly, then navigates to the Reader. Clicking "Settings" acts similarly but signals to open settings initially.
- **Data Requirements:** Viewmodel can manage transient UI state (e.g., showing splash).
- **Navigation Requirements:** Navigate from Dashboard to Reader.
- **Dependencies:** None.
- **Acceptance Criteria:** UI faithfully matches web version. Hover effects on web become touch ripple/elevation changes on Android. Navigation works.
- **What must NOT be changed:** The overarching 2x2 layout structure for tablets, condensing to 1xN for phones.

### PROMPT-004 — Reader Screen - Skeleton & Header
- **Exact Task:** Implement the scaffolding and TopAppBar for the Reader Screen.
- **Files/Classes to create or modify:** `ui/screens/reader/ReaderScreen.kt`, `ui/components/Header.kt`.
- **UI Requirements:** Use a Compose `Scaffold`. Create a `TopAppBar` that replicates the web Header. Left: Back arrow. Middle: Button showing current Book/Chapter. Right: Action icons (Search, Audio, Settings). Body is placeholder.
- **Behavior Requirements:** Clicking the Middle button should trigger opening a Left Navigation Drawer (to be implemented). Right icons trigger bottom sheets (to be implemented).
- **Data Requirements:** Needs current book/chapter state to display in the middle button.
- **Navigation Requirements:** Back arrow navigates back to Dashboard.
- **Dependencies:** None.
- **Acceptance Criteria:** Header displays correctly and responds to clicks, triggering state updates.
- **What must NOT be changed:** The spatial arrangement of Header icons.

### PROMPT-005 — Reader Screen - Scripture Content
- **Exact Task:** Implement the scrollable scripture text display.
- **Files/Classes to create or modify:** `ui/screens/reader/ScriptureReader.kt`, `ui/components/VerseItem.kt`, `ui/screens/reader/ReaderViewModel.kt`.
- **UI Requirements:** Use a `LazyColumn`. Display verses using `VerseItem`. Adapt fonts dynamically (Amiri for Arabic, Merriweather for English). React to font size changes. Support "verse-by-verse" and "paragraph" reading modes visually.
- **Behavior Requirements:** Scrolling through verses should be smooth. Long text should wrap.
- **Data Requirements:** Fetch current chapter data from `ScriptureRepository` via `ReaderViewModel`.
- **Navigation Requirements:** None.
- **Dependencies:** None.
- **Acceptance Criteria:** Scripture renders accurately. Language-specific fonts apply correctly. Parallel text modes display cleanly.
- **What must NOT be changed:** The typographic hierarchy and reading focus of the web app.

### PROMPT-006 — Navigation Drawer (Left Sidebar)
- **Exact Task:** Implement Book/Chapter selection navigation drawer.
- **Files/Classes to create or modify:** `ui/components/LeftSidebar.kt`, update `ReaderScreen.kt`.
- **UI Requirements:** Wrap the Reader Scaffold in a `ModalNavigationDrawer`. Implement a `TabRow` for "Books" and "Chapters". Display scrollable lists of books/chapters.
- **Behavior Requirements:** Selecting a book switches to the Chapter tab. Selecting a chapter updates the ViewModel's current chapter, scrolls the Reader to the top, and closes the drawer.
- **Data Requirements:** Load book and chapter lists from `ScriptureRepository`.
- **Navigation Requirements:** None (in-screen state change).
- **Dependencies:** None.
- **Acceptance Criteria:** Drawer opens/closes correctly. Selecting a passage changes the reader content seamlessly.
- **What must NOT be changed:** The two-tab (Books/Chapters) logic.

### PROMPT-007 — Settings Bottom Sheet
- **Exact Task:** Implement user configuration UI.
- **Files/Classes to create or modify:** `ui/screens/settings/SettingsBottomSheet.kt`, `ui/screens/settings/SettingsViewModel.kt`.
- **UI Requirements:** Create a `ModalBottomSheet` containing controls: Theme selection (grid of colored circles), Font Size (Slider), Reading Mode (Switch/Radio).
- **Behavior Requirements:** Interacting with controls instantly updates the app visually.
- **Data Requirements:** Read from and write to `PreferencesManager` (DataStore) via ViewModel.
- **Navigation Requirements:** None.
- **Dependencies:** None.
- **Acceptance Criteria:** Changing settings immediately applies across the entire application interface.
- **What must NOT be changed:** The specific configuration options available on the web version.

### PROMPT-008 — Context Menu & Bookmarks
- **Exact Task:** Implement verse interactions and bookmarks list.
- **Files/Classes to create or modify:** `ui/components/ContextMenuBottomSheet.kt`, `ui/screens/bookmarks/BookmarksModal.kt`, `ui/components/VerseItem.kt` (update).
- **UI Requirements:** Tapping a verse opens a Bottom Sheet (Context Menu) with actions. Bookmarks UI displays a list of saved verses with a delete option.
- **Behavior Requirements:** "Bookmark" action saves to Room DB and shows a Snackbar. Tapping a bookmark in the list navigates the reader to that specific verse.
- **Data Requirements:** Write/delete operations to `BookmarkDao`.
- **Navigation Requirements:** None for modal; selecting a bookmark triggers reader state change.
- **Dependencies:** None.
- **Acceptance Criteria:** Bookmarks can be added, viewed, and removed, persisting across app restarts.
- **What must NOT be changed:** The specific actions available on a verse tap.
## 15. COMPLETENESS CHECKLIST

- [x] SCREEN-MAIN-DASHBOARD documented
- [x] SCREEN-PI-GRAPHI-SPLASH documented
- [x] SCREEN-PI-GRAPHI-READER documented
- [x] MODAL-SETTINGS documented
- [x] MODAL-BOOKMARKS documented
- [x] MODAL-SEARCH documented
- [x] OVERLAY-CONTEXT-MENU documented
- [x] Header documented
- [x] Left Sidebar (Navigation) documented
- [x] Right Sidebar documented
- [x] Audio Player documented
- [x] Scripture Reader Content documented
