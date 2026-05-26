import { IG, LOGO, MAP_URL, WA } from "./config.js";

export const SITE_NAME = "Yashvi Imitation";
export const SITE_TAGLINE = "House of Antique Jewellery";
export const SITE_TITLE = "Yashvi Imitation | Bridal, Festive and Daily Wear Jewellery";
export const DEFAULT_META_DESCRIPTION =
  "Discover bridal, festive and daily wear imitation jewellery from Surat with pan-India delivery. Explore kundan, polki, temple jewellery, bangles, earrings and wedding-ready sets from Yashvi Imitation.";
export const BUSINESS_PHONE_DISPLAY = "+91 93285 82543";
export const BUSINESS_PHONE_LINK = `tel:+${WA}`;
export const BUSINESS_WHATSAPP_LINK = `https://wa.me/${WA}`;
export const BUSINESS_ADDRESS = "10, Akshardham Society, Mota Varachha, Surat, Gujarat 394101";
export const BUSINESS_CITY = "Surat";
export const BUSINESS_STATE = "Gujarat";
export const BUSINESS_COUNTRY = "India";
export const BUSINESS_PINCODE = "394101";

export const OCCASION_META = {
  daily: {
    label: "Daily Wear Jewellery",
    shortLabel: "Daily Wear",
    description: "Lightweight daily wear jewellery designs for everyday elegance, gifting and effortless styling.",
  },
  festive: {
    label: "Festive Jewellery",
    shortLabel: "Festive",
    description: "Festive imitation jewellery with kundan, polki and statement designs for celebrations and family occasions.",
  },
  wedding: {
    label: "Bridal Jewellery",
    shortLabel: "Wedding",
    description: "Bridal and wedding-ready imitation jewellery sets curated for engagement, wedding and reception looks.",
  },
};

export function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getSiteUrl() {
  const explicitSiteUrl = import.meta.env.VITE_SITE_URL?.trim();
  if (explicitSiteUrl) return explicitSiteUrl.replace(/\/+$/, "");
  if (typeof window !== "undefined") return window.location.origin.replace(/\/+$/, "");
  return "";
}

export function toAbsoluteUrl(path = "/") {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${cleanPath}`;
}

export function getCategoryPath(slug) {
  return `/category/${slug}`;
}

export function getOccasionPath(occasion) {
  return `/occasion/${occasion}`;
}

export function getProductSlug(product) {
  return slugify(product?.name || `product-${product?.id || "item"}`) || "product";
}

export function getProductPath(product) {
  return `/product/${product.id}/${getProductSlug(product)}`;
}

export function buildProductEnquiryMessage(product) {
  const lines = [
    `Hi! I am interested in "${product.name}" priced at Rs. ${product.price}. Is it available?`,
    product.categories?.name ? `Category: ${product.categories.name}` : null,
    product.occasion ? `Occasion: ${OCCASION_META[product.occasion]?.shortLabel || product.occasion}` : null,
    product.image_url ? `Photo: ${product.image_url}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}

export function buildWhatsAppLink(message) {
  return `${BUSINESS_WHATSAPP_LINK}?text=${encodeURIComponent(message)}`;
}

export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: SITE_NAME,
    description: DEFAULT_META_DESCRIPTION,
    image: toAbsoluteUrl(LOGO),
    url: toAbsoluteUrl("/"),
    telephone: BUSINESS_PHONE_DISPLAY,
    address: {
      "@type": "PostalAddress",
      streetAddress: "10, Akshardham Society, Mota Varachha",
      addressLocality: BUSINESS_CITY,
      addressRegion: BUSINESS_STATE,
      postalCode: BUSINESS_PINCODE,
      addressCountry: "IN",
    },
    areaServed: [
      { "@type": "City", name: BUSINESS_CITY },
      { "@type": "Country", name: BUSINESS_COUNTRY },
    ],
    sameAs: [IG, MAP_URL],
  };
}
