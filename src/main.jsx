import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Check,
  Citrus,
  Cookie,
  CupSoda,
  Heart,
  Leaf,
  MapPin,
  Menu as MenuIcon,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import {
  CATEGORIES,
  MENU,
  MAX_QUANTITY,
  makeLine,
  money,
  restoreCart,
  totalPrice,
  whatsappUrl,
} from "./menu.js";
import "./styles.css";
import "./modern.css";

const STORAGE_KEY = "beirut-sweets-cart";
const ICONS = {
  sparkles: Sparkles,
  citrus: Citrus,
  cup: CupSoda,
  cookie: Cookie,
  cherry: Heart,
};

function useReveal(dependency) {
  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]:not(.revealed)");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("revealed"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [dependency]);
}

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="Beirut Sweets home">
      <img className="brand-mark" src="/images/beirut-brand-mark.svg" width="52" height="52" alt="" />
      <span className="brand-name">
        beirut
        <span>
          sweets & cocktails
        </span>
      </span>
    </a>
  );
}

function FoodPhoto({ image }) {
  return (
    <img
      className="food-photo"
      src={image}
      alt=""
      loading="lazy"
      decoding="async"
      width="640"
      height="640"
    />
  );
}

const CATEGORY_BACKGROUNDS = {
  all: ["/images/beirut-sweets-hero.webp", "/images/beirut-sweets-hero.webp"],
  cocktails: ["/images/juice-orange.webp", "/images/juice-pineapple.webp"],
  shakes: ["/images/shake-chocolate.webp", "/images/shake-banana.webp"],
  crepes: ["/images/crepe-nutella.webp", "/images/crepe-kinder-representative.webp"],
  plates: ["/images/kashta-fruit.webp", "/images/kashta-plain.webp"],
};

function AmbientBackground({ category }) {
  const images = CATEGORY_BACKGROUNDS[category] || CATEGORY_BACKGROUNDS.all;
  const scene = useRef(null);
  useEffect(() => {
    const motion = matchMedia(
      "(prefers-reduced-motion: no-preference) and (pointer: fine)",
    );
    let frame = 0;
    let point = { x: 0, y: 0 };
    const move = (event) => {
      if (!motion.matches || document.hidden) return;
      point = {
        x: (event.clientX / innerWidth - 0.5) * 24,
        y: (event.clientY / innerHeight - 0.5) * 20,
      };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        scene.current?.style.setProperty("--drift-x", point.x + "px");
        scene.current?.style.setProperty("--drift-y", point.y + "px");
        frame = 0;
      });
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      scene.current?.style.removeProperty("--drift-x");
      scene.current?.style.removeProperty("--drift-y");
    };
    window.addEventListener("pointermove", move, { passive: true });
    motion.addEventListener("change", reset);
    document.addEventListener("visibilitychange", reset);
    return () => {
      window.removeEventListener("pointermove", move);
      motion.removeEventListener("change", reset);
      document.removeEventListener("visibilitychange", reset);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div className="ambient-scene" ref={scene} aria-hidden="true" data-category={category}>
      <div className="ambient-orbit" />
      <div className="ambient-fruit ambient-fruit-a">
        <img key={images[0]} src={images[0]} alt="" decoding="async" />
      </div>
      <div className="ambient-fruit ambient-fruit-b">
        <img key={images[1]} src={images[1]} alt="" decoding="async" />
      </div>
      <Leaf className="ambient-leaf" strokeWidth={0.5} />
    </div>
  );
}

