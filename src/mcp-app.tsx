/**
 * @file E-commerce Product Catalog - Tira Beauty Store Demo
 */
import {
  App,
  applyDocumentTheme,
  applyHostFonts,
  applyHostStyleVariables,
  type McpUiHostContext,
} from "@modelcontextprotocol/ext-apps";
import { useEffect, useState } from "preact/hooks";
import { render } from "preact";

// Hardcoded products from Tira catalog
const PRODUCTS = [
  {
    id: 1,
    title: "Essence Long Lasting Lipstick - 02 Just Perfect",
    vendor: "Essence",
    price: 340,
    comparePrice: 398,
    image: "https://mcp-ui-test-production.up.railway.app/public/images/product-1-essence-lipstick.jpg",
    description: "Premium quality lipstick product for everyday use. Perfect for all skin types.",
    category: "Lipstick"
  },
  {
    id: 2,
    title: "Lakme 9 To 5 Matte To Glass Liquid Lip Color - Passion Pink",
    vendor: "Lakme",
    price: 650,
    comparePrice: 748,
    image: "https://mcp-ui-test-production.up.railway.app/public/images/product-2-lakme-lipcolor.jpg",
    description: "Matte to glass finish liquid lip color. Long-lasting formula for all-day wear.",
    category: "Lipstick"
  },
  {
    id: 3,
    title: "Typsy Beauty Drink & Blink Curling Mascara - Black",
    vendor: "Typsy Beauty",
    price: 899,
    comparePrice: 1090,
    image: "https://mcp-ui-test-production.up.railway.app/public/images/product-3-typsy-mascara.jpg",
    description: "Professional curling mascara for dramatic lashes. Smudge-proof formula.",
    category: "Mascara"
  },
  {
    id: 4,
    title: "Minimalist SPF 60 PA++++ Sunscreen With Antioxidant Silymarin",
    vendor: "Minimalist",
    price: 500,
    comparePrice: 622,
    image: "https://mcp-ui-test-production.up.railway.app/public/images/product-4-minimalist-sunscreen.jpg",
    description: "High protection sunscreen with antioxidants. Perfect for daily sun protection.",
    category: "Sunscreen"
  },
  {
    id: 5,
    title: "Essence The Brown Edition Eyeshadow Palette - 30",
    vendor: "Essence",
    price: 580,
    comparePrice: 711,
    image: "https://mcp-ui-test-production.up.railway.app/public/images/product-5-essence-eyeshadow.jpg",
    description: "30 stunning brown shades eyeshadow palette. Create endless eye looks.",
    category: "Eye Shadow"
  }
];

function ProductStore() {
  const [app, setApp] = useState<App | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [hostContext, setHostContext] = useState<McpUiHostContext | undefined>();

  useEffect(() => {
    if (hostContext?.theme) {
      applyDocumentTheme(hostContext.theme);
    }
    if (hostContext?.styles?.variables) {
      applyHostStyleVariables(hostContext.styles.variables);
    }
    if (hostContext?.styles?.css?.fonts) {
      applyHostFonts(hostContext.styles.css.fonts);
    }
  }, [hostContext]);

  useEffect(() => {
    const instance = new App({ name: "Tira Beauty Store", version: "1.0.0" });
    instance.onerror = console.error;
    instance.onhostcontextchanged = (params) => {
      setHostContext((prev) => ({ ...prev, ...params }));
    };

    instance
      .connect()
      .then(() => {
        setApp(instance);
        setHostContext(instance.getHostContext());
      })
      .catch(setError);
  }, []);

  if (error) return <div style={{ padding: "20px", color: "red" }}><strong>ERROR:</strong> {error.message}</div>;
  if (!app) return <div style={{ padding: "20px" }}>Loading store...</div>;

  return <ProductCatalog hostContext={hostContext} />;
}

interface ProductCatalogProps {
  hostContext?: McpUiHostContext;
}

