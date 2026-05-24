"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";

export default function PublicSitePage() {
  const { state } = useStore();
  const published = state.posts.filter((p) => p.published);
  const upcomingShows = state.shows
    .filter((s) => new Date(s.date) >= new Date())
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));

  return (
    <div className="space-y-10">
      <div className="card">
        <div className="text-xs uppercase tracking-widest text-stage-400">
          Aperçu du site public
        </div>
        <h1 className="mt-1 font-display text-3xl font-bold">impro2pro.fr</h1>
        <p className="mt-1 text-sm text-stage-400">
          Ce que voient les visiteurs du site internet. Seuls les articles
          publiés sont visibles ici.
        </p>
      </div>

      {upcomingShows.length > 0 && (
        <section>
          <h2 className="section-title">À l'affiche</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingShows.map((s) => (
              <div key={s.id} className="card card-hover">
                <div className="text-xs uppercase tracking-widest text-scene-300">
                  {new Date(s.date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                  })}{" "}
                  · {s.venue}
                </div>
                <h3 className="mt-1 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-stage-200">{s.pitch}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="section-title">Articles & actualités</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {published.length === 0 && (
            <div className="card text-stage-300">
              Rien de publié. Allez dans <Link href="/contenu" className="text-scene-300 underline">/contenu</Link> pour publier un article.
            </div>
          )}
          {published.map((p) => (
            <article key={p.id} className="card card-hover">
              <div className="flex items-center justify-between">
                <span className="chip">{p.category}</span>
                <span className="text-xs text-stage-400">
                  {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold">{p.title}</h3>
              <p className="mt-1 text-xs text-stage-400">par {p.author}</p>
              <p className="mt-3 text-stage-200">{p.excerpt}</p>
              <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-stage-900/40 p-3 text-sm text-stage-200 ring-1 ring-white/5">
                {p.body}
              </pre>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
