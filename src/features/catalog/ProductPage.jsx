import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Seo from "../../components/seo/Seo.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import { trackLead } from "../../lib/analytics.js";
import { db } from "../../lib/supabase/client.js";
import { PRODUCT_SELECT } from "../../lib/supabase/queries.js";
import {
  BUSINESS_CITY,
  BUSINESS_PHONE_DISPLAY,
  DEFAULT_META_DESCRIPTION,
  OCCASION_META,
  buildLocalBusinessSchema,
  buildProductEnquiryMessage,
  buildWhatsAppLink,
  getCategoryPath,
  getOccasionPath,
  getProductPath,
  toAbsoluteUrl,
} from "../../lib/site.js";
import ProductCard from "./ProductCard.jsx";

function buildProductSchema(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || DEFAULT_META_DESCRIPTION,
    image: product.image_url ? [product.image_url] : undefined,
    category: product.categories?.name,
    url: toAbsoluteUrl(getProductPath(product)),
    brand: {
      "@type": "Brand",
      name: "Yashvi Imitation",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.is_sold_out ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      url: toAbsoluteUrl(getProductPath(product)),
    },
  };
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      const { data } = await db.from("products").select(PRODUCT_SELECT).eq("id", id).maybeSingle();
      if (!active) return;

      setProduct(data || null);

      if (data?.category_id) {
        const { data: more } = await db
          .from("products")
          .select(PRODUCT_SELECT)
          .eq("category_id", data.category_id)
          .neq("id", data.id)
          .limit(4);

        if (active) setRelated(more || []);
      } else if (active) {
        setRelated([]);
      }

      if (active) setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [id]);

  const productSchema = useMemo(() => {
    if (!product) return null;
    return [buildLocalBusinessSchema(), buildProductSchema(product)];
  }, [product]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: 100, display: "flex", justifyContent: "center" }}>
        <Spinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: 100 }}>
        <Seo title="Product Not Found" description="The requested jewellery product could not be found." path={typeof window !== "undefined" ? window.location.pathname : "/product"} noindex />
        <div className="page-shell" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem 80px" }}>
          <div style={{ textAlign: "center", padding: "72px 0" }}>
            <p style={{ fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 12 }}>Product Unavailable</p>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 42, color: "var(--text)", marginBottom: 12 }}>This design is no longer available.</h1>
            <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>Browse more bridal, festive and daily wear jewellery from our collection.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/collection" className="btn-primary" style={{ padding: "12px 24px", borderRadius: 8 }}>
                Browse Collection
              </Link>
              <a href={buildWhatsAppLink("Hi! I could not find a product link and would like help choosing jewellery.")} target="_blank" rel="noopener" className="btn-outline" style={{ padding: "12px 24px", borderRadius: 8 }}>
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const productDescription = product.description
    || `${product.name} from Yashvi Imitation in ${BUSINESS_CITY}. Enquire on WhatsApp for bridal, festive and daily wear styling support and pan-India delivery.`;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: 88 }}>
      <Seo title={product.name} description={productDescription} path={getProductPath(product)} image={product.image_url} schema={productSchema} />
      <div className="page-shell" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem 72px" }}>
        <nav style={{ display: "flex", gap: 8, flexWrap: "wrap", fontSize: 12, color: "var(--text-muted)", marginBottom: 24 }}>
          <Link to="/" style={{ color: "inherit" }}>Home</Link>
          <span>/</span>
          <Link to="/collection" style={{ color: "inherit" }}>Collection</Link>
          {product.categories?.slug ? (
            <>
              <span>/</span>
              <Link to={getCategoryPath(product.categories.slug)} style={{ color: "inherit" }}>{product.categories.name}</Link>
            </>
          ) : null}
        </nav>

        <div className="product-page-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)", gap: 28 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 18, overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ aspectRatio: "1 / 1", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                Image unavailable
              </div>
            )}
          </div>

          <div>
            <p style={{ fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 12 }}>
              {product.categories?.name || "Jewellery"} {product.is_new ? "· New Arrival" : ""}
            </p>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(34px,5vw,52px)", lineHeight: 1.08, color: "var(--text)", marginBottom: 10 }}>
              {product.name}
            </h1>
            <p style={{ fontSize: 28, color: "var(--text)", marginBottom: 14, fontFamily: "'Playfair Display',serif" }}>
              Rs. {Number(product.price).toLocaleString("en-IN")}
            </p>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.75, marginBottom: 22 }}>
              {productDescription}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 22 }}>
              {product.occasion ? (
                <Link to={getOccasionPath(product.occasion)} className="btn-outline" style={{ padding: "9px 16px", borderRadius: 999 }}>
                  {OCCASION_META[product.occasion]?.label || product.occasion}
                </Link>
              ) : null}
              {product.categories?.slug ? (
                <Link to={getCategoryPath(product.categories.slug)} className="btn-outline" style={{ padding: "9px 16px", borderRadius: 999 }}>
                  More {product.categories.name}
                </Link>
              ) : null}
            </div>

            <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 18px" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Local and Pan-India support</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>
                  Visit our {BUSINESS_CITY} jewellery studio or enquire on WhatsApp for delivery support across India.
                </p>
              </div>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 18px" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Quick buying help</p>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>
                  Need matching bangles, earrings or bridal styling? Mention your occasion and our team will guide you quickly.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
              {!product.is_sold_out ? (
                <a
                  href={buildWhatsAppLink(buildProductEnquiryMessage(product))}
                  target="_blank"
                  rel="noopener"
                  className="btn-primary"
                  style={{ padding: "13px 22px", borderRadius: 10 }}
                  onClick={() => trackLead("whatsapp", { placement: "product_page", product_id: String(product.id), product_name: product.name })}
                >
                  Enquire on WhatsApp
                </a>
              ) : (
                <span className="btn-outline" style={{ padding: "13px 22px", borderRadius: 10, display: "inline-flex", alignItems: "center" }}>
                  Currently Sold Out
                </span>
              )}
              <a href="tel:+919328582543" className="btn-outline" style={{ padding: "13px 22px", borderRadius: 10 }} onClick={() => trackLead("call", { placement: "product_page" })}>
                Call {BUSINESS_PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>

        {related.length > 0 ? (
          <section style={{ marginTop: 60 }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
              <div>
                <p style={{ fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 6 }}>You May Also Like</p>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, color: "var(--text)" }}>Similar designs</h2>
              </div>
              {product.categories?.slug ? (
                <Link to={getCategoryPath(product.categories.slug)} style={{ color: "var(--pink)", fontSize: 13 }}>
                  View all {product.categories.name}
                </Link>
              ) : null}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }} className="stagger">
              {related.map((item, index) => (
                <ProductCard key={item.id} product={item} delay={index * 0.04} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
