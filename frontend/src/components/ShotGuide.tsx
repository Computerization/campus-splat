import { useI18n } from '../i18n'

/**
 * Default shooting tips for the volunteer checkpoint page.
 *
 * The admin's per-checkpoint instructions are the specific ones; these are the
 * generic "how to shoot so the reconstruction actually works" rules that apply
 * everywhere (docs/training-pipeline.md §3.2). They also fill the page when a
 * checkpoint has no custom instructions yet.
 *
 * The figures are inline SVG on purpose: no image files to ship, they scale on
 * any phone, and they follow the theme colours.
 */
export function ShootingTips() {
  const { t } = useI18n()

  const tips = [
    {
      figure: <CorridorFigure />,
      caption: t('tips.corridor.caption'),
      title: t('tips.corridor.title'),
      body: t('tips.corridor.body'),
    },
    {
      figure: <DoorwayFigure />,
      caption: t('tips.doorway.caption'),
      title: t('tips.doorway.title'),
      body: t('tips.doorway.body'),
    },
    {
      figure: <StairsFigure />,
      caption: t('tips.stairs.caption'),
      title: t('tips.stairs.title'),
      body: t('tips.stairs.body'),
    },
    {
      figure: <SurfaceFigure />,
      caption: t('tips.surface.caption'),
      title: t('tips.surface.title'),
      body: t('tips.surface.body'),
    },
  ]

  return (
    <div className="shot-guide shot-tips">
      <h3>📐 {t('tips.title')}</h3>
      <ul className="tip-list">
        {tips.map((tip) => (
          <li key={tip.title} className="tip-item">
            <figure className="tip-figure">
              {tip.figure}
              <figcaption>{tip.caption}</figcaption>
            </figure>
            <div className="tip-text">
              <strong>{tip.title}</strong>
              <span>{tip.body}</span>
            </div>
          </li>
        ))}
      </ul>
      <ul className="tip-plain">
        <li>{t('tips.plain.exposure')}</li>
        <li>{t('tips.plain.glass')}</li>
      </ul>
    </div>
  )
}

/** Corridor: keep walking and shooting, neighbouring frames must overlap. */
function CorridorFigure() {
  return (
    <svg viewBox="0 0 240 100" aria-hidden="true">
      {/* corridor */}
      <rect className="floor" x="10" y="30" width="220" height="40" rx="4" />
      {/* what each shot covers */}
      <path className="cone" d="M45 50 L115 33 L115 67 Z" />
      <path className="cone" d="M100 50 L170 33 L170 67 Z" />
      <path className="cone" d="M155 50 L225 33 L225 67 Z" />
      {/* the overlap between neighbouring shots */}
      <rect className="overlap" x="100" y="33" width="15" height="34" rx="2" />
      <rect className="overlap" x="155" y="33" width="15" height="34" rx="2" />
      {/* camera positions, each with the direction it faces */}
      <circle className="cam" cx="45" cy="50" r="5" />
      <circle className="cam" cx="100" cy="50" r="5" />
      <circle className="cam" cx="155" cy="50" r="5" />
      <path className="aim" d="M52 50 L62 44 L62 56 Z" />
      <path className="aim" d="M107 50 L117 44 L117 56 Z" />
      <path className="aim" d="M162 50 L172 44 L172 56 Z" />
    </svg>
  )
}

/** Doorway: one shot from inside the room looking out into the corridor. */
function DoorwayFigure() {
  return (
    <svg viewBox="0 0 240 100" aria-hidden="true">
      {/* room and corridor */}
      <rect className="floor" x="10" y="16" width="116" height="68" rx="4" />
      <rect className="floor" x="150" y="16" width="64" height="68" rx="4" />
      {/* cut the doorway out of the wall, then draw its stubs and open leaf */}
      <path className="gap" d="M126 40 L126 62" />
      <path className="door" d="M126 32 L126 40" />
      <path className="door" d="M126 62 L126 70" />
      <path className="door" d="M126 40 L146 54" />
      {/* camera inside the room, aimed at the corridor */}
      <path className="cone" d="M98 51 L126 40 L126 62 Z" />
      <circle className="cam" cx="92" cy="51" r="5" />
      <path className="aim" d="M99 51 L109 45 L109 57 Z" />
      <path className="route" d="M132 51 L178 51" />
    </svg>
  )
}

/** Stairs: shoot both the floor below and the one above. */
function StairsFigure() {
  return (
    <svg viewBox="0 0 240 100" aria-hidden="true">
      <path className="slab" d="M16 30 L224 30" />
      <path className="slab" d="M16 82 L224 82" />
      {/* a stepped line reads as "stairs" far better than a diagonal */}
      <path className="stairs" d="M40 82 L40 69 L56 69 L56 56 L72 56 L72 43 L88 43 L88 30" />
      {/* two cameras, one per floor — kept apart so the two view cones
          don't merge into one blob in the middle */}
      <path className="cone" d="M132 36 L120 64 L164 64 Z" />
      <circle className="cam" cx="132" cy="30" r="5" />
      <path className="cone" d="M176 76 L164 48 L208 48 Z" />
      <circle className="cam" cx="176" cy="82" r="5" />
    </svg>
  )
}

/**
 * One camera, three aiming angles: a level lap only covers the middle of the
 * walls — the floor within a couple of metres of your feet and the whole
 * ceiling need their own shots (they also give the solver the horizontal
 * planes that keep the room from coming out warped).
 */
function SurfaceFigure() {
  return (
    <svg viewBox="0 0 240 100" aria-hidden="true">
      {/* ceiling and floor, seen from the side */}
      <path className="slab" d="M16 16 L224 16" />
      <path className="slab" d="M16 84 L224 84" />
      {/* level: walls */}
      <path className="cone" d="M56 50 L150 41 L150 59 Z" />
      {/* angled down: the floor */}
      <path className="cone-floor" d="M56 50 L146 62 L128 84 Z" />
      {/* angled up: the ceiling */}
      <path className="cone-ceil" d="M56 50 L146 38 L128 16 Z" />
      <circle className="cam" cx="56" cy="50" r="5" />
    </svg>
  )
}
