/**
 * @file E-commerce Product Catalog - Tira Beauty Store Demo with Blade Design Language
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

// Blade Design Tokens (Razorpay's design system)
const BLADE = {
  colors: {
    surface: {
      background: {
        primary: '#FFFFFF',
        secondary: '#F7F8FA',
        level2: '#EEF0F5',
      }
    },
    interactive: {
      primary: '#0D66FF', // Razorpay Blue
      primaryHover: '#0A52CC',
      primaryActive: '#084099',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      muted: '#9CA3AF',
      onPrimary: '#FFFFFF',
    },
    feedback: {
      positive: '#16A34A',
      negative: '#DC2626',
      warning: '#F59E0B',
    },
    border: {
      subtle: '#E5E7EB',
      muted: '#D1D5DB',
      strong: '#9CA3AF',
    }
  },
  spacing: {
    2: '4px',
    3: '8px',
    4: '12px',
    5: '16px',
    6: '20px',
    7: '24px',
    8: '32px',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    xlarge: '16px',
  },
  typography: {
    fontSize: {
      10: '10px',
      12: '12px',
      14: '14px',
      16: '16px',
      18: '18px',
      20: '20px',
      24: '24px',
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    }
  }
};

// Hardcoded products - Tira Lipstick Collection
const PRODUCTS = [
  {
    id: 1,
    title: "Essence Long Lasting Lipstick - 02 Just Perfect",
    subtitle: "Premium quality lipstick for everyday use",
    vendor: "Essence",
    price: 1,
    comparePrice: 398,
    size: "3.8g",
    rating: 4.5,
    reviews: 24,
    image: "https://cdn.tiraz5.de/v2/super-fire-62c344/tirabz/wrkr/tiraz5/products/pictures/item/free/original/essence/1034836/0/cuqsTzJrnf-VCZaeBSdNW-1034836_1.jpg",
    category: "Lipstick"
  },
  {
    id: 2,
    title: "Essence Long Lasting Lipstick - 04 Naive",
    subtitle: "Premium quality lipstick for everyday use",
    vendor: "Essence",
    price: 1,
    comparePrice: 403,
    size: "3.8g",
    rating: 4.5,
    reviews: 24,
    image: "https://cdn.tiraz5.de/v2/super-fire-62c344/tirabz/wrkr/tiraz5/products/pictures/item/free/original/essence/1034838/0/2Qbs5OHNl8-NDXFo2aaAN-1034838_1.jpg",
    category: "Lipstick"
  },
  {
    id: 3,
    title: "Lakme 9 To 5 Matte To Glass Liquid Lip Color - Passion Pink",
    subtitle: "Matte to glass finish liquid lip color",
    vendor: "Lakme",
    price: 1,
    comparePrice: 748,
    size: "7.6g",
    rating: 4.5,
    reviews: 24,
    image: "https://cdn.tiraz5.de/v2/super-fire-62c344/tirabz/wrkr/tiraz5/products/pictures/item/free/original/lakme/1120648/0/DICqDA3GWt-lPhtFtqmi-1120648_1.jpg",
    category: "Lipstick"
  },
  {
    id: 4,
    title: "Lakme 9 To 5 Matte To Glass Liquid Lip Color - Nut Roast",
    subtitle: "Matte to glass finish liquid lip color",
    vendor: "Lakme",
    price: 1,
    comparePrice: 796,
    size: "7.6g",
    rating: 4.5,
    reviews: 24,
    image: "https://cdn.tiraz5.de/v2/super-fire-62c344/tirabz/wrkr/tiraz5/products/pictures/item/free/original/lakme/1120651/0/G5z3-ZF-0q-duIVbnrX2-1120651_1.jpg",
    category: "Lipstick"
  },
  {
    id: 5,
    title: "Lakme 9 To 5 Matte To Glass Liquid Lip Color - Beachy Vibe",
    subtitle: "Matte to glass finish liquid lip color",
    vendor: "Lakme",
    price: 1,
    comparePrice: 789,
    size: "7.6g",
    rating: 4.5,
    reviews: 24,
    image: "https://cdn.tiraz5.de/v2/super-fire-62c344/tirabz/wrkr/tiraz5/products/pictures/item/free/original/lakme/1120650/0/oRixwqfMKG-8f5YWMKZi-1120650_1.jpg",
    category: "Lipstick"
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
  const [isPollingPayment, setIsPollingPayment] = useState(false);
  const [pollingPaymentId, setPollingPaymentId] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<any | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

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

  const pollPaymentStatus = async (paymentId: string) => {
    let attempts = 0;
    const maxAttempts = 60; // Poll for 2 minutes (60 * 2 seconds)
    
    const poll = async () => {
      try {
        const response = await fetch(`https://mcp-ui-test-production.up.railway.app/api/payment-status/${paymentId}`);
        
        if (!response.ok) {
          throw new Error('Failed to check payment status');
        }

        const data = await response.json();
        
        if (data.status === 'authorized' || data.status === 'captured') {
          // Payment successful
          setIsPollingPayment(false);
          setPollingPaymentId(null);
          setAuthUrl(null);
          setPaymentSuccess(data);
          showNotification(`Payment successful! Amount: ₹${data.amount / 100}`, 'success');
          return;
        } else if (data.status === 'failed') {
          // Payment failed
          setIsPollingPayment(false);
          setPollingPaymentId(null);
          showNotification('Payment failed. Please try again.', 'error');
          return;
        }
        
        // Continue polling if status is still processing
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000); // Poll every 2 seconds
        } else {
          setIsPollingPayment(false);
          setPollingPaymentId(null);
          showNotification('Payment status check timed out. Please verify manually.', 'error');
        }
      } catch (error) {
        console.error('Payment status polling error:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000); // Retry on error
        } else {
          setIsPollingPayment(false);
          setPollingPaymentId(null);
          showNotification('Failed to check payment status.', 'error');
        }
      }
    };
    
    poll();
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
        // Store auth URL to display to user
        setAuthUrl(redirectAction.url);
        showNotification('Please copy the authentication URL below', 'success');
        
        // Start polling for payment status
        setIsPollingPayment(true);
        setPollingPaymentId(data.razorpay_payment_id);
        pollPaymentStatus(data.razorpay_payment_id);
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
          background: BLADE.colors.border.muted;
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
        /* Spinner animation */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
        borderBottom: "1px solid BLADE.colors.border.subtle"
      }}>
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
          {paymentSuccess ? "Payment Confirmed" : showPayment ? "Payment Method" : showCheckout ? "Checkout" : "Tira Beauty Store"}
        </h1>
        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#666" }}>
          {paymentSuccess 
            ? "Your order has been successfully processed"
            : isPollingPayment 
              ? `Waiting for payment confirmation... (${pollingPaymentId})` 
              : showPayment 
                ? "Select a saved card to complete payment" 
                : showCheckout 
                  ? `Review your ${getTotalItems()} items` 
                  : "Swipe to explore our collection →"}
        </p>
      </header>

      {showPayment ? (
        paymentSuccess ? (
          // Payment Success View
          <div style={{
            padding: "40px 16px",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            {/* Success Icon */}
            <div style={{
              width: "80px",
              height: "80px",
              background: "#16a34a",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: "40px",
              color: "white"
            }}>
              ✓
            </div>

            <h2 style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "BLADE.colors.text.primary",
              textAlign: "center",
              marginBottom: "12px"
            }}>
              Payment Successful!
            </h2>

            <p style={{
              fontSize: "14px",
              color: "#737373",
              textAlign: "center",
              marginBottom: "32px"
            }}>
              Your payment has been processed successfully
            </p>

            {/* Payment Details */}
            <div style={{
              background: "BLADE.colors.surface.background.secondary",
              border: "1px solid BLADE.colors.border.subtle",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "24px"
            }}>
              <h3 style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "BLADE.colors.text.primary",
                marginBottom: "16px"
              }}>
                Payment Details
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "#737373" }}>Amount Paid</span>
                  <span style={{ fontSize: "16px", fontWeight: "600", color: "#16a34a" }}>
                    ₹{paymentSuccess.amount / 100}
                  </span>
                </div>

                <div style={{ height: "1px", background: "BLADE.colors.border.subtle" }}></div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "#737373" }}>Payment ID</span>
                  <span style={{ fontSize: "12px", fontFamily: "monospace", color: "BLADE.colors.text.primary" }}>
                    {paymentSuccess.id}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "#737373" }}>Status</span>
                  <span style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#16a34a",
                    textTransform: "uppercase"
                  }}>
                    {paymentSuccess.status}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "#737373" }}>Payment Method</span>
                  <span style={{ fontSize: "13px", color: "BLADE.colors.text.primary" }}>
                    {paymentSuccess.card?.network} •••• {paymentSuccess.card?.last4}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "#737373" }}>Card Type</span>
                  <span style={{ fontSize: "13px", color: "BLADE.colors.text.primary", textTransform: "capitalize" }}>
                    {paymentSuccess.card?.type}
                  </span>
                </div>

                {paymentSuccess.acquirer_data?.auth_code && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", color: "#737373" }}>Auth Code</span>
                    <span style={{ fontSize: "12px", fontFamily: "monospace", color: "BLADE.colors.text.primary" }}>
                      {paymentSuccess.acquirer_data.auth_code}
                    </span>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "#737373" }}>Date</span>
                  <span style={{ fontSize: "13px", color: "BLADE.colors.text.primary" }}>
                    {new Date(paymentSuccess.created_at * 1000).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              style={{
                width: "100%",
                background: BLADE.colors.interactive.primary,
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
                e.currentTarget.style.background = "BLADE.colors.interactive.primaryHover";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "BLADE.colors.text.primary";
              }}
              onClick={() => {
                // Reset everything and go back to products
                setPaymentSuccess(null);
                setCart([]);
                setShowPayment(false);
                setShowCheckout(false);
                setSelectedCard(null);
              }}
            >
              Back to Products
            </button>
          </div>
        ) : isPollingPayment && authUrl ? (
          // Polling / Authentication View
          <div style={{
            padding: "40px 16px",
            maxWidth: "600px",
            margin: "0 auto",
            textAlign: "center"
          }}>
            {/* Loading Spinner */}
            <div style={{
              width: "60px",
              height: "60px",
              border: "4px solid #f5f5f5",
              borderTop: "4px solid BLADE.colors.text.primary",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 24px"
            }}></div>

            <h2 style={{ 
              fontSize: "18px", 
              fontWeight: "600", 
              color: "BLADE.colors.text.primary", 
              marginBottom: "12px" 
            }}>
              Waiting for Payment Confirmation
            </h2>

            <p style={{ 
              fontSize: "14px", 
              color: "#737373", 
              marginBottom: "24px",
              lineHeight: "1.5"
            }}>
              Click the URL below to select it, then copy and paste it into a new browser tab.
            </p>

            {/* Authentication URL - Click to Select */}
            <div
              onClick={(e) => {
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(e.currentTarget.querySelector('div') as Node);
                selection?.removeAllRanges();
                selection?.addRange(range);
              }}
              style={{
                background: "BLADE.colors.surface.background.secondary",
                border: "2px solid BLADE.colors.text.primary",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "24px",
                cursor: "pointer",
                transition: "background 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f0f0f0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "BLADE.colors.surface.background.secondary";
              }}
            >
              <div style={{
                fontSize: "11px",
                color: "#737373",
                marginBottom: "6px",
                fontWeight: "500"
              }}>
                👆 Click here to select URL:
              </div>
              <div style={{
                fontSize: "12px",
                fontFamily: "monospace",
                color: "BLADE.colors.text.primary",
                wordBreak: "break-all",
                lineHeight: "1.6",
                userSelect: "all"
              }}>
                {authUrl}
              </div>
            </div>

            {/* Instructions Box */}
            <div style={{
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "24px",
              textAlign: "left"
            }}>
              <div style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#9a3412",
                marginBottom: "12px"
              }}>
                📋 Next Steps:
              </div>
              <ol style={{
                margin: 0,
                paddingLeft: "20px",
                fontSize: "13px",
                color: "#9a3412",
                lineHeight: "1.8"
              }}>
                <li><strong>Click the box above</strong> to select the URL</li>
                <li><strong>Copy</strong> it (Ctrl+C or Cmd+C)</li>
                <li><strong>Open</strong> a new browser tab</li>
                <li><strong>Paste</strong> the URL and press Enter</li>
                <li><strong>Complete</strong> the OTP or 3D Secure verification</li>
                <li><strong>Return here</strong> - we'll automatically detect success!</li>
              </ol>
            </div>

            <p style={{ 
              fontSize: "12px", 
              color: "#a3a3a3", 
              marginTop: "16px"
            }}>
              Payment ID: <span style={{ fontFamily: "monospace", color: "#737373" }}>{pollingPaymentId}</span>
            </p>

            <p style={{ 
              fontSize: "12px", 
              color: "#16a34a",
              fontWeight: "500",
              marginTop: "12px"
            }}>
              ✓ This page will automatically update when payment is confirmed
            </p>
          </div>
        ) : (
          // Payment Method Selection View
        <div style={{
          padding: "20px 16px",
          maxWidth: "600px",
          margin: "0 auto"
        }}>
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "BLADE.colors.text.primary", marginBottom: "12px" }}>
              Saved Cards
            </h3>
            {SAVED_CARDS.items.map((cardData) => (
              <div
                key={cardData.id}
                onClick={() => setSelectedCard(cardData.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: BLADE.spacing[5],
                  padding: BLADE.spacing[5],
                  background: selectedCard === cardData.id ? BLADE.colors.surface.background.level2 : BLADE.colors.surface.background.secondary,
                  border: selectedCard === cardData.id ? `2px solid ${BLADE.colors.interactive.primary}` : `1px solid ${BLADE.colors.border.subtle}`,
                  borderRadius: BLADE.borderRadius.medium,
                  marginBottom: BLADE.spacing[4],
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  if (selectedCard !== cardData.id) {
                    e.currentTarget.style.borderColor = BLADE.colors.border.muted;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCard !== cardData.id) {
                    e.currentTarget.style.borderColor = BLADE.colors.border.subtle;
                  }
                }}
              >
                {/* Card Network Logo */}
                <div style={{
                  width: "60px",
                  height: "40px",
                  background: BLADE.colors.surface.background.primary,
                  borderRadius: BLADE.borderRadius.small,
                  border: `1px solid ${BLADE.colors.border.subtle}`,
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
                    color: "BLADE.colors.text.primary",
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
                  border: selectedCard === cardData.id ? "6px solid BLADE.colors.text.primary" : "2px solid BLADE.colors.border.muted",
                  flexShrink: 0
                }}></div>
              </div>
            ))}
          </div>

          {/* Payment Summary */}
          <div style={{
            padding: "16px",
            background: "BLADE.colors.surface.background.secondary",
            borderRadius: "8px",
            border: "1px solid BLADE.colors.border.subtle",
            marginBottom: "20px"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px"
            }}>
              <span style={{ fontSize: "13px", color: "#737373" }}>Total Amount</span>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "BLADE.colors.text.primary" }}>₹{getTotalPrice()}</span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            disabled={!selectedCard || isProcessingPayment}
            style={{
              width: "100%",
              background: (selectedCard && !isProcessingPayment) ? BLADE.colors.interactive.primary : BLADE.colors.border.subtle,
              color: (selectedCard && !isProcessingPayment) ? BLADE.colors.text.onPrimary : BLADE.colors.text.muted,
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
                e.currentTarget.style.background = "BLADE.colors.interactive.primaryHover";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCard && !isProcessingPayment) {
                e.currentTarget.style.background = "BLADE.colors.text.primary";
              }
            }}
            onClick={handlePayment}
          >
            {isProcessingPayment ? "Processing..." : `Pay ₹${getTotalPrice()}`}
          </button>
        </div>
        )
      ) : !showCheckout ? (
        // Products View with Modern Mobile UI
        <>
      {/* Main Container with Blue Border */}
      <div style={{
        maxWidth: "680px",
        margin: "16px auto",
        background: "#F9FAFB",
        borderRadius: "20px",
        border: "2px solid #93C5FD",
        padding: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)"
      }}>
        {/* Tira Branding and Trust Badge Section */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          paddingBottom: "12px"
        }}>
          {/* Left: Tira Logo */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <img 
              src="/public/images/tira_logo.png" 
              alt="Tira" 
              style={{
                height: "32px",
                width: "auto"
              }}
            />
          </div>

          {/* Right: Secured by Razorpay */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}>
            <span style={{
              fontSize: "10px",
              color: "#6B7280"
            }}>Secured by</span>
            <span style={{
              fontSize: "11px",
              fontWeight: "600",
              color: "#374151",
              fontStyle: "italic"
            }}>Razorpay</span>
          </div>
        </div>

        {/* Product Carousel */}
        <div style={{
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          marginBottom: "16px",
          paddingBottom: "8px"
        }}>
          <div style={{
            display: "flex",
            gap: "12px"
          }}>
            {PRODUCTS.map((product) => {
              const cartItem = cart.find(item => item.id === product.id);
              const isSelected = selectedProductId === product.id;
              
              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProductId(product.id)}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    minWidth: "280px",
                    maxWidth: "280px",
                    flexShrink: 0,
                    scrollSnapAlign: "center",
                    border: isSelected ? "2px solid #9333EA" : "1px solid #E5E7EB",
                    boxShadow: isSelected ? "0 4px 12px rgba(147, 51, 234, 0.15)" : "0 2px 8px rgba(0, 0, 0, 0.04)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    overflow: "hidden"
                  }}
                >
                  {/* Product Image Area */}
                  <div style={{
                    background: "#FFFFFF",
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    minHeight: "200px"
                  }}>
                    <img 
                      src={product.image} 
                      alt={product.title}
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "contain"
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div style={{
                    padding: "16px"
                  }}>
                    {/* Rating */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      marginBottom: "8px"
                    }}>
                      <span style={{
                        color: "#16A34A",
                        fontSize: "14px"
                      }}>★</span>
                      <span style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#374151"
                      }}>{product.rating}</span>
                      <span style={{
                        fontSize: "12px",
                        color: "#9CA3AF"
                      }}>({product.reviews})</span>
                    </div>

                    {/* Title */}
                    <h3 style={{
                      margin: "0 0 4px 0",
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#1F2937",
                      lineHeight: "1.4",
                      height: "42px",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical"
                    }}>
                      {product.title}
                    </h3>

                    {/* Subtitle */}
                    <p style={{
                      margin: "0 0 8px 0",
                      fontSize: "12px",
                      color: "#6B7280",
                      lineHeight: "1.4"
                    }}>
                      {product.subtitle}
                    </p>

                    {/* Size Dropdown */}
                    <select style={{
                      width: "100%",
                      padding: "6px 8px",
                      background: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "#374151",
                      marginBottom: "12px",
                      cursor: "pointer"
                    }}>
                      <option>{product.size}</option>
                    </select>

                    {/* Price Row */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px"
                    }}>
                      <span style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#1F2937"
                      }}>₹{product.price}</span>
                      <span style={{
                        fontSize: "13px",
                        color: "#9CA3AF",
                        textDecoration: "line-through"
                      }}>₹{product.comparePrice}</span>
                      <span style={{
                        fontSize: "12px",
                        color: "#16A34A",
                        fontWeight: "600"
                      }}>90%off</span>
                    </div>

                    {/* Add to Cart Button or Quantity Selector */}
                    {cartItem ? (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "#F3F4F6",
                        borderRadius: "8px",
                        padding: "8px 12px"
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(product.id, cartItem.quantity - 1);
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "18px",
                            color: "#6B7280",
                            padding: "0",
                            width: "24px",
                            height: "24px"
                          }}
                        >
                          −
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromCart(product.id);
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "16px",
                            color: "#EF4444",
                            padding: "0"
                          }}
                        >
                          🗑
                        </button>
                        
                        <span style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          minWidth: "20px",
                          textAlign: "center"
                        }}>
                          {cartItem.quantity}
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(product.id, cartItem.quantity + 1);
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "18px",
                            color: "#6B7280",
                            padding: "0",
                            width: "24px",
                            height: "24px"
                          }}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        style={{
                          width: "100%",
                          background: "white",
                          color: "#4F46E5",
                          border: "1.5px solid #4F46E5",
                          padding: "10px",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#4F46E5";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "white";
                          e.currentTarget.style.color = "#4F46E5";
                        }}
                      >
                        Add +
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mini Cart Summary */}
        {cart.length > 0 && (
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "16px",
            border: "1px solid #E5E7EB",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
          }}>
            {/* Product Thumbnails and Price */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px"
            }}>
              {/* Mini Thumbnails */}
              <div style={{
                display: "flex",
                gap: "8px"
              }}>
                {cart.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      overflow: "hidden"
                    }}
                  >
                    <img 
                      src={item.image}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Price and Product Count */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1F2937"
                }}>₹{getTotalPrice()}</div>
                <div style={{
                  fontSize: "12px",
                  color: "#6B7280"
                }}>{getTotalItems()} Products</div>
              </div>
            </div>

            {/* View Cart Button */}
            <button
              onClick={() => setShowCheckout(true)}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
                color: "white",
                border: "none",
                padding: "14px",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(79, 70, 229, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(79, 70, 229, 0.3)";
              }}
            >
              View Cart
            </button>
          </div>
        )}
      </div>
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
              background: "BLADE.colors.surface.background.secondary",
              borderRadius: "8px",
              marginBottom: "12px",
              border: "1px solid BLADE.colors.border.subtle"
            }}>
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "contain",
                  borderRadius: "6px",
                  flexShrink: 0,
                  background: "white",
                  border: "1px solid #E5E7EB"
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
                  color: "BLADE.colors.text.primary",
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
                    border: "1px solid BLADE.colors.border.subtle",
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
                  <div style={{ fontSize: "16px", fontWeight: "600", color: "BLADE.colors.text.primary" }}>
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
            background: "BLADE.colors.surface.background.secondary",
            borderRadius: "8px",
            border: "1px solid BLADE.colors.border.subtle",
            marginTop: "20px"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              paddingBottom: "16px",
              borderBottom: "1px solid BLADE.colors.border.subtle"
            }}>
              <div style={{ fontSize: "14px", color: "#737373" }}>
                Subtotal ({getTotalItems()} items)
              </div>
              <div style={{ fontSize: "18px", fontWeight: "600", color: "BLADE.colors.text.primary" }}>
                ₹{getTotalPrice()}
              </div>
            </div>
            <button
              style={{
                width: "100%",
                background: BLADE.colors.interactive.primary,
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
                e.currentTarget.style.background = "BLADE.colors.interactive.primaryHover";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "BLADE.colors.text.primary";
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
        borderTop: "1px solid BLADE.colors.border.subtle",
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
                background: BLADE.colors.interactive.primary,
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
                e.currentTarget.style.background = "BLADE.colors.interactive.primaryHover";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "BLADE.colors.text.primary";
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
                background: "BLADE.colors.border.subtle",
                color: "BLADE.colors.text.primary",
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
                e.currentTarget.style.background = "BLADE.colors.border.muted";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "BLADE.colors.border.subtle";
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
