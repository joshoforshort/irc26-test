export default function PublishingSchedule() {
  return (
    <section
      className="
        mx-auto max-w-3xl
        bg-green-100/80 backdrop-blur-sm
        rounded-3xl shadow-2xl
        border border-black/5
        px-6 sm:px-8 py-8
      "
      aria-labelledby="publishing-schedule-heading"
    >
      <div className="mx-auto max-w-[70ch]">
        <h2
          id="publishing-schedule-heading"
          className="font-lovely text-2xl sm:text-3xl text-center mb-2"
        >
          HOW DO I GET INVOLVED?
        </h2>

        <p className="text-center text-[14px] leading-6 mb-4">
          We need as many CO's around Australia to hide<br />
          fp worthy caches!
        </p>

        {/* 1. Pledge */}
        <div className="mt-4">
          <p className="font-lovely text-xl sm:text-2xl leading-tight mb-1">
            1. PLEDGE:
          </p>
          <p className="text-[14px] leading-6">
            Let us know you are planning to hide via the PLEDGE HIDES button on the home
            page or button on the top right of this website.
          </p>
        </div>

        {/* 2. Prepare */}
        <div className="mt-5">
          <p className="font-lovely text-xl sm:text-2xl leading-tight mb-1">
            2. PREPARE:
          </p>
          <p className="text-[14px] leading-6">
            Follow the standard geocaching hide guidelines. Create, hide and submit your
            caches to your reviewer as you normally would. Hides can be of any theme.
          </p>
        </div>

        {/* IRC26 Artwork */}
        <div className="mt-5">
          <p className="font-lovely text-xl sm:text-2xl leading-tight mb-1" style={{ color: '#69bc45' }}>
            IRC26 ARTWORK:
          </p>
          <p className="text-[14px] leading-6">
            Download artwork for your cache page: <a href="/IRC26Banner.jpg" download className="text-[#69bc45] hover:underline">IRC26 Banner</a> | <a href="/IRC Circle.PNG" download className="text-[#69bc45] hover:underline">IRC26 Heart</a>
          </p>
        </div>

        {/* IMPORTANT */}
        <div className="mt-6">
          <p className="font-lovely text-xl sm:text-2xl leading-tight mb-1" style={{ color: '#69bc45' }}>
            IMPORTANT:
          </p>
          <p className="text-[14px] leading-6">
            You MUST include a publishing time as a note for each cache submission so your
            reviewer knows when to publish for IRC26.
          </p>
        </div>

        {/* Region times */}
        <div className="mt-6 space-y-1 text-center">
          <p className="font-semibold text-[14px] leading-6">
            NSW / ACT / VIC / TAS: PUBLISH - 14 FEB 2026 at 9AM
          </p>
          <p className="font-semibold text-[14px] leading-6">
            QLD: PUBLISH - 14 FEB at 8AM
          </p>
          <p className="font-semibold text-[14px] leading-6">
            WA: PUBLISH - 14 FEB 2026 at 6AM
          </p>
          <p className="font-semibold text-[14px] leading-6">
            SA: PUBLISH - 14 FEB 2026 at 8:30AM
          </p>
        </div>

        {/* Submissions close */}
        <div className="mt-6 text-center">
          <p className="font-lovely text-2xl sm:text-3xl">
            SUBMISSIONS CLOSE: 31 JAN 2026 AT 6PM
          </p>
        </div>
      </div>
    </section>
  );
}

