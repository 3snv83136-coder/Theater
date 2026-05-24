"use client";

import { useState } from "react";
import { useStore, useId } from "@/lib/store";
import { useToast } from "@/components/Toast";
import type { ContentPost } from "@/lib/types";

const CATEGORIES: ContentPost["category"][] = ["Actualité", "Spectacle", "Backstage", "Atelier"];

export default function ContentPage() {
  const { state, addPost, updatePost, removePost } = useStore();
  const toast = useToast();
  const newId = useId();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState(state.teachers[0]?.name ?? "");
  const [category, setCategory] = useState<ContentPost["category"]>("Actualité");
  const [cover, setCover] = useState("");

  const create = () => {
    if (!title.trim() || !body.trim()) {
      toast.push({ message: "Titre et corps requis.", tone: "error" });
      return;
    }
    const post: ContentPost = {
      id: newId(),
      title,
      excerpt: excerpt || body.slice(0, 140),
      body,
      author,
      category,
      cover: cover || undefined,
      published: false,
      createdAt: new Date().toISOString(),
    };
    addPost(post);
    toast.push({ message: "Article enregistré (brouillon).", tone: "success" });
    setTitle(""); setExcerpt(""); setBody(""); setCover("");
  };

  const publishedCount = state.posts.filter((p) => p.published).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
      <div className="space-y-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold">Création de contenu</h1>
              <p className="text-sm text-stage-400">
                Brouillonnez ici, publiez quand c'est prêt, et l'article apparaît sur le site public.
              </p>
            </div>
            <span className="chip">{publishedCount} publié(s)</span>
          </div>
        </div>

        <div className="card grid gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="label">Titre</label>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="label">Catégorie</label>
              <select
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value as ContentPost["category"])}
              >
                {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div>
              <label className="label">Auteur</label>
              <select className="input" value={author} onChange={(e) => setAuthor(e.target.value)}>
                {state.teachers.map((t) => (<option key={t.id} value={t.name}>{t.name}</option>))}
              </select>
            </div>
            <div>
              <label className="label">Image de couverture (URL)</label>
              <input className="input" value={cover} onChange={(e) => setCover(e.target.value)} placeholder="https://…" />
            </div>
          </div>
          <div>
            <label className="label">Chapô</label>
            <textarea
              className="input min-h-[60px]"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Corps (markdown supporté à la publication)</label>
            <textarea
              className="input min-h-[180px]"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <button className="btn-primary self-start" onClick={create}>
            💾 Enregistrer le brouillon
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="section-title text-xl">Bibliothèque</h2>
        <ul className="mt-4 divide-y divide-white/5">
          {state.posts.length === 0 && (
            <li className="py-6 text-center text-sm text-stage-400">
              Aucun article pour l'instant.
            </li>
          )}
          {state.posts.map((p) => (
            <li key={p.id} className="py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{p.title}</span>
                    <span className="chip">{p.category}</span>
                    {p.published ? (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-300">
                        en ligne
                      </span>
                    ) : (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-stage-300">
                        brouillon
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-stage-400">
                    par {p.author} · {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-stage-200">{p.excerpt}</p>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <button
                    className="btn-ghost"
                    onClick={() =>
                      updatePost(p.id, { published: !p.published })
                    }
                  >
                    {p.published ? "Dépublier" : "Publier"}
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => {
                      if (confirm("Supprimer cet article ?")) removePost(p.id);
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
