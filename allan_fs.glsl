#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform vec2  uResolution;   // canvas size, device px
uniform vec2  uPan;          // grid offset, device px
uniform vec2  uCard;         // card size, device px
uniform vec2  uGap;          // gutter between cards, device px
uniform float uRadius;       // corner radius, device px
uniform float uBezel;        // how far in from the rim the lens reaches, px
uniform float uRefract;      // lens strength, px of pull at the very rim
uniform vec3  uBackground;
/* How solid the gaps between panes are. The work section paints its own
   ground and wants 1; the Time Machine has a warp field running behind
   the lattice and wants 0, so the drift shows between the cards instead
   of being sealed off by them. */
uniform float uBgAlpha;
uniform float uShadow;
uniform float uCards;        // how many distinct cards are in rotation
uniform float uCurve;        // bulge within a single pane
uniform float uScreen;       // bulge of the whole tube face
uniform float uBowY;         // how much more the tall axis bows (portrait: > 1)
uniform vec2 uCells;         // fixed grid: columns, rows. zero = endless
uniform float uBlock;        // fixed grid: cards in the block
uniform float uSurround;     // fixed grid: card filling every cell round the block, -1 = none
uniform sampler2D uLattice;  // shuffled tile: 0 empty, else card index + 1
uniform vec2 uMapSize;       // tile width, height. zero = unused
uniform float uEdge;         // side falloff, as a fraction of the half-width
uniform float uEdgeY;        // top/bottom falloff — wider, it meets other sections
uniform vec2  uHover;        // cell under the pointer
uniform float uHoverAmt;     // 0..1, eased
uniform float uTime;         // seconds, for the signal on the hovered pane
uniform vec2  uPointer;      // canvas uv, y down — where the hand is
uniform float uPointAmt;     // 0..1, eased, pointer over the lattice
/* ── Cinema focus ──
   One pane flies to the centre to become the case-study film. While it
   does, it sheds the glass (radius, bevel and lens ease to a thin frame),
   its height eases to 16:9 so the film fits it exactly, and every other
   pane sinks into the dark. */
uniform vec2  uFocus;        // focused cell
uniform float uFocusAmt;     // 0..1
uniform float uFocusAspect;  // focused height / width at amt 1
uniform vec3  uFocusGlass;   // radius, bezel, lens (device px) at amt 1
uniform float uMono[32];     // per card: 1 = black and white
// ── Off tune ── the black-and-white cards (no film yet) also sit on a dead
// channel: snow over the picture, scanlines, a rolling hold bar, a little
// line jitter. Hovering a card tunes it most of the way in.
const float STATIC_AMT   = 0.2;    // snow mixed over the picture
const vec2  STATIC_GRID  = vec2(190.0, 170.0); // grains across a card (a touch wider than tall)
const float SCAN_LINES   = 120.0;  // scanlines down a card
const float STATIC_FPS   = 24.0;   // how often the snow changes
const float STATIC_HOVER = 0.7;    // share of the snow a hover tunes out
const float SCAN_AMT     = 0.1;    // scanline darkening
const float ROLL_AMT     = 0.07;   // brightness of the rolling hold bar
const float ROLL_SPEED   = 0.11;   // card heights per second
const float JITTER       = 0.003;  // line jitter, fraction of the card width
const float FLICKER      = 0.08;   // frame-to-frame brightness wobble
const float SWEEP_AMT    = 0.13;   // thin interference lines passing down the card
const float SWEEP_WIDTH  = 0.008;  // their thickness, fraction of the card height
const vec2  SWEEP_SPEED  = vec2(0.19, 0.31); // card heights per second, two lines
const float GHOST        = 0.24;   // how see-through an off-tune pane is (hover undoes most of it)
float tvHash(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}
// The hovered card grows by this fraction (0.04 = 4%). It must stay inside
// half a gutter: at 4% a 520px card gains ~10px a side against 13px.
const float HOVER_GROW = 0.04;
// Growing panes: cell xy + 0..1 amount (already eased on the CPU by a
// spring). Several at once, so the card you leave shrinks while the next
// one grows instead of waiting for it.
uniform vec3 uGrow[4];

