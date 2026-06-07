import Link from "next/link";
import type { IMatch } from "@/types/match/MatchManagementTypes";
import type { INews } from "@/types/settings/news/newsManagementTypes";
import type { IGameCategoryData } from "@/types/game/gamecategory/gameCategorytypes";

type HomeSeoContentProps = {
  matches: IMatch[];
  newsItems: INews[];
  categories: IGameCategoryData[];
};

const getMatchLabel = (match: IMatch) => {
  const playerOne = match.player_one?.name?.trim() || "Player One";
  const playerTwo = match.player_two?.name?.trim() || "Player Two";

  return `${playerOne} vs ${playerTwo}`;
};

export default function HomeSeoContent({
  matches,
  newsItems,
  categories,
}: HomeSeoContentProps) {
  const categorySummary = categories.length
    ? categories
        .slice(0, 6)
        .map((category) => category.name)
        .join(", ")
    : "Fighting games, featured tournaments, live-stream matchups, and supporter-focused competition.";

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_45%),linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(255,255,255,0.01))]">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.25fr,0.75fr] lg:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/55">
              Model Boss Offers
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-white md:text-4xl">
              Live gaming tournaments, supporter battles, and featured match updates in one place.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 md:text-base">
              Model Boss Offers brings together live 1v1 gaming tournaments, real-time match
              support, and community-driven competition for players and supporters who want more
              than passive viewing. Watch streams, follow featured battles, and track the momentum
              of every match from a single platform.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 md:text-base">
              Browse active categories, discover featured updates, and jump straight into live
              tournament action or the point store when you are ready to support your next player.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/live-stream"
                className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/15"
              >
                Watch live tournaments
              </Link>
              <Link
                href="/point-store"
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10"
              >
                Visit the point store
              </Link>
            </div>

            {matches.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white">Featured live-stream matchups</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {matches.slice(0, 4).map((match) => (
                    <Link
                      key={match.id}
                      href={`/live-stream/match/${match.id}`}
                      className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-sm text-white/85 transition hover:border-white/20 hover:bg-black/35"
                    >
                      <p className="font-medium text-white">{getMatchLabel(match)}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/45">
                        {match.game?.name || "Featured match"} • {match.type}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <article className="rounded-3xl border border-white/10 bg-black/25 p-5">
              <h3 className="text-lg font-semibold text-white">Browse featured categories</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">{categorySummary}</p>
            </article>

            <article className="rounded-3xl border border-white/10 bg-black/25 p-5">
              <h3 className="text-lg font-semibold text-white">Fresh updates from the platform</h3>
              {newsItems.length > 0 ? (
                <ul className="mt-3 space-y-3 text-sm leading-6 text-white/70">
                  {newsItems.slice(0, 3).map((newsItem) => (
                    <li key={newsItem.id}>{newsItem.title}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm leading-7 text-white/70">
                  Catch up on featured platform updates, live match highlights, and new tournament
                  activity as it happens.
                </p>
              )}
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

