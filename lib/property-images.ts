const generatedPropertyImages: Record<string, string> = {
  "aerocity-courtyard-residence": "/assets/properties/aerocity-courtyard-residence.webp",
  "canal-view-residences": "/assets/properties/canal-view-residences.webp",
  "airport-district-offices": "/assets/properties/airport-district-offices.webp",
};

export function propertyImageFor(property: { slug?: string; imageUrl?: string | null }) {
  return property.imageUrl || generatedPropertyImages[property.slug || ""] || "";
}
