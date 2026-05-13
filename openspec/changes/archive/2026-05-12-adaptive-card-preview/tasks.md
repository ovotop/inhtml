## 1. Host UI — Preview Rendering

- [x] 1.1 Remove fixed 16:9 aspect-ratio from `.card-preview` container
- [x] 1.2 Add max-height constraint (320px) and gradient fade for overflow
- [x] 1.3 Rewrite `initPreviews()` to load iframe, wait for load, read `#preview` rect, calculate scale and margin-top offset
- [x] 1.4 Add fallback logic: if no `#preview` element, show top 600px of artifact
- [x] 1.5 Add `sandbox="allow-same-origin"` to preview iframes
- [x] 1.6 Handle window resize to recalculate preview scale/offset
- [x] 1.7 Update overlay `openArtifact()` to work with new card structure

## 2. Skill — Preview Anchor Convention

- [x] 2.1 Add `id="preview"` convention to SKILL.md (explain when and where to use it)
- [x] 2.2 Add examples: status report wraps metrics, comparison wraps grid, flowchart wraps SVG
- [x] 2.3 Sync `assets/skill.md` with updated SKILL.md

## 3. Existing Artifacts

- [x] 3.1 Add `id="preview"` to existing artifact 0001 (status report)
- [x] 3.2 Add `id="preview"` to existing artifact 0002 (architecture diagram)

## 4. Verify

- [x] 4.1 Test: card with `#preview` shows adaptive preview
- [x] 4.2 Test: card without `#preview` falls back to top portion
- [x] 4.3 Test: click card opens full overlay
- [x] 4.4 Test: very tall `#preview` is capped with fade
