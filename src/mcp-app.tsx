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
    price: 1,
    comparePrice: 398,
    image: "https://mcp-ui-test-production.up.railway.app/public/images/product-1-essence-lipstick.jpg",
    description: "Premium quality lipstick product for everyday use. Perfect for all skin types.",
    category: "Lipstick"
  },
  {
    id: 2,
    title: "Lakme 9 To 5 Matte To Glass Liquid Lip Color - Passion Pink",
    vendor: "Lakme",
    price: 1,
    comparePrice: 748,
    image: "https://mcp-ui-test-production.up.railway.app/public/images/product-2-lakme-lipcolor.jpg",
    description: "Matte to glass finish liquid lip color. Long-lasting formula for all-day wear.",
    category: "Lipstick"
  },
  {
    id: 3,
    title: "Typsy Beauty Drink & Blink Curling Mascara - Black",
    vendor: "Typsy Beauty",
    price: 1,
    comparePrice: 1090,
    image: "https://mcp-ui-test-production.up.railway.app/public/images/product-3-typsy-mascara.jpg",
    description: "Professional curling mascara for dramatic lashes. Smudge-proof formula.",
    category: "Mascara"
  },
  {
    id: 4,
    title: "Minimalist SPF 60 PA++++ Sunscreen With Antioxidant Silymarin",
    vendor: "Minimalist",
    price: 1,
    comparePrice: 622,
    image: "https://mcp-ui-test-production.up.railway.app/public/images/product-4-minimalist-sunscreen.jpg",
    description: "High protection sunscreen with antioxidants. Perfect for daily sun protection.",
    category: "Sunscreen"
  },
  {
    id: 5,
    title: "Essence The Brown Edition Eyeshadow Palette - 30",
    vendor: "Essence",
    price: 1,
    comparePrice: 711,
    image: "https://mcp-ui-test-production.up.railway.app/public/images/product-5-essence-eyeshadow.jpg",
    description: "30 stunning brown shades eyeshadow palette. Create endless eye looks.",
    category: "Eye Shadow"
  }
];

interface CartItem {
  id: number;
  title: string;
  vendor: string;
  price: number;
  quantity: number;
  image: string;
}