function Header({ count, openCart }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const escape = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);
  return (
    <header className="site-header">
      <div className="header-inner container">
        <Brand />
        <nav
          id="main-nav"
          className={mobileOpen ? "nav-open" : ""}
          aria-label="Main navigation"
        >
          <a href="#menu" onClick={() => setMobileOpen(false)}>
            Our menu
          </a>
          <a href="#contact" onClick={() => setMobileOpen(false)}>
            Find us <ArrowUpRight size={13} />
          </a>
        </nav>
        <div className="header-actions">
          <a className="call-link" href="tel:+96176804192">
            <Phone size={15} /> 76 804 192
          </a>
          <button
            className="cart-button"
            onClick={openCart}
            aria-label={"Open cart, " + count + " items"}
          >
            <ShoppingBag size={18} />
            <span>Your cart</span>
            <b>{count}</b>
          </button>
          <button
            className="icon-button menu-toggle"
            aria-expanded={mobileOpen}
            aria-controls="main-nav"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero container" id="top">
      <div className="hero-copy">
        <span className="eyebrow hero-enter">
          <span className="tiny-sun" /> Fresh flavors. Beirut soul.
        </span>
        <h1 className="hero-enter">
          A little sip.
          <br />
          <em>A lot of joy.</em>
        </h1>
        <p className="hero-enter">
          Colorful cocktails, creamy shakes, and crepes worth slowing down for.
          Made fresh, just for you.
        </p>
        <div className="hero-actions hero-enter">
          <a className="button button-orange" href="#menu">
            Find your favorite <ArrowUpRight size={19} />
          </a>
          <a className="hero-secondary" href="#contact">Find our shop <ArrowUpRight size={18} /></a>
        </div>
        <div className="hero-note hero-enter">
          <span>
            <Leaf size={15} /> Freshly prepared
          </span>
          <span>
            <Heart size={15} /> Made with love
          </span>
        </div>
      </div>
      <div className="hero-visual hero-enter">
        <div className="hero-image">
          <img
            src="/images/beirut-sweets-hero.webp"
            alt="Fruit cocktails and warm chocolate crepes"
            fetchPriority="high"
            width="1200"
            height="800"
          />
        </div>
        <div className="hero-photo-tag"><span className="live-dot" /> A fresh kind of happiness</div>
        <div className="hero-caption">
          <span className="caption-icon">
            <Sparkles size={20} />
          </span>
          <div>
            <strong>Your daily feel-good.</strong>
            <span>Fruit cocktails · Shakes · Sweet treats</span>
          </div>
          <ArrowUpRight size={19} />
        </div>
      </div>
      <a className="scroll-hint" href="#menu">
        <ArrowDown size={16} /> Scroll for the good stuff
      </a>
    </section>
  );
}

