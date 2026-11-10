# Contributing to Odyssey

Thank you for your interest in contributing to Odyssey! We welcome contributions to our student pre-ordering platform, WebGL spatial physics, and administrative systems.

---

## Code of Conduct

All contributors must adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before engaging with the community.

---

## Development Workflow

### 1. Fork & Clone
1. Fork the repository on GitHub: `https://github.com/imMohammedSahil/Odyssey`.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/Odyssey.git
   cd Odyssey
   ```

### 2. Branching Strategy
Create a dedicated topic branch with an informative name:
```bash
git checkout -b feature/audio-frequency-filter
# or
git checkout -b fix/thermal-receipt-polygon
```

### 3. Running Locally
Run both frontend and backend dev environments:
```cmd
.\start.bat
```
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:3000`

---

## Technical Architectural Standards

When writing code for Odyssey, please follow these core technical constraints:

### Frontend (React 19 + Three.js)
- **Zero Cumulative Layout Shift (CLS = 0)**:
  - Product catalog cards must maintain locked dimensions (`660px` width, `505px` height).
  - Chip containers must enforce `flex-wrap: nowrap` with horizontal touch scrolling to prevent multi-line reflow.
  - Indian Rupee (`₹`) typography must always maintain the fallback chain: `'Archivo Black', 'Plus Jakarta Sans', sans-serif`.
- **WebGL Liquid Cursor**:
  - Keep cursor configurations route-aware in `App.js` (`getCursorConfig(pathname)`).
  - Protect interactive click areas with `user-select: none` to prevent text-selection artifacts during droplet bursts.
- **Audio Crossfader**:
  - Always clean up audio nodes (`GainNode`, `AudioContext`) in React `useEffect` unmount hooks.
  - Use exponential volume ramping rather than linear ramping to prevent audio popping.

### Backend (Node.js + Express + MongoDB)
- **RESTful Endpoints**: Prefix all endpoints with `/api/` and return consistent JSON structures (`{ success: true, data }`).
- **Validation**: Enforce schema bounds in Mongoose models before persistence writes.
- **File Ingestion**: Validate MIME types and storage sizes in `multer.js` to protect disk storage.

---

## Commit Guidelines

Write clear, structured commit messages following Conventional Commits:

```
feat: add dynamic volume compression to payment audio manager
fix: prevent thermal receipt sawtooth overflow on mobile viewports
docs: document WebGL spring physics equations in README
perf: optimize cumulative luminance threshold slicing
```

---

## Pull Request Lifecycle

1. Ensure your local branch is rebased onto the latest `main`:
   ```bash
   git fetch origin
   git rebase origin/main
   ```
2. Verify that both backend and frontend launch cleanly without runtime console errors.
3. Push your branch to your fork:
   ```bash
   git push -u origin feature/your-feature-name
   ```
4. Open a Pull Request on GitHub against `main`.
5. Provide a clear PR description detailing:
   - What problem is solved or what capability is added.
   - Any visual changes (include screenshots or GIFs if applicable).
   - How the change was tested locally.

