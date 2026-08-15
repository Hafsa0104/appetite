/**
 * The top red delivery strip. Server component (no interactivity):
 * a panda-on-a-scooter scoots across on a CSS keyframe loop.
 * Motion is disabled automatically under prefers-reduced-motion
 * (handled in globals.css), and the strip is decorative so it's
 * hidden from assistive tech.
 */
export default function DeliveryBar() {
  return (
    <div
      aria-hidden="true"
      className="relative h-8 overflow-hidden bg-brand text-white"
    >
      <div className="flex h-full items-center justify-center px-4 text-center text-xs font-medium sm:text-sm">
        Free delivery on your first order — arriving hot in 30 minutes 🛵
      </div>
      {/* Decorative scooting mascot */}
      <span
        className="appetite-scoot pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 select-none text-base"
        role="presentation"
      >
        🐼
      </span>
    </div>
  );
}
