const generatedPropertyImages: Record<string, string> = {
  "aerocity-courtyard-residence": "/assets/properties/aerocity-courtyard-residence.png",
  "canal-view-residences": "/assets/properties/canal-view-residences.png",
  "airport-district-offices": "/assets/properties/airport-district-offices.png",
};

export function propertyImageFor(property: { slug?: string; imageUrl?: string | null }) {
  return property.imageUrl || generatedPropertyImages[property.slug || ""] || "";
}
