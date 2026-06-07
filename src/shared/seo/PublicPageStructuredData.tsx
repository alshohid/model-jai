import JsonLdScript from "./json-ld";
import {
  createBreadcrumbJsonLd,
  createCollectionPageJsonLd,
  type BreadcrumbItem,
} from "./structured-data";

type PublicPageStructuredDataProps = {
  path: string;
  name: string;
  description: string;
  about: string[];
  breadcrumbs?: BreadcrumbItem[];
};

export default function PublicPageStructuredData({
  path,
  name,
  description,
  about,
  breadcrumbs,
}: PublicPageStructuredDataProps) {
  const breadcrumbItems = breadcrumbs ?? [
    { name: "Home", path: "/" },
    { name, path },
  ];

  return (
    <JsonLdScript
      data={[
        createCollectionPageJsonLd({
          path,
          name,
          description,
          about,
        }),
        createBreadcrumbJsonLd(breadcrumbItems),
      ]}
    />
  );
}
