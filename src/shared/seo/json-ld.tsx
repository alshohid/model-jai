type JsonLdScriptProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

const stringifyJsonLd = (data: JsonLdScriptProps["data"]) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

export default function JsonLdScript({ data }: JsonLdScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: stringifyJsonLd(data),
      }}
    />
  );
}
