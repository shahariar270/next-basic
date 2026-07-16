# Code Review — next-basic

**Date:** 2026-07-14
**Reviewer:** Claude
**Scope:** `app/` (App Router pages, layout, styles, config)
**Stack:** Next.js 16.2.10 · React 19 · Tailwind CSS v4 · React Compiler enabled

---

## Summary

Good progress — you've moved from hardcoded arrays to real `async` data fetching, and your dynamic route now correctly `await`s `params` (the Next 16 requirement). 

There is **1 real bug** (broken code in `app/page.js`), plus several correctness and best-practice issues worth fixing. Nothing here is catastrophic, and most are quick fixes.

| # | Severity | File | Issue |
|---|----------|------|-------|
| 1 | 🔴 Bug | `app/page.js` | `handleDelete` references `data` / `setData` that no longer exist |
| 2 | 🟠 Correctness | `app/blog/page.js` | `<Link>` nested inside `<button>` — invalid HTML |
| 3 | 🟠 Correctness | `app/blog/page.js` | `key={index}` instead of stable `item.id` |
| 4 | 🟠 Correctness | `app/blog/[id]/page.js` | Wrong metadata title (`"About"`) + dead placeholder code |
| 5 | 🟡 Robustness | both fetch pages | No error handling if the request fails / 404 |
| 6 | 🟡 Cleanup | `app/page.js` | Unused imports + unnecessary `"use client"` |
| 7 | 🟢 Polish | `app/blog/page.js` | `h-6` + `p-6` conflict; `<h1>` used for list items |

---

## 🔴 1. Broken code in `app/page.js`

```js
export default function Home() {
  const handleDelete = (id) => {
    setData(data.filter((project) => project.id !== id));  // ❌ data & setData don't exist
  };
  return (
    <div className="...">
      <Link href={'/blog'}>Blog page</Link>
    </div>
  );
}
```

When you removed the `useState`, you left `handleDelete` behind. It references `data` and `setData`, which no longer exist. It doesn't crash today only because nothing calls it — but it's dead code that *will* throw a `ReferenceError` the moment it's wired to a button.

**Fix:** delete `handleDelete` entirely. Once it's gone, `useState` and `Image` are unused too (see #6), and you no longer need `"use client"` — this can become a plain server component.

```js
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Link href="/blog">Blog page</Link>
    </div>
  );
}
```

---

## 🟠 2. `<Link>` inside `<button>` — invalid HTML (`app/blog/page.js`)

```jsx
<button>
  <Link href={`/blog/${item.id}`}>Read post</Link>
</button>
```

A `<button>` wrapping an `<a>` (which is what `<Link>` renders) is invalid HTML — you can't nest interactive elements. It causes hydration warnings and unpredictable click behavior.

**Fix:** use the `Link` on its own and style *it* like a button:

```jsx
<Link href={`/blog/${item.id}`} className="mt-2 underline">
  Read post
</Link>
```

---

## 🟠 3. Use a stable `key`, not the array index (`app/blog/page.js`)

```jsx
{post.map((item, index) => (
  <div key={index} ...>
```

`key={index}` breaks React's reconciliation if the list is ever reordered or filtered. Your items already have a unique `item.id` — use it:

```jsx
{post.map((item) => (
  <div key={item.id} ...>
```

---

## 🟠 4. Wrong metadata + dead placeholder code (`app/blog/[id]/page.js`)

Two things in this file:

**(a)** The metadata title is a copy-paste leftover:
```js
export const metadata = {
  title: { absolute: 'About | Portfolio Builder' },  // ❌ this is a blog post, not "About"
}
```
For a *dynamic* page, a static title means every post shows the same title. Prefer `generateMetadata` so each post gets its own:

```js
export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then(r => r.json());
  return { title: `${post.title} | Portfolio Builder` };
}
```

**(b)** The `blogPost` object and its comment are dead code — you build it but render `currentPost` instead. Delete lines 14–20:
```js
// Fetch the blog post data based on the ID
// This is a placeholder - replace with actual data fetching logic
const blogPost = { id, title: `Blog Post ${id}`, content: `...` };  // ❌ never used
```

---

## 🟡 5. No error handling on fetch (both pages)

```js
const data = await fetch('https://jsonplaceholder.typicode.com/posts');
const post = await data.json();
```

If the network fails or a bad `id` returns 404, `.json()` throws or `currentPost` is empty, and the page errors. Check `res.ok` and trigger a not-found when appropriate:

```js
import { notFound } from "next/navigation";

const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
if (!res.ok) notFound();
const currentPost = await res.json();
```

You can also add an `app/blog/[id]/not-found.js` and an `error.js` for friendly fallback UI.

---

## 🟡 6. Unused imports & unnecessary `"use client"` (`app/page.js`)

- `import Image from "next/image"` — never used.
- `import { useState } from "react"` — never used (after fixing #1).
- `"use client"` — not needed once there's no state or event handler. Server components are the default and are lighter.

Your linter (`eslint-config-next`) will flag the unused imports. Run `npm run lint`.

---

## 🟢 7. Styling / semantics polish (`app/blog/page.js`)

```jsx
<div className="bg-blue-700 flex-col h-6 w-fit p-6 flex ...">
  <h1>{item.title}</h1>
```

- **`h-6` + `p-6` fight each other** — a fixed `1.5rem` height with `1.5rem` padding squishes the content. Drop `h-6` and let it size naturally.
- **`<h1>` per list item** — every card renders an `<h1>`, so the page has ~100 top-level headings. Use `<h2>` (or `<h3>`) for list items and keep one `<h1>` as the page heading. Better for accessibility and SEO.

---

## What you're doing well ✅

- **`await params`** in the dynamic route — correct for Next 16, and a thing most tutorials get wrong.
- **Server-side `async` data fetching** — fetching directly in a server component is the idiomatic App Router pattern.
- **Correct dynamic segment folder** `app/blog/[id]/` and matching `href={`/blog/${item.id}`}` links.
- **`metadata` exports** present on your pages.

---

## Suggested next steps (in order)

1. Fix the bug in `page.js` (#1) — highest priority.
2. Fix the `<button><Link>` nesting and the `key` (#2, #3).
3. Clean up the dead code + metadata in `[id]/page.js` (#4).
4. Add `notFound()` handling and try an `error.js` / `loading.js` file (#5) — great next Next.js concept to learn.
5. Run `npm run lint` and clear any remaining warnings.
