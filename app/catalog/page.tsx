// app/catalog/page.tsx
async function getCatalog() {
  const baseUrl = process.env.APP_BASE_URL || '';
  const r = await fetch(`${baseUrl}/api/catalog`, { cache: 'no-store' });
  if (!r.ok) throw new Error(`Catalog fetch failed: ${r.status}`);
  return r.json();
}

export default async function CatalogPage() {
  const json = await getCatalog();
  const items = json?.items || [];
  return (
    <main className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.length === 0 && (
        <div className="col-span-full opacity-70">Каталог пуст (нет available &gt; 0).</div>
      )}
      {items.map((it: any) => (
        <div key={it.external_gift_id} className="rounded-2xl p-3 border border-white/10">
          {it.image_url ? (
            <img src={it.image_url} alt={it.title} className="w-full h-48 object-cover rounded-xl" />
          ) : null}
          <div className="mt-2 font-semibold">{it.title}</div>
          <div className="text-sm opacity-70">Rarity: {it.rarity || '—'}</div>
          <div className="text-sm opacity-70">Вес: {it.weight || 1}</div>
          <div className="text-sm">Доступно: {it.available}</div>
        </div>
      ))}
    </main>
  );
}
