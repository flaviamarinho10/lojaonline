import { GitBranch } from 'lucide-react';

export default function AchievementCard() {
  return (
    <section className="flex justify-center px-4 py-8 md:py-10">
      <div className="w-full max-w-[520px] overflow-hidden rounded-[28px] border border-white/10 bg-[#070b12] shadow-[0_28px_80px_rgba(3,7,18,0.55)]">
        <div className="relative h-52 overflow-hidden bg-[radial-gradient(circle_at_center,_#0d64ff_0%,_#0d4dc8_28%,_#0b2f8d_62%,_#071f5b_100%)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(255,255,255,0.4),_transparent_32%)]" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-white/90 bg-white/5 shadow-[0_0_32px_rgba(255,255,255,0.28)]">
            <div className="relative h-full w-full">
              <div className="absolute left-1/2 top-5 h-12 w-16 -translate-x-1/2 rounded-[50%_50%_40%_40%] bg-[#cdeefe]" />
              <div className="absolute left-1/2 top-10 h-16 w-24 -translate-x-1/2 rounded-[48%_48%_55%_55%] bg-[#dff6ff]" />

              <div className="absolute left-9 top-14 h-4 w-5 rounded-full bg-[#dff6ff] rotate-[-24deg]" />
              <div className="absolute right-9 top-14 h-4 w-5 rounded-full bg-[#dff6ff] rotate-[24deg]" />

              <div className="absolute left-6 top-14 h-2.5 w-2.5 rounded-full bg-[#0f2d6f] ring-2 ring-white/80" />
              <div className="absolute right-6 top-14 h-2.5 w-2.5 rounded-full bg-[#0f2d6f] ring-2 ring-white/80" />

              <div className="absolute left-1/2 top-16 h-3 w-10 -translate-x-1/2 rounded-full bg-[#bfe7ff] opacity-90" />

              <div className="absolute left-1/2 bottom-7 h-8 w-14 -translate-x-1/2 rounded-[50%_50%_45%_45%] bg-white/90" />
              <div className="absolute left-1/2 bottom-9 h-0.5 w-10 -translate-x-1/2 rounded-full bg-[#8cc9ff] opacity-80" />

              <div className="absolute left-1/2 top-9 h-14 w-18 -translate-x-1/2 rounded-[45%_45%_50%_50%] border border-sky-200/60" />

              <div className="absolute left-[18%] top-[36%] h-3 w-10 rounded-full bg-[#cfeeff] rotate-[-24deg]" />
              <div className="absolute right-[18%] top-[36%] h-3 w-10 rounded-full bg-[#cfeeff] rotate-[24deg]" />

              <div className="absolute bottom-[18%] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#fff]" />
            </div>
          </div>
        </div>

        <div className="bg-[#0b0f14] px-6 pb-5 pt-6">
          <h3 className="text-[2.2rem] font-black tracking-[-0.06em] text-white leading-none">Pull Shark</h3>
          <p className="mt-3 max-w-[430px] text-[1.05rem] font-medium leading-relaxed text-zinc-200">
            @pedrogamadev opened pull requests that have been merged.
          </p>
        </div>

        <div className="border-t border-white/10 bg-[#0b0f14] px-6 pb-7 pt-5">
          <h4 className="mb-5 text-2xl font-bold text-white">History</h4>

          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-zinc-200">
              <GitBranch size={18} strokeWidth={2} />
            </div>

            <div className="space-y-1.5">
              <p className="text-[1.02rem] font-medium text-white">Unlocked on Nov 4, 2025</p>
              <div className="flex items-center gap-2 text-[0.96rem] text-zinc-400">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-300 shadow-[0_0_14px_rgba(125,211,252,0.7)]" />
                inactive • 2nd pull request merged
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