/* ── Boot entrance ──
   Card by card from the middle of the screen outwards, each one zooming
   up from INTRO_FROM and settling with a small overshoot (a discreet
   pop), instead of the whole lattice fading in at once. uIntro is
   seconds since the entrance began: negative holds every card hidden,
   anything past INTRO_END is simply the finished lattice. */
uniform float uIntro;
const float INTRO_FROM = 0.6;     // starting scale of each card
const float INTRO_DUR = 0.72;     // seconds one card takes to arrive
const float INTRO_SPREAD = 1.15;  // seconds from the centre card to the corners
const float INTRO_JITTER = 0.24;  // random extra delay per card, seconds
const float INTRO_POP = 1.25;     // overshoot strength (0 = none; ~2.5% at 1.25)
const float INTRO_END = ${Le.toFixed(2)}; // INTRO_END_S at the top of this file

float introAt(vec2 cellId, vec2 pitch) {
  if (uIntro >= INTRO_END) return 1.0;
  // Distance of this card's centre from the middle of the screen, 0..~1.
  vec2 cc = (cellId + 0.5) * pitch - uPan - uResolution * 0.5;
  float reach = clamp(length(cc) / max(length(uResolution) * 0.5, 1.0), 0.0, 1.2);
  float jit = fract(sin(dot(cellId, vec2(12.9898, 78.233))) * 43758.5453);
  return clamp((uIntro - reach * INTRO_SPREAD - jit * INTRO_JITTER) / INTRO_DUR, 0.0, 1.0);
}

// Back-out ease: overshoots 1 slightly, then settles on it.
float popOut(float t) {
  float u = t - 1.0;
  return 1.0 + (INTRO_POP + 1.0) * u * u * u + INTRO_POP * u * u;
}

float growAt(vec2 cell) {
  float g = 0.0;
  for (int i = 0; i < 4; i++) {
    g += uGrow[i].z * step(abs(cell.x - uGrow[i].x) + abs(cell.y - uGrow[i].y), 0.5);
  }
  return min(g, 1.0);
}
uniform sampler2D uFilm;     // the case-study film, on the focused pane
uniform float uFilmAmt;      // 0..1, cover -> film
uniform vec2  uFilmFit;      // contain-fit of the film into the 16:9 pane

${ze}
// Cover-fit, per clip: the sub-rectangle of the video to sample so it fills
// the card without squashing. 1,1 means the clip already matches.
/* ── Atlas mode ──
   Six sampler pairs is all the guaranteed sixteen texture units will
   carry, which is fine for a handful of case studies and nowhere near
   enough for twenty years of archive. So a caller with more cards than
   that hands over ONE texture instead: every card drawn into a cell of a
   grid, picture and lettering already composited together. One unit, any
   number of cards. */
uniform float     uAtlas;      // 0 = sampler pairs, 1 = one atlas
uniform float     uOverflow;   // first card index stored in the atlas. 0 = the whole set
uniform sampler2D uAtlasTex;
uniform vec2      uAtlasGrid;  // columns, rows
uniform float     uAtlasClean; // 1 = a type-free copy of every cell sits below

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

/* Cover-fit for the pane's CURRENT box. At rest the box is the card and
   this is uFitN unchanged; as the focused pane eases to 16:9 (stretch =
   card height / box height grows) the crop opens until a 16:9 clip shows
   whole, with no squash at any point on the way. */
vec2 refit(vec2 fit, float stretch) {
  return fit.y > 0.999
    ? vec2(min(1.0, fit.x * stretch), 1.0)
    : vec2(1.0, fit.y / stretch);
}

${Be}
/** The card's own picture: the clip with its lettering laid over it. The
 *  text is composited BEFORE the glass, so it refracts with everything
 *  else rather than floating on top of the pane. */
