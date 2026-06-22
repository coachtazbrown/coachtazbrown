/**
 * Renders one or more JSON-LD structured-data blocks.
 * Server component — the script ships in the initial HTML so crawlers see it.
 */
export default function JsonLd({
  data
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