function ProductCatalog({ hostContext }: ProductCatalogProps) {
  const calculateDiscount = (price: number, comparePrice: number) => {
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  };

  return (
    <>
      <style>{`
        /* Custom scrollbar styling */
        main::-webkit-scrollbar {
          height: 8px;
        }
        main::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 4px;
          margin: 0 16px;
        }
        main::-webkit-scrollbar-thumb {
          background: #d4d4d4;
          border-radius: 4px;
        }
        main::-webkit-scrollbar-thumb:hover {
          background: #a3a3a3;
        }
        /* Smooth scrolling */
        main {
          scroll-behavior: smooth;
        }
      `}</style>
      <div
        style={{
          background: "transparent",
          paddingTop: hostContext?.safeAreaInsets?.top,
          paddingRight: hostContext?.safeAreaInsets?.right,
          paddingBottom: hostContext?.safeAreaInsets?.bottom,
          paddingLeft: hostContext?.safeAreaInsets?.left,
        }}
      >
      {/* Header */}
      <header style={{
        background: "transparent",
        color: "#2c2c2c",
        padding: "20px 16px 16px",
        borderBottom: "1px solid #e5e5e5"
      }}>
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>Tira Beauty Store</h1>
        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#666" }}>Scroll to browse products →</p>
      </header>

      {/* Products Horizontal Scroll */}
      <main style={{
        position: "relative",
        padding: "20px 0",
        overflowX: "auto",
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch"
      }}>
        {/* Scroll hint gradient */}
        <div style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "40px",
          background: "linear-gradient(to right, transparent, rgba(255,255,255,0.8))",
          pointerEvents: "none",
          zIndex: 1
        }}></div>
        <div style={{
          display: "flex",
          gap: "16px",
          paddingBottom: "8px",
          paddingLeft: "16px",
          paddingRight: "56px"
        }}>
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              style={{
                background: "#fafafa",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid #e5e5e5",
                transition: "all 0.2s ease",
                cursor: "pointer",
                minWidth: "180px",
                maxWidth: "180px",
                flexShrink: 0,
                scrollSnapAlign: "start",
                scrollSnapStop: "always"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#d4d4d4";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e5e5";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {/* Product Image */}
              <div style={{
                position: "relative",
                paddingTop: "100%",
                overflow: "hidden",
                background: "#ffffff"
              }}>
                <img
                  src={product.image}
                  alt={product.title}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
                {/* Discount Badge */}
                <div style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "#dc2626",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontWeight: "600"
                }}>
                  {calculateDiscount(product.price, product.comparePrice)}% OFF
                </div>
                {/* Category Badge */}
                <div style={{
                  position: "absolute",
                  top: "8px",
                  left: "8px",
                  background: "rgba(255, 255, 255, 0.9)",
                  color: "#525252",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: "500"
                }}>
                  {product.category}
                </div>
              </div>

              {/* Product Details */}
              <div style={{ padding: "12px" }}>
                {/* Vendor */}
                <div style={{
                  color: "#737373",
                  fontSize: "10px",
                  fontWeight: "500",
                  textTransform: "uppercase",
                  letterSpacing: "0.3px",
                  marginBottom: "4px"
                }}>
                  {product.vendor}
                </div>

                {/* Title */}
                <h3 style={{
                  margin: "0 0 8px 0",
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#262626",
                  lineHeight: "1.3",
                  height: "34px",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical"
                }}>
                  {product.title}
                </h3>

                {/* Price Section */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "10px"
                }}>
                  <span style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#171717"
                  }}>
                    ₹{product.price}
                  </span>
                  <span style={{
                    fontSize: "12px",
                    color: "#a3a3a3",
                    textDecoration: "line-through"
                  }}>
                    ₹{product.comparePrice}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  style={{
                    width: "100%",
                    background: "#262626",
                    color: "white",
                    border: "none",
                    padding: "8px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "background 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#171717";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#262626";
                  }}
                  onClick={() => console.log(`Added ${product.title} to cart`)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "20px 16px",
        color: "#a3a3a3",
        fontSize: "11px",
        borderTop: "1px solid #e5e5e5",
        marginTop: "20px"
      }}>
        <p style={{ margin: 0 }}>Tira Beauty Store Demo - Powered by Claude MCP</p>
      </footer>
      </div>
    </>
  );
}

render(<ProductStore />, document.getElementById("root")!);