vec3 content(int i, vec2 uv, float typeA, float stretch, float film) {
  // Clamped hard inside the cell. The lens samples past the edges, and in
  // atlas mode past the edge is the NEXT card rather than a stretched
  // pixel of this one.
  vec2 c = clamp(uv, vec2(0.0015), vec2(0.9985));
  // The pane's CURRENT box (16:9 once focused); stretch is card height
  // over box height, 1 at rest.
  vec2 b = clamp(vec2(uv.x, 0.5 + (uv.y - 0.5) * stretch), vec2(0.0015), vec2(0.9985));
  vec3 base;

  if (uAtlas > 0.5 && float(i) >= uOverflow - 0.5) {
    float fi = float(i) - uOverflow;
    vec2 cell = vec2(mod(fi, uAtlasGrid.x), floor(fi / uAtlasGrid.x));
    if (uAtlasClean < 0.5) return texture(uAtlasTex, (cell + c) / uAtlasGrid).rgb;
    // The cell is already cover-fitted to the card; a 16:9 box shows a
    // slightly shorter crop of it (plain c), never a squash.
    vec2 grid = vec2(uAtlasGrid.x, uAtlasGrid.y * 2.0);
    vec3 typed = texture(uAtlasTex, (cell + c) / grid).rgb;
    vec3 bare = texture(uAtlasTex, (cell + vec2(0.0, uAtlasGrid.y) + c) / grid).rgb;
    base = mix(bare, typed, typeA);
  } else {
    vec4 o = overlay(i, c);
    // typeA: the lettering lets go while the pane becomes the film.
    float ready = uReady[i];
    vec3 pic = ready > 0.999 ? clip(i, b, stretch) : mix(pending(b), clip(i, b, stretch), ready);
    base = mix(pic, o.rgb, o.a * typeA);
  }
  if (film <= 0.0) return base;
  // Contain-fit: anything outside the film's frame is black, as a player.
  vec2 fu = (b - 0.5) * uFilmFit + 0.5;
  float inFrame = step(0.0, fu.x) * step(fu.x, 1.0) * step(0.0, fu.y) * step(fu.y, 1.0);
  vec3 f = texture(uFilm, clamp(fu, vec2(0.0), vec2(1.0))).rgb * inFrame;
  return mix(base, f, film);
}