// Saved cards data
const SAVED_CARDS = {
  "entity": "collection",
  "count": 2,
  "items": [
    {
      "id": "token_SF6A3zLrLs9LAU",
      "entity": "token",
      "token": "C76HN5TCtdJM0T",
      "method": "card",
      "card": {
        "entity": "card",
        "name": "",
        "last4": "4492",
        "network": "MasterCard",
        "type": "debit",
        "issuer": "UTIB",
        "sub_type": "consumer",
        "expiry_month": "01",
        "expiry_year": "2099"
      },
      "status": "active"
    },
    {
      "id": "token_SEQsF3U9ifAYka",
      "entity": "token",
      "token": "9GcAyR54qoVrzm",
      "method": "card",
      "card": {
        "entity": "card",
        "last4": "7022",
        "network": "Visa",
        "type": "credit",
        "issuer": "YESB",
        "sub_type": "consumer",
        "expiry_month": "01",
        "expiry_year": "2099"
      },
      "status": "active"
    }
  ]
};

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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  const calculateDiscount = (price: number, comparePrice: number) => {
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  };

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, {
        id: product.id,
        title: product.title,
        vendor: product.vendor,
        price: product.price,
        quantity: 1,
        image: product.image
      }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handlePayment = async () => {
    if (!selectedCard) return;

    setIsProcessingPayment(true);
    
    try {
      const card = SAVED_CARDS.items.find(c => c.id === selectedCard);
      if (!card) {
        throw new Error('Card not found');
      }

      // Prepare payment request
      const paymentData = {
        amount: getTotalPrice() * 100, // Convert to paise (₹1 = 100 paise)
        currency: "INR",
        customer_id: "cust_SEQr1OUUlPaRwJ",
        token: card.token,
        contact: "9325938054",
        email: "himanshu.shekhar@razorpay.com",
        notes: {
          "order_items": getTotalItems(),
          "order_total": getTotalPrice()
        }
      };

      // Call our proxy API
      const response = await fetch('https://mcp-ui-test-production.up.railway.app/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Payment API failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Find redirect action in next array
      const redirectAction = data.next?.find((action: any) => action.action === 'redirect');
      
      if (redirectAction && redirectAction.url) {
        // Redirect to authentication URL
        window.location.href = redirectAction.url;
      } else {
        // Payment successful without redirect
        showNotification(`Payment successful! Payment ID: ${data.razorpay_payment_id}`, 'success');
        setCart([]);
        setShowPayment(false);
        setShowCheckout(false);
        setSelectedCard(null);
      }
    } catch (error) {
      console.error('Payment error:', error);
      showNotification(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setIsProcessingPayment(false);
    }
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
        /* Notification animation */
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
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
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
          {showPayment ? "Payment Method" : showCheckout ? "Checkout" : "Tira Beauty Store"}
        </h1>
        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#666" }}>
          {showPayment ? "Select a saved card to complete payment" : showCheckout ? `Review your ${getTotalItems()} items` : "Scroll to browse products →"}
        </p>
      </header>

      {showPayment ? (
        // Payment Method Selection View
        <div style={{
          padding: "20px 16px",
          maxWidth: "600px",
          margin: "0 auto"
        }}>
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#262626", marginBottom: "12px" }}>
              Saved Cards
            </h3>
            {SAVED_CARDS.items.map((cardData) => (
              <div
                key={cardData.id}
                onClick={() => setSelectedCard(cardData.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px",
                  background: selectedCard === cardData.id ? "#f0f0f0" : "#fafafa",
                  border: selectedCard === cardData.id ? "2px solid #262626" : "1px solid #e5e5e5",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  if (selectedCard !== cardData.id) {
                    e.currentTarget.style.borderColor = "#d4d4d4";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCard !== cardData.id) {
                    e.currentTarget.style.borderColor = "#e5e5e5";
                  }
                }}
              >
                {/* Card Network Logo */}
                <div style={{
                  width: "60px",
                  height: "40px",
                  background: "white",
                  borderRadius: "6px",
                  border: "1px solid #e5e5e5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  flexShrink: 0
                }}>
                  {cardData.card.network === "Visa" ? (
                    <div style={{ 
                      background: "linear-gradient(135deg, #1434CB 0%, #2E5BEC 100%)", 
                      width: "100%", 
                      height: "100%", 
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "700",
                      fontSize: "16px",
                      fontStyle: "italic"
                    }}>
                      VISA
                    </div>
                  ) : (
                    <div style={{ 
                      display: "flex",
                      gap: "2px"
                    }}>
                      <div style={{ 
                        width: "20px", 
                        height: "20px", 
                        borderRadius: "50%", 
                        background: "#EB001B",
                        opacity: 0.9
                      }}></div>
                      <div style={{ 
                        width: "20px", 
                        height: "20px", 
                        borderRadius: "50%", 
                        background: "#FF5F00",
                        marginLeft: "-8px"
                      }}></div>
                    </div>
                  )}
                </div>

                {/* Card Details */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#262626",
                    marginBottom: "4px"
                  }}>
                    {cardData.card.network} {cardData.card.type.charAt(0).toUpperCase() + cardData.card.type.slice(1)}
                  </div>
                  <div style={{
                    fontSize: "12px",
                    color: "#737373"
                  }}>
                    •••• {cardData.card.last4}
                  </div>
                  <div style={{
                    fontSize: "11px",
                    color: "#a3a3a3",
                    marginTop: "2px"
                  }}>
                    Expires {cardData.card.expiry_month}/{cardData.card.expiry_year}
                  </div>
                </div>

                {/* Selection Radio */}
                <div style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  border: selectedCard === cardData.id ? "6px solid #262626" : "2px solid #d4d4d4",
                  flexShrink: 0
                }}></div>
              </div>
            ))}
          </div>

          {/* Payment Summary */}
          <div style={{
            padding: "16px",
            background: "#fafafa",
            borderRadius: "8px",
            border: "1px solid #e5e5e5",
            marginBottom: "20px"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px"
            }}>
              <span style={{ fontSize: "13px", color: "#737373" }}>Total Amount</span>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "#262626" }}>₹{getTotalPrice()}</span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            disabled={!selectedCard || isProcessingPayment}
            style={{
              width: "100%",
              background: (selectedCard && !isProcessingPayment) ? "#262626" : "#e5e5e5",
              color: (selectedCard && !isProcessingPayment) ? "white" : "#a3a3a3",
              border: "none",
              padding: "14px",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: (selectedCard && !isProcessingPayment) ? "pointer" : "not-allowed",
              transition: "background 0.2s ease",
              position: "relative"
            }}
            onMouseEnter={(e) => {
              if (selectedCard && !isProcessingPayment) {
                e.currentTarget.style.background = "#171717";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCard && !isProcessingPayment) {
                e.currentTarget.style.background = "#262626";
              }
            }}
            onClick={handlePayment}
          >
            {isProcessingPayment ? "Processing..." : `Pay ₹${getTotalPrice()}`}
          </button>
        </div>
      ) : !showCheckout ? (
        // Products View
        <>
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
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
        </>
      ) : (
        // Checkout View
        <div style={{
          padding: "20px 16px",
          maxWidth: "600px",
          margin: "0 auto"
        }}>
          {cart.map((item) => (
            <div key={item.id} style={{
              display: "flex",
              gap: "12px",
              padding: "16px",
              background: "#fafafa",
              borderRadius: "8px",
              marginBottom: "12px",
              border: "1px solid #e5e5e5"
            }}>
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  flexShrink: 0
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: "10px",
                  color: "#737373",
                  textTransform: "uppercase",
                  marginBottom: "4px"
                }}>
                  {item.vendor}
                </div>
                <div style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#262626",
                  marginBottom: "12px",
                  lineHeight: "1.3"
                }}>
                  {item.title}
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "white",
                    border: "1px solid #e5e5e5",
                    borderRadius: "6px",
                    padding: "6px 8px"
                  }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "18px",
                        color: "#525252",
                        padding: "0 4px",
                        lineHeight: 1
                      }}
                    >
                      −
                    </button>
                    <span style={{ fontSize: "14px", fontWeight: "500", minWidth: "24px", textAlign: "center" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "18px",
                        color: "#525252",
                        padding: "0 4px",
                        lineHeight: 1
                      }}
                    >
                      +
                    </button>
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: "600", color: "#262626" }}>
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                  color: "#a3a3a3",
                  padding: "0",
                  alignSelf: "flex-start",
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>
          ))}

          {/* Total Section */}
          <div style={{
            padding: "20px",
            background: "#fafafa",
            borderRadius: "8px",
            border: "1px solid #e5e5e5",
            marginTop: "20px"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              paddingBottom: "16px",
              borderBottom: "1px solid #e5e5e5"
            }}>
              <div style={{ fontSize: "14px", color: "#737373" }}>
                Subtotal ({getTotalItems()} items)
              </div>
              <div style={{ fontSize: "18px", fontWeight: "600", color: "#262626" }}>
                ₹{getTotalPrice()}
              </div>
            </div>
            <button
              style={{
                width: "100%",
                background: "#262626",
                color: "white",
                border: "none",
                padding: "14px",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#171717";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#262626";
              }}
              onClick={() => {
                setShowPayment(true);
              }}
            >
              Place Order - ₹{getTotalPrice()}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "16px",
        borderTop: "1px solid #e5e5e5",
        marginTop: "20px",
        position: "sticky",
        bottom: 0,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)"
      }}>
        {cart.length > 0 && !showPayment && (
          <div style={{ marginBottom: "12px" }}>
            <button
              style={{
                background: "#262626",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#171717";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#262626";
              }}
              onClick={() => setShowCheckout(!showCheckout)}
            >
              {showCheckout ? "← Back to Products" : `View Cart (${getTotalItems()} items)`}
            </button>
          </div>
        )}
        {showPayment && (
          <div style={{ marginBottom: "12px" }}>
            <button
              style={{
                background: "#e5e5e5",
                color: "#262626",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#d4d4d4";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#e5e5e5";
              }}
              onClick={() => setShowPayment(false)}
            >
              ← Back to Cart
            </button>
          </div>
        )}
        <p style={{ margin: 0, color: "#a3a3a3", fontSize: "11px" }}>Tira Beauty Store Demo - Powered by Claude MCP</p>
      </footer>

      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          background: notification.type === 'success' ? "#16a34a" : "#dc2626",
          color: "white",
          padding: "12px 24px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          zIndex: 10000,
          maxWidth: "90%",
          textAlign: "center",
          animation: "slideDown 0.3s ease"
        }}>
          {notification.message}
        </div>
      )}
      </div>
    </>
  );
}

render(<ProductStore />, document.getElementById("root")!);
