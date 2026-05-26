import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Seo from "../../components/seo/Seo.jsx";
import { SearchIcon } from "../../components/icons/index.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import { db } from "../../lib/supabase/client.js";
import { CATEGORY_SELECT, PRODUCT_SELECT } from "../../lib/supabase/queries.js";
import {
  BUSINESS_CITY,
  OCCASION_META,
  buildLocalBusinessSchema,
  buildWhatsAppLink,
  getCategoryPath,
  getOccasionPath,
  getProductPath,
  toAbsoluteUrl,
} from "../../lib/site.js";
import CatBar from "./CatBar.jsx";
import ProductCard from "./ProductCard.jsx";

function buildCollectionSchema(products, pagePath) {
  return [
    buildLocalBusinessSchema(),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      url: toAbsoluteUrl(pagePath),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: products.slice(0, 12).map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: toAbsoluteUrl(getProductPath(product)),
          name: product.name,
        })),
      },
    },
  ];
}

export default function CollectionPage() {
  const { occasion, slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get("q") || "";

  useEffect(() => {
    (async () => {
      const [{ data: c }, { data: p }] = await Promise.all([
        db.from("categories").select(CATEGORY_SELECT).order("name"),
        db.from("products").select(PRODUCT_SELECT).order("created_at", { ascending: false }),
      ]);

      setCats(c || []);
      setProducts(p || []);
      setLoading(false);
    })();
  }, []);

  const selectedCategory = cats.find((category) => category.slug === slug);
  const selectedOccasion = occasion ? OCCASION_META[occasion] : null;

  const filtered = useMemo(() => {
    let list = products;

    if (slug) {
      list = list.filter((product) => product.categories?.slug === slug);
    }

    if (occasion) {
      list = list.filter((product) => product.occasion === occasion);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      list = list.filter((product) => product.name.toLowerCase().includes(query) || product.description?.toLowerCase().includes(query));
    }

    return list;
  }, [occasion, products, search, slug]);

  const pagePath = slug ? getCategoryPath(slug) : occasion ? getOccasionPath(occasion) : "/collection";
  const pageTitle = selectedCategory
    ? `${selectedCategory.name} Jewellery Collection`
    : selectedOccasion
      ? `${selectedOccasion.label} in ${BUSINESS_CITY}`
      : "Imitation Jewellery Collection";
  const pageDescription = selectedCategory
    ? `Explore ${selectedCategory.name.toLowerCase()} designs from Yashvi Imitation in ${BUSINESS_CITY}. Enquire on WhatsApp for bridal, festive and daily wear jewellery with pan-India delivery support.`
    : selectedOccasion
      ? `${selectedOccasion.description} Discover curated imitation jewellery from Yashvi Imitation in ${BUSINESS_CITY} with quick WhatsApp ordering and pan-India delivery.`
      : `Browse imitation jewellery from Yashvi Imitation in ${BUSINESS_CITY}, including bridal sets, festive jewellery, kundan, polki, bangles, earrings and daily wear designs.`;

  const collectionSchema = useMemo(() => buildCollectionSchema(filtered, pagePath), [filtered, pagePath]);

  const updateSearch = (value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) nextParams.set("q", value);
    else nextParams.delete("q");
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: 68 }}>
      <Seo title={pageTitle} description={pageDescription} path={pagePath} schema={collectionSchema} />
      <div className="page-shell" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
        <div className="collection-header" style={{ padding: "48px 0 32px", borderBottom: "1px solid var(--border)", marginBottom: 32 }}>
          <p style={{ fontSize: 11, letterSpacing: ".22em", color: "var(--pink)", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>
            {selectedOccasion ? "Occasion Edit" : selectedCategory ? "Category Collection" : "Browse"}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 48, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>{pageTitle}</h1>
              <p style={{ maxWidth: 720, color: "var(--text-muted)", lineHeight: 1.7 }}>{pageDescription}</p>
            </div>
            <div className="collection-search-wrap" style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search designs..."
                value={search}
                onChange={(e) => updateSearch(e.target.value)}
                className="fi collection-search-input"
                style={{
                  paddingLeft: 36,
                  paddingRight: 16,
                  paddingTop: 10,
                  paddingBottom: 10,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  fontSize: 13,
                  width: 260,
                  fontFamily: "'DM Sans',sans-serif",
                  borderRadius: 8,
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {Object.entries(OCCASION_META).map(([key, value]) => (
            <Link
              key={key}
              to={getOccasionPath(key)}
              className={occasion === key ? "tab-a" : "tab-i"}
              style={{ padding: "8px 16px", borderBottomWidth: 1, borderBottomStyle: "solid", textDecoration: "none" }}
            >
              {value.shortLabel}
            </Link>
          ))}
          <Link to="/collection" className={!occasion && !slug ? "tab-a" : "tab-i"} style={{ padding: "8px 16px", borderBottomWidth: 1, borderBottomStyle: "solid", textDecoration: "none" }}>
            All Designs
          </Link>
        </div>

        <div style={{ marginBottom: 32 }}>
          <CatBar
            cats={cats}
            active={slug || "all"}
            buildHref={(nextSlug) => (nextSlug === "all" ? "/collection" : getCategoryPath(nextSlug))}
          />
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>💎</div>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: "var(--text)", marginBottom: 6 }}>No pieces found</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 18 }}>Try a different category, occasion or search term.</p>
            <a href={buildWhatsAppLink("Hi! Please help me with jewellery suggestions for my occasion.")} target="_blank" rel="noopener" className="btn-primary" style={{ padding: "12px 22px", borderRadius: 8 }}>
              Get WhatsApp Help
            </a>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 20, fontFamily: "'DM Sans',sans-serif" }}>
              {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20, paddingBottom: 60 }} className="stagger">
              {filtered.map((product, index) => (
                <ProductCard key={product.id} product={product} delay={index * 0.05} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