function MenuCard({ item, addItem, index }) {
  const [size, setSize] = useState(item.options[0].label);
  const [added, setAdded] = useState(false);
  const selected = item.options.find((option) => option.label === size);
  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1400);
    return () => clearTimeout(timer);
  }, [added]);
  return (
    <article
      className="menu-card"
      data-category={item.category}
      data-reveal
      style={{ "--delay": (index % 4) * 55 + "ms" }}
      aria-labelledby={"product-" + item.id}
    >
      <div className="product-image">
        <FoodPhoto image={item.image} />
        {item.featured && (
          <span className="product-badge">
            <Sparkles size={12} /> Our pick
          </span>
        )}
        <span className="product-category">
          {item.category === "cocktails"
            ? "FRESH & FRUITY"
            : item.category === "crepes"
              ? "SWEET & WARM"
              : item.category === "shakes"
                ? "THICK & CREAMY"
                : "A LEBANESE CLASSIC"}
        </span>
      </div>
      <div className="card-body">
        <div className="product-heading">
          <h3 id={"product-" + item.id}>{item.name}</h3>
          <span lang="ar" dir="rtl">
            {item.arabic}
          </span>
        </div>
        <p>{item.description}</p>
        <div
          className="size-picker"
          role="group"
          aria-label={"Size for " + item.name}
        >
          {item.options.map((option) => (
            <button
              key={option.label}
              aria-pressed={size === option.label}
              onClick={() => setSize(option.label)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="card-footer">
          <strong>
            {new Intl.NumberFormat("en-US").format(selected.price)}
            <small>L.L.</small>
          </strong>
          <button
            className={added ? "add-button added" : "add-button"}
            onClick={() => {
              addItem(item, selected);
              setAdded(true);
            }}
            aria-label={"Add " + item.name + ", " + size}
          >
            <span>{added ? "Added" : "Add"}</span>
            {added ? <Check size={17} /> : <Plus size={17} />}
          </button>
        </div>
      </div>
    </article>
  );
}

function CartDrawer({ open, close, cart, updateQty, remove, clear }) {
  const dialogRef = useRef(null);
  const [details, setDetails] = useState({
    method: "pickup",
    name: "",
    address: "",
    notes: "",
  });
  const [confirmClear, setConfirmClear] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open) {
      dialog.close();
      setConfirmClear(false);
      return;
    }
    const trigger = document.activeElement;
    dialog.showModal();
    const trapFocus = (event) => {
      if (event.key !== "Tab") return;
      const focusable = [
        ...dialog.querySelectorAll(
          'button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
        ),
      ].filter((element) => element.getClientRects().length);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    dialog.addEventListener("keydown", trapFocus);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.removeEventListener("keydown", trapFocus);
      dialog.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);
  const change = (event) =>
    setDetails((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const checkout = (event) => {
    event.preventDefault();
    if (!cart.length) return;
    if (details.method === "delivery" && !details.address.trim()) {
      setCheckoutError("Please enter a delivery address.");
      return;
    }
    setCheckoutError("");
    // A website cannot observe WhatsApp's Send action. Clear only after the
    // browser accepts the handoff, retaining the order if popups are blocked.
    let whatsappWindow;
    try {
      whatsappWindow = window.open("about:blank", "_blank");
      if (!whatsappWindow) {
        setCheckoutError("Please allow popups to open WhatsApp. Your cart has been kept.");
        return;
      }
      whatsappWindow.opener = null;
      whatsappWindow.location.replace(whatsappUrl(cart, details));
    } catch {
      whatsappWindow?.close();
      setCheckoutError("WhatsApp could not open. Your cart has been kept. Please try again.");
      return;
    }
    clear();
    setDetails(current => ({ ...current, notes: "" }));
    close();
  };
  return (
    <dialog
      ref={dialogRef}
      className="cart-dialog"
      aria-labelledby="cart-title"
      onCancel={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="cart-panel">
        <div className="cart-header">
          <div>
            <span className="eyebrow">Good things inside</span>
            <h2 id="cart-title">
              Your sweet selection
              <span>{cart.reduce((n, line) => n + line.quantity, 0)}</span>
            </h2>
          </div>
          <button
            className="icon-button"
            onClick={close}
            aria-label="Close cart"
            autoFocus
          >
            <X size={21} />
          </button>
        </div>
        {!cart.length ? (
          <div className="empty-cart">
            <span>
              <ShoppingBag size={42} strokeWidth={1.2} />
              <Heart size={20} />
            </span>
            <h3>
              A little empty.
              <br />A lot of possibilities.
            </h3>
            <p>Your next favorite is waiting on the menu.</p>
            <button
              className="button button-orange"
              onClick={() => {
                close();
                document.getElementById("menu").scrollIntoView();
              }}
            >
              Explore the menu <ArrowRight size={17} />
            </button>
          </div>
        ) : (
          <form className="order-form" onSubmit={checkout}>
            <div className="cart-content">
              <div className="cart-lines">
                {cart.map((line) => (
                  <div className="cart-line" key={line.key}>
                    <div className="cart-thumb">
                      <FoodPhoto image={line.image} />
                    </div>
                    <div className="line-info">
                      <h3>{line.name}</h3>
                      <span>
                        {line.size} · {money(line.price)} each
                      </span>
                      <div className="line-bottom">
                        <div className="quantity-control">
                          <button
                            type="button"
                            onClick={() => updateQty(line.key, -1)}
                            aria-label={
                              "Decrease " + line.name + " " + line.size
                            }
                          >
                            <Minus size={14} />
                          </button>
                          <span aria-label="Quantity">{line.quantity}</span>
                          <button
                            type="button"
                            disabled={line.quantity >= MAX_QUANTITY}
                            onClick={() => updateQty(line.key, 1)}
                            aria-label={
                              "Increase " + line.name + " " + line.size
                            }
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <strong>{money(line.price * line.quantity)}</strong>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="remove-line icon-button"
                      onClick={() => remove(line.key)}
                      aria-label={"Remove " + line.name + " " + line.size}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
              {confirmClear ? (
                <div className="clear-confirm">
                  Clear your entire cart?
                  <button
                    type="button"
                    onClick={() => {
                      clear();
                      setConfirmClear(false);
                    }}
                  >
                    Yes, clear
                  </button>
                  <button type="button" onClick={() => setConfirmClear(false)}>
                    Keep items
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="clear-cart"
                  onClick={() => setConfirmClear(true)}
                >
                  <Trash2 size={12} /> Clear cart
                </button>
              )}
              <fieldset className="order-details">
                <legend>Make it yours</legend>
                <div className="fulfillment">
                  <label>
                    <input
                      type="radio"
                      name="method"
                      value="pickup"
                      checked={details.method === "pickup"}
                      onChange={change}
                    />
                    <ShoppingBag size={16} /> Pickup
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="method"
                      value="delivery"
                      checked={details.method === "delivery"}
                      onChange={change}
                    />
                    <MapPin size={16} /> Delivery
                  </label>
                </div>
                <label>
                  Your name <span>(optional)</span>
                  <input
                    name="name"
                    autoComplete="name"
                    maxLength={80}
                    value={details.name}
                    onChange={change}
                    placeholder="What should we call you?"
                  />
                </label>
                {details.method === "delivery" && (
                  <label>
                    Delivery address
                    <input
                      name="address"
                      autoComplete="street-address"
                      required
                      maxLength={300}
                      value={details.address}
                      onChange={change}
                      placeholder="Area, street, building, floor"
                    />
                  </label>
                )}
                <label>
                  Anything we should know? <span>(optional)</span>
                  <textarea
                    name="notes"
                    rows={2}
                    maxLength={500}
                    value={details.notes}
                    onChange={change}
                    placeholder="Special requests or order notes"
                  />
                </label>
              </fieldset>
            </div>
            <div className="cart-checkout">
              <div className="total-row">
                <span>Items total</span>
                <strong>{money(totalPrice(cart))}</strong>
              </div>
              <p>
                Availability, timing and any delivery fee confirmed by the
                restaurant.
              </p>
              {checkoutError && <p role="alert">{checkoutError}</p>}
              <button className="button whatsapp-button" type="submit">
                <MessageCircle size={20} /> Send order via WhatsApp{" "}
                <ArrowUpRight size={19} />
              </button>
              <span className="checkout-note">
                Cart clears when WhatsApp opens. Review your message there, then tap Send.
              </span>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}

function Footer() {
  return (
    <footer id="contact">
      <div className="contact-banner container" data-reveal>
        <div>
          <span className="eyebrow">See you for something sweet</span>
          <h2>
            Your next craving?
            <br />
            <em>We’ve got you.</em>
          </h2>
        </div>
        <a
          className="button button-cream"
          href="https://wa.me/96176804192"
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={20} /> Say hello on WhatsApp{" "}
          <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="footer-main container">
        <div>
          <Brand />
          <p>A little joy in every cup.</p>
        </div>
        <div>
          <span className="footer-label">COME FIND US</span>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Safad+El+Batikh+Lebanon"
            target="_blank"
            rel="noreferrer"
          >
            <MapPin size={16} /> Safad El Batikh, Lebanon{" "}
            <ArrowUpRight size={13} />
          </a>
        </div>
        <div>
          <span className="footer-label">LET’S TALK</span>
          <a href="tel:+96176804192">
            <Phone size={16} /> +961 76 804 192
          </a>
          <a
            href="https://www.instagram.com/beirut.sweets14"
            target="_blank"
            rel="noreferrer"
          >
            <Camera size={16} /> @beirut.sweets14
          </a>
        </div>
      </div>
      <div className="footer-bottom container">
        <span>© {new Date().getFullYear()} Beirut Sweets. Made with love.</span>
        <a href="/media-credits.html">Photography & credits</a>
      </div>
    </footer>
  );
}

function Intro({ finish }) {
  const [leaving, setLeaving] = useState(false);
  const leavingRef = useRef(false);
  const exitTimer = useRef(null);
  const skip = useRef(null);
  const leave = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setLeaving(true);
    exitTimer.current = setTimeout(finish, 450);
  }, [finish]);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    skip.current?.focus();
    const timer = setTimeout(leave, 4000);
    const keyboard = (event) => {
      if (event.key === "Escape") leave();
      if (event.key === "Tab") {
        event.preventDefault();
        skip.current?.focus();
      }
    };
    window.addEventListener("keydown", keyboard);
    return () => {
      clearTimeout(timer);
      clearTimeout(exitTimer.current);
      window.removeEventListener("keydown", keyboard);
      document.body.style.overflow = previousOverflow;
    };
  }, [leave]);
  return (
    <div
      className={"intro-screen" + (leaving ? " intro-leaving" : "")}
      role="dialog"
      aria-modal="true"
      aria-label="Beirut Sweets introduction"
    >
      <video
        src="/video/crepe-intro-short.mp4"
        poster="/images/crepe-intro-poster.webp"
        autoPlay
        muted
        playsInline
        preload="auto"
        onError={leave}
        aria-hidden="true"
      />
      <div className="intro-wash" />
      <div className="intro-brand">
        <img src="/images/beirut-brand-mark.svg" className="intro-logo" width="80" height="80" alt="" />
        <span>A LITTLE MOMENT FROM</span>
        <h1>
          beirut
          <br />
          <em>sweets.</em>
        </h1>
        <i>Freshly made happiness</i>
      </div>
      <div className="intro-progress">
        <span />
      </div>
      <button ref={skip} onClick={leave}>
        Skip intro <ArrowRight size={15} />
      </button>
    </div>
  );
}

function App() {
  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [showIntro, setShowIntro] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (
      params.has("skipIntro") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      navigator.connection?.saveData
    )
      return false;
    return true;
  });
  const [storageWarning, setStorageWarning] = useState(false);
  const [cart, setCart] = useState(() => {
    try {
      return restoreCart(localStorage.getItem(STORAGE_KEY));
    } catch {
      return [];
    }
  });
  const touchStart = useRef(null);
  const categoryNav = useRef(null);
  useEffect(() => {
    const nav = categoryNav.current;
    const selected = nav?.querySelector('[aria-pressed="true"]');
    if (!selected) return;
    const bounds = nav.getBoundingClientRect();
    const tab = selected.getBoundingClientRect();
    nav.scrollTo({ left: nav.scrollLeft + tab.left - bounds.left - (bounds.width - tab.width) / 2, behavior: 'instant' });
  }, [active, search]);
  const products = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    const items = MENU.filter((item) =>
      !query
        ? active === "all" || item.category === active
        : (item.name + " " + item.arabic).toLocaleLowerCase().includes(query),
    );
    return active === "all" && !query
      ? [...items].sort(
          (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
        )
      : items;
  }, [active, search]);
  useReveal(active + "-" + search);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      setStorageWarning(true);
    }
  }, [cart]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);
  const addItem = (item, option) => {
    const line = makeLine(item, option);
    const existing = cart.find((entry) => entry.key === line.key);
    if (existing?.quantity >= MAX_QUANTITY) {
      setToast({ message: "Maximum 99 of each size per order." });
      return;
    }
    setCart((current) =>
      current.some((entry) => entry.key === line.key)
        ? current.map((entry) =>
            entry.key === line.key
              ? {
                  ...entry,
                  quantity: Math.min(MAX_QUANTITY, entry.quantity + 1),
                }
              : entry,
          )
        : [...current, line],
    );
    setToast({ message: item.name + " added to your cart" });
  };
  const updateQty = (key, delta) =>
    setCart((items) =>
      items
        .map((item) =>
          item.key === key
            ? {
                ...item,
                quantity: Math.min(MAX_QUANTITY, item.quantity + delta),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const selectCategory = (id) => {
    setActive(id);
    setSearch("");
  };
  const swipeCategory = (direction) => {
    if (search.trim()) setSearch("");
    const current = Math.max(
      0,
      CATEGORIES.findIndex((category) => category.id === active),
    );
    const next = (current + direction + CATEGORIES.length) % CATEGORIES.length;
    setActive(CATEGORIES[next].id);
  };
  const beginMenuSwipe = (event) => {
    touchStart.current = null;
    if (window.innerWidth > 780 || event.touches.length > 1 ||
        event.target.closest('button, a, input, textarea, .menu-toolbar')) return;
    const touch = event.changedTouches[0];
    if (!touch || touch.clientX < 24 || touch.clientX > window.innerWidth - 24) return;
    touchStart.current = { x: touch.clientX, y: touch.clientY, time: performance.now() };
  };
  const moveMenuSwipe = (event) => {
    const start = touchStart.current;
    const touch = event.touches[0];
    if (!start || !touch) return;
    if (event.touches.length > 1 || (Math.abs(touch.clientY - start.y) > 16 &&
        Math.abs(touch.clientY - start.y) > Math.abs(touch.clientX - start.x))) touchStart.current = null;
  };
  const endMenuSwipe = (event) => {
    const start = touchStart.current;
    touchStart.current = null;
    const touch = event.changedTouches[0];
    if (!start || !touch || performance.now() - start.time > 1000) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.5) swipeCategory(dx < 0 ? 1 : -1);
  };
  const endIntro = useCallback(() => {
    setShowIntro(false);
  }, []);
  return (
    <div className="site" data-category={search.trim() ? "all" : active}>
      <AmbientBackground category={search.trim() ? "all" : active} />
      {showIntro && <Intro finish={endIntro} />}
      <div className="site-content" inert={showIntro ? true : undefined}>
        <a href="#menu" className="skip-link">
          Skip to menu
        </a>
        <Header count={count} openCart={() => setCartOpen(true)} />
        <main>
          <Hero />
          <section className="menu-section container" id="menu"
            onTouchStart={beginMenuSwipe} onTouchMove={moveMenuSwipe} onTouchEnd={endMenuSwipe}
            onTouchCancel={() => { touchStart.current = null; }}>
            <div className="section-heading" data-reveal>
              <img className="category-backdrop" src={CATEGORY_BACKGROUNDS[search.trim() ? "all" : active][0]} alt="" decoding="async" width="640" height="400" />
              <div>
                <span className="eyebrow">Find your feel-good</span>
                <h2>
                  Made for <em>your mood.</em>
                </h2>
                <p>
                  Choose a flavor. Make it yours. Order on WhatsApp.
                </p>
              </div>
              <span className="category-caption"><Citrus size={17}/>{CATEGORIES.find(category => category.id === (search.trim() ? "all" : active)).label}</span>
            </div>
            <div className="menu-toolbar">
              <div
                className="category-nav"
                ref={categoryNav}
                role="group"
                aria-label="Menu categories"
              >
                {CATEGORIES.map((category) => {
                  const Icon = ICONS[category.icon];
                  return (
                    <button
                      key={category.id}
                      aria-pressed={active === category.id && !search.trim()}
                      onClick={() => selectCategory(category.id)}
                    >
                      <Icon size={16} />
                      {category.label}
                    </button>
                  );
                })}
              </div>
              <label className="search-box">
                <Search size={17} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Find a flavor..."
                  aria-label="Search all menu items"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </label>
            </div>
            <div className="menu-meta">
              <span aria-live="polite">
                {search.trim()
                  ? products.length + " results for “" + search.trim() + "”"
                  : products.length + " freshly made favorites"}
              </span>
              <span>All prices in Lebanese pounds (L.L.)</span>
            </div>
            <div className="swipe-hint">
              <ArrowRight size={14} />
              <span aria-live="polite">{CATEGORIES.find(category => category.id === (search.trim() ? "all" : active)).label} · Swipe left or right</span>
            </div>
            <div
              className="menu-grid"
            >
              {products.map((item, index) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  addItem={addItem}
                  index={index}
                />
              ))}
            </div>
            {!products.length && (
              <div className="no-results">
                <Search size={36} />
                <h3>No treats by that name.</h3>
                <p>Try “avocado”, “crepe” or a fruit you love.</p>
                <button
                  className="button button-outline"
                  onClick={() => {
                    setSearch("");
                    setActive("all");
                  }}
                >
                  Show the menu <ArrowRight size={16} />
                </button>
              </div>
            )}
            <p className="menu-footnote">
              Images are illustrative. Tell us about any allergies before
              ordering.
            </p>
          </section>
        </main>
        <Footer />
        {count > 0 && (
          <button
            className="floating-cart"
            onClick={() => setCartOpen(true)}
            aria-label="View your order"
          >
            <span>
              <ShoppingBag size={19} />
              <b>{count}</b> View order
            </span>
            <strong>{money(totalPrice(cart))}</strong>
            <ArrowUpRight size={17} />
          </button>
        )}
      </div>
      <CartDrawer
        open={cartOpen}
        close={() => setCartOpen(false)}
        cart={cart}
        updateQty={updateQty}
        remove={(key) =>
          setCart((items) => items.filter((item) => item.key !== key))
        }
        clear={() => setCart([])}
      />
      <div
        className={"toast " + (toast ? "show" : "")}
        role="status"
        aria-live="polite"
      >
        {toast && (
          <>
            <span>
              <Check size={17} />
            </span>
            {toast.message}
          </>
        )}
      </div>
      {storageWarning && (
        <div className="storage-warning" role="status">
          Your cart works, but this browser can’t save it for your next visit.
          <button
            aria-label="Dismiss notice"
            onClick={() => setStorageWarning(false)}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