void main() {
  // ── The tube face ──
  // The bend that reads as a monitor is not inside each card, it is across
  // the whole sheet: the lattice itself has to bow, so cards drift and
  // compress towards the rim exactly as a picture does on curved glass.
  // The pointer is put through this same forward mapping on the CPU side,
  // which is why clicks still land on what you see.
  vec2 warp = vUv * 2.0 - 1.0;
  // On a tall screen the rows near the middle sit well inside the rim,
  // where a round bow barely bends; uBowY measures them as if the sheet
  // were as tall as it is wide, so the curve reads top-to-bottom too.
  vec2 bow = warp * vec2(1.0, uBowY);
  warp *= 1.0 + uScreen * dot(bow, bow);
  vec2 pix = (warp * 0.5 + 0.5) * uResolution;
  vec2 pitch = uCard + uGap;
  vec2 shifted = pix + uPan;
  vec2 id = floor(shifted / pitch);
  vec2 p = shifted - id * pitch - pitch * 0.5;

  /* Endless lattice: a shuffled tile, so the same study is not always a
     knight's move away. Empty cells are ground, which is what buys the
     extra space — a filled grid cannot be rearranged without pulling two
     copies closer. A fixed grid stays in reading order. */
  float slot;
  if (uCells.x > 0.5) {
    bool outside = id.x < 0.0 || id.x >= uCells.x || id.y < 0.0 || id.y >= uCells.y;
    slot = id.x + id.y * uCells.x;
    if (outside || slot > uBlock - 0.5) {
      if (uSurround < -0.5) {
        fragColor = vec4(uBackground * uBgAlpha, uBgAlpha);
        return;
      }
      slot = uSurround;
    }
  } else if (uMapSize.x > 1.0) {
    int ix = int(mod(id.x, uMapSize.x));
    int iy = int(mod(id.y, uMapSize.y));
    int code = int(texelFetch(uLattice, ivec2(ix, iy), 0).r * 255.0 + 0.5);
    if (code == 0) {
      fragColor = vec4(uBackground * uBgAlpha, uBgAlpha);
      return;
    }
    slot = float(code - 1);
  } else {
    slot = mod(mod(id.x + id.y * 2.0, uCards) + uCards, uCards);
  }
  int idx = int(slot + 0.5);

  float onThis = step(abs(id.x - uHover.x) + abs(id.y - uHover.y), 0.5);
  float hot = uHoverAmt * onThis;

  float isFocus = step(abs(id.x - uFocus.x) + abs(id.y - uFocus.y), 0.5);
  float fAmt = uFocusAmt * isFocus;

  // Hover lift: the whole pane (picture, glass, shadow) scales about its
  // centre. Never on the pane that is flying in to become the film.
  // Hover lift and the boot entrance share one scale, capped so a card
  // never pushes past half a gutter even if both peak together.
  float introT = introAt(id, pitch);
  float introS = mix(INTRO_FROM, 1.0, popOut(introT));
  float introA = smoothstep(0.0, 0.4, introT);
  p /= min((1.0 + HOVER_GROW * growAt(id) * (1.0 - fAmt)) * introS, 1.0 + HOVER_GROW * 1.25);
  float away = uFocusAmt * (1.0 - isFocus);
  float rad = mix(uRadius, uFocusGlass.x, fAmt);
  float bezel = mix(uBezel, uFocusGlass.y, fAmt);
  float refr = mix(uRefract, uFocusGlass.z, fAmt);

  // Height eases to 16:9 on the focused pane. It only ever shrinks inside
  // its own cell, so no pixel has to look into a neighbouring one.
  vec2 hb = vec2(uCard.x, mix(uCard.y, uCard.x * uFocusAspect, fAmt)) * 0.5;
  float d = sdRoundBox(p, hb, rad);

  // Outward normal, straight off the field.
  vec2 e = vec2(1.0, 0.0);
  vec2 n = normalize(vec2(
    sdRoundBox(p + e.xy, hb, rad) - sdRoundBox(p - e.xy, hb, rad),
    sdRoundBox(p + e.yx, hb, rad) - sdRoundBox(p - e.yx, hb, rad)
  ) + 1e-6);

  // 0 hard against the rim, 1 once you are past the bevel and into flat glass.
  float depth = clamp(-d / bezel, 0.0, 1.0);
  float lens = pow(1.0 - depth, 2.2);

  // ── The tube ──
  // A CRT is a curved sheet of glass, and the giveaway is not the shape of
  // the cabinet but what the picture does: it swells out of the middle and
  // packs together towards the corners. Sampling further out the further
  // out you already are does exactly that, and because it is quadratic in
  // radius the centre stays honest while the corners take all the bend.
  vec2 c = (p / uCard) * 2.0;
  // The focused pane goes flat: it has to match the film laid over it.
  float curve = uCurve * (1.0 - fAmt);
  c *= 1.0 + curve * dot(c, c);
  // The picture shifts a hair toward the hand, only on the pane you are
  // over. Small on purpose: the type has to stay a word.
  vec2 para = (vUv - uPointer) * 0.016 * hot;
  vec2 uv = c * 0.5 + 0.5 + para;
  // Idle holds the strong bend. Hover eases it back to the quieter
  // reading, so the pane under the hand settles instead of buckling more.
  vec2 pull = -n * lens * (refr / uCard) * (1.55 - hot * 0.55);

  vec3 col;
  float typeA = 1.0 - smoothstep(0.0, 0.55, fAmt);
  float stretch = uCard.y / max(hb.y * 2.0, 1.0);
  float film = uFilmAmt * isFocus;
  // Black and white for cards whose film is not made yet. The picture
  // only: the glass light below stays neutral either way, and a playing
  // film is never greyed.
  float mono = uMono[clamp(idx, 0, 31)] * (1.0 - film);
  // How far off the channel this pane is: hover tunes it in, and the
  // opened "coming soon" pane is half tuned.
  float tune = mono * (1.0 - STATIC_HOVER * hot) * (1.0 - 0.5 * fAmt);
  float tvFrame = floor(uTime * STATIC_FPS);
  // A surround's filler is one card on every cell; give each cell its own
  // phase so the whole sheet does not roll and sweep in step.
  float cellPhase = uSurround > -0.5 && abs(slot - uSurround) < 0.5
    ? fract(sin(dot(id, vec2(12.9898, 78.233))) * 43758.5453) : 0.0;
  if (tune > 0.0) {
    // Lost horizontal sync: each line slips a hair, now and then a band tears.
    float line = floor(uv.y * 140.0);
    float tear = step(0.985, tvHash(vec3(floor(uv.y * 9.0), floor(uTime * 3.0), 7.0)));
    uv.x += tune * (JITTER * (tvHash(vec3(line, tvFrame, 3.0)) - 0.5) + tear * JITTER * 2.5);
  }
  col.r = content(idx, uv + pull * 0.93, typeA, stretch, film).r;
  col.g = content(idx, uv + pull * 1.00, typeA, stretch, film).g;
  col.b = content(idx, uv + pull * 1.08, typeA, stretch, film).b;
  col = mix(col, vec3(dot(col, vec3(0.2126, 0.7152, 0.0722))), mono);
  if (tune > 0.0) {
    // Snow: square-ish grains in screen space, sized to the card, so the
    // lens never smears them into streaks. Slightly cool like a dead
    // channel, re-rolled every frame.
    vec2 grain = gl_FragCoord.xy / (uCard / STATIC_GRID);
    float snow = tvHash(vec3(floor(grain), tvFrame));
    col = mix(col, vec3(snow) * vec3(0.93, 0.96, 1.0), STATIC_AMT * tune);
    // Scanlines, a soft bar rolling down (vertical hold), and flicker.
    float scan = 0.5 + 0.5 * sin(gl_FragCoord.y / uCard.y * SCAN_LINES * 6.28318);
    float rb = fract(uv.y - uTime * ROLL_SPEED + cellPhase);
    float bar = exp(-pow((rb - 0.5) / 0.09, 2.0));
    col *= 1.0 - SCAN_AMT * tune * scan;
    col += ROLL_AMT * tune * bar;
    col *= 1.0 + FLICKER * tune * (tvHash(vec3(tvFrame, 1.0, 2.0)) - 0.5);
    // Two hairline interference lines drifting down at their own pace,
    // offset per card so the lattice never pulses in step.
    float lines = 0.0;
    for (int k = 0; k < 2; k++) {
      float y0 = 1.0 - fract(uTime * SWEEP_SPEED[k] + float(idx) * 0.37 + float(k) * 0.5 + cellPhase * 3.1);
      float dy = (uv.y - y0) / SWEEP_WIDTH;
      lines += exp(-dy * dy) + 0.25 * exp(-abs(dy - 3.0) * 0.6) * step(0.0, dy);
    }
    col += SWEEP_AMT * tune * lines;
  }

  // The bevel as a surface: flat through the middle, rolling over hard at
  // the rim. That roll doubles as the surface normal's tilt, so one
  // profile drives both the bending and the lighting, which is why the
  // highlight always sits exactly where the distortion is.
  vec3 surf = normalize(vec3(n * lens * 2.1, 0.5));
  // The key light walks with the hand. At rest it wanders, slowly, so a
  // pane you are not touching is not a dead sheet of plastic.
  vec2 rest = vec2(
    0.5 + 0.07 * sin(uTime * 0.32),
    0.44 + 0.05 * cos(uTime * 0.24)
  );
  vec2 lightUv = mix(rest, uPointer, uPointAmt);
  vec2 aim = (lightUv - 0.5) * 2.0;
  vec3 keyDir = normalize(vec3(-0.45 + aim.x * 0.85, 0.72 - aim.y * 0.7, 0.42));
  float key  = pow(max(dot(surf, keyDir), 0.0), 11.0);
  float fill = pow(max(dot(surf, normalize(vec3(0.55, -0.62, 0.56))), 0.0), 9.0);
  float sheen = pow(max(dot(surf, normalize(vec3(0.15, 0.2, 0.97))), 0.0), 22.0);
  col += key * 0.46 + fill * 0.20 + sheen * 0.14;

  // A pool of light that travels with the hand, and a thin streak through
  // the pane you are about to press. Both are the glass, not a filter:
  // they die at the rim and they are gone when the hand is gone.
  vec2 toLight = lightUv - vUv;
  float pool = exp(-dot(toLight, toLight) * 14.0);
  float onGlass = 1.0 - smoothstep(0.0, 2.0, d);
  col += pool * (0.035 + hot * 0.06) * onGlass;
  float band = (vUv.y - lightUv.y) * 1.6 + (vUv.x - lightUv.x) * 0.25;
  col += exp(-band * band * 22.0) * hot * 0.05;

  // Glass takes light rather than losing it: the bevel lifts, and only the
  // very deepest part of the pane picks up any absorption at all.
  col *= 1.0 + lens * 0.07;

  // The two lines that make a pane read as a pane — the bright edge where
  // it ends, and the soft crease where the bevel lets go into flat glass.
  col += smoothstep(2.5, 0.0, abs(d)) * 0.32;
  col -= smoothstep(bezel * 0.34, 0.0, abs(d + bezel)) * 0.10;

  // The corners of a tube fall away from the gun, so they sit darker. Kept
  // light: at 0.55 the picture in the corners went muddy and the pane
  // stopped reading as glass.
  col *= 1.0 - 0.32 * curve * dot(c, c);

  // Only the pane under the hand changes: the rest keep their brightness.
  col *= 1.0 + hot * 0.12;
  col += hot * smoothstep(uBezel * 1.6, 0.0, abs(d)) * 0.16;

  // ── The signal ──
  // What a tube does when something is live on it, and nothing more than
  // that. Scanlines locked to the pixel grid rather than to the picture,
  // so they read as the screen and not as texture on the image, and a
  // lift in contrast the way a set does when you turn it up.
  //
  // There was a roll and a tear here as well. Both are FAULTS — a picture
  // out of sync and a signal breaking up — and a card you are about to
  // press should not look broken. They are gone.
  //
  // Everything is scaled by hot and nothing is behind a branch, so a pane
  // fades into and out of being live with no step anywhere in it.
  float rows = uv.y * uCard.y;
  float scan = 0.5 + 0.5 * cos(rows * 2.2);
  col *= 1.0 - hot * 0.08 * scan;
  // Contrast about mid-grey: darks deepen, brights lift, and the picture
  // stays where it is.
  col = (col - 0.5) * (1.0 + hot * 0.16) + 0.5;

  // Capped: at a cell boundary d jumps to the neighbouring cell's own
  // distance, and while two neighbours sit at different scales (the
  // entrance, a hover grow) that jump made fwidth huge, smearing a
  // hairline of pane along every cell edge.
  float aa = clamp(fwidth(d), 0.75, 2.5);
  float inside = 1.0 - smoothstep(-aa, aa, d);

  // A soft contact shadow so the cards sit on the background rather than
  // being cut out of it. Where the background is transparent it is the
  // shadow alone that gives the gap any substance, so it carries alpha
  // as well as colour.
  // The shadow falls away from the light, so a pane reads as sitting up
  // off the page rather than as a hole cut in it.
  vec2 shadowOff = -aim * rad * 0.22;
  float dShadow = sdRoundBox(p - shadowOff, hb, rad);
  // The focused pane hands its shadow to the DOM frame: at that zoom the
  // shader's would be cut square by the cell edge.
  float shade = (1.0 - smoothstep(0.0, uRadius * 1.15, dShadow)) * (1.0 - inside) * (1.0 - fAmt);
  // Still arriving: the pane and its shadow fade up with the zoom.
  shade *= introA;
  inside *= introA;
  vec3 bg = uBackground * (1.0 - shade * uShadow);
  float bgA = max(uBgAlpha, shade * uShadow);

  // Off-tune panes are a little see-through: still being made. A hover
  // (and opening one) brings most of the body back.
  float body = inside * (1.0 - GHOST * mono * (1.0 - 0.7 * hot) * (1.0 - fAmt));
  vec3 outCol = mix(bg, col, body);
  float alpha = mix(bgA, 1.0, body);

  // ── The neon rim ──
  // Sits OUTSIDE the mix, so it can spill past the edge of the pane and
  // light the gap around it rather than stopping dead at the corner
  // radius. Two falls: a tight one that is the tube's own edge lit up,
  // and a wide soft one that is the light it throws.
  //
  // Measured from the HOVERED card, not from whichever card this pixel
  // happens to sit in. It used to use this pixel's own d, gated by
  // onThis, and onThis is per-CELL: the glow was cut to zero the instant
  // it crossed into the neighbouring cell. A cell is a rectangle, so
  // that cut drew one, and it drew it at full strength -- the halo falls
  // off over uBezel * 1.1 (about 77px) while the gutter it had to cross
  // is half a gap (about 13px), so it was still at 84% when it hit the
  // boundary and vanished. Distance to the hovered card's own rounded
  // box has no cell in it, so the light simply falls off in every
  // direction and spills onto the neighbours the way light does.
  vec2 pHover = (shifted - (uHover + 0.5) * pitch) / (1.0 + HOVER_GROW * growAt(uHover));
  float dHover = sdRoundBox(pHover, hb, uRadius);
  float edge = exp(-abs(dHover) / max(uBezel * 0.16, 1.0));
  float halo = exp(-abs(dHover) / max(uBezel * 1.1, 1.0));
  // Kept low. At twice this it stopped being an edge lighting up and
  // became a lamp behind the card, washing the corners out and taking
  // the picture with them.
  float rimLit = uHoverAmt * (edge * 0.26 + halo * 0.09);
  outCol += rimLit * vec3(0.55, 0.68, 1.0);
  // The rim spills past the pane, so it has to bring its own alpha with
  // it or a transparent gap would swallow the half that lands outside.
  alpha = clamp(max(alpha, rimLit * 2.2), 0.0, 1.0);

  // ── Where the tube stops ──
  // Not a fade to a colour: a fade to NOTHING. The page already has its
  // own backdrop running behind every section, so dissolving the alpha
  // hands the edges back to it, and the lattice melts into whatever sits
  // above and below instead of ending on a line. Sideways it does the
  // other job as well, reading as content carrying on past the frame.
  //
  // Premultiplied, because that is how a canvas composites with the page.
  // Everything but the focused pane sinks back into the ground.
  // Gone completely by the time it lands: at that zoom the neighbours are
  // giant fragments, and the film should have the room to itself.
  float sink = smoothstep(0.0, 0.85, away);
  outCol = mix(outCol, uBackground * uBgAlpha, sink);
  alpha = mix(alpha, uBgAlpha, sink);

  vec2 rim = abs(vUv * 2.0 - 1.0);
  float fade = (1.0 - smoothstep(1.0 - uEdge, 1.0, rim.x))
             * (1.0 - smoothstep(1.0 - uEdgeY, 1.0, rim.y));

  float a = alpha * fade;
  fragColor = vec4(outCol * a, a);
}
