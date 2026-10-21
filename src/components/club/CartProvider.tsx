"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, Check, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useLenis } from "lenis/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CLUB_PRODUCTS, formatEuro } from "@/lib/club-products";
import styles from "./Shop.module.css";

type CartLine = { productId: string; quantity: number };
type CartContextValue = {
  count: number;
  isOpen: boolean;
  addItem: (productId: string) => void;
  openCart: () => void;
};

const STORAGE_KEY = "club-paris-demo-cart-v1";
const MAX_QUANTITY = 20;
const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartLine[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(value)) return [];
    const quantities = new Map<string, number>();
    for (const item of value) {
      if (
        item !== null &&
        typeof item === "object" &&
        typeof item.productId === "string" &&
        CLUB_PRODUCTS.some((product) => product.id === item.productId) &&
        typeof item.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
      ) {
        quantities.set(
          item.productId,
          Math.min(MAX_QUANTITY, (quantities.get(item.productId) ?? 0) + item.quantity),
        );
      }
    }
    return Array.from(quantities, ([productId, quantity]) => ({ productId, quantity }));
  } catch {
    // Private browsing or malformed storage must not prevent the demo from working.
    return [];
  }
}

export function useCart(): CartContextValue {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}

export function CartButton({ className }: { className?: string }) {
  const { count, isOpen, openCart } = useCart();
  return (
    <button
      type="button"
      className={[styles.cartTrigger, className].filter(Boolean).join(" ")}
      onClick={openCart}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls="club-cart-dialog"
      aria-label={`Ouvrir le panier de démonstration, ${count} article${count > 1 ? "s" : ""}`}
    >
      <ShoppingBag size={19} strokeWidth={1.5} aria-hidden="true" />
      <span className={styles.cartCount}>{count}</span>
    </button>
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    setLines(readStoredCart());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // The in-memory cart remains functional if browser storage is unavailable.
    }
  }, [isReady, lines]);

  useEffect(() => {
    if (!isOpen || !lenis) return;
    const shouldResume = !lenis.isStopped;
    lenis.stop();
    return () => {
      if (shouldResume) lenis.start();
    };
  }, [isOpen, lenis]);

  const openCart = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      lastFocusedElement.current = document.activeElement;
    }
    setIsComplete(false);
    setIsOpen(true);
  }, []);

  const addItem = useCallback((productId: string) => {
    if (!CLUB_PRODUCTS.some((product) => product.id === productId)) return;
    setLines((previous) => {
      const existing = previous.find((line) => line.productId === productId);
      return existing
        ? previous.map((line) => line.productId === productId
          ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + 1) }
          : line)
        : [...previous, { productId, quantity: 1 }];
    });
    openCart();
  }, [openCart]);

  const changeQuantity = (productId: string, delta: number) => {
    setLines((previous) => previous.map((line) => line.productId === productId
      ? { ...line, quantity: Math.min(MAX_QUANTITY, Math.max(1, line.quantity + delta)) }
      : line));
  };

  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const total = lines.reduce((sum, line) => {
    const product = CLUB_PRODUCTS.find((item) => item.id === line.productId);
    return sum + (product?.price ?? 0) * line.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ count, isOpen, addItem, openCart }}>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen} modal>
        {children}
        <Dialog.Portal>
          <Dialog.Overlay className={styles.cartOverlay} />
          <Dialog.Content
            id="club-cart-dialog"
            className={styles.cartDialog}
            data-lenis-prevent
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              lastFocusedElement.current?.focus({ preventScroll: true });
            }}
          >
            <div className={styles.cartHeader}>
              <div>
                <p className={styles.cartEyebrow}>La collection / Concept</p>
                <Dialog.Title className={styles.cartTitle}>Votre panier<span> ({count})</span></Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button className={styles.iconButton} type="button" aria-label="Fermer le panier">
                  <X size={23} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Description className={styles.cartDescription}>
              Une collection de démonstration. Aucun achat ni paiement réel.
            </Dialog.Description>

            {isComplete ? (
              <div className={styles.cartEmpty} role="status">
                <span className={styles.successIcon}><Check size={28} strokeWidth={1.5} aria-hidden="true" /></span>
                <h3>La passion continue.</h3>
                <p>Votre commande fictive a été simulée et votre panier vidé. Aucun paiement n’a été effectué.</p>
                <Dialog.Close asChild>
                  <button type="button" className={styles.checkoutButton}>Continuer la visite <ArrowUpRight size={18} aria-hidden="true" /></button>
                </Dialog.Close>
              </div>
            ) : lines.length === 0 ? (
              <div className={styles.cartEmpty}>
                <ShoppingBag size={38} strokeWidth={1} aria-hidden="true" />
                <h3>À vous de jouer.</h3>
                <p>Votre panier est encore vide. Emportez un peu de l’esprit du club.</p>
                <Dialog.Close asChild>
                  <button type="button" className={styles.checkoutButton}>Continuer la visite <ArrowUpRight size={18} aria-hidden="true" /></button>
                </Dialog.Close>
              </div>
            ) : (
              <>
                <ul className={styles.cartItems} aria-label="Articles du panier">
                  {lines.map((line) => {
                    const product = CLUB_PRODUCTS.find((item) => item.id === line.productId);
                    if (!product) return null;
                    return (
                      <li key={product.id} className={styles.cartItem}>
                        <div className={styles.cartItemImage}>
                          <Image src={product.image} alt={product.imageAlt} fill sizes="96px" />
                        </div>
                        <div className={styles.cartItemBody}>
                          <div className={styles.cartItemHeading}>
                            <h3>{product.name}</h3>
                            <span>{formatEuro(product.price * line.quantity)}</span>
                          </div>
                          <p>{product.id === "tshirt-club-paris" ? "Concept · Unisexe, taille L" : "Article de démonstration"}</p>
                          <div className={styles.cartItemActions}>
                            <div className={styles.quantityControl} aria-label={`Quantité de ${product.name}`}>
                              <button type="button" disabled={line.quantity <= 1} onClick={() => changeQuantity(product.id, -1)} aria-label={`Diminuer la quantité de ${product.name}`}><Minus size={14} aria-hidden="true" /></button>
                              <span aria-live="polite" aria-atomic="true">{line.quantity}</span>
                              <button type="button" disabled={line.quantity >= MAX_QUANTITY} onClick={() => changeQuantity(product.id, 1)} aria-label={`Augmenter la quantité de ${product.name}`}><Plus size={14} aria-hidden="true" /></button>
                            </div>
                            <button className={styles.removeButton} type="button" onClick={() => setLines((previous) => previous.filter((item) => item.productId !== product.id))} aria-label={`Retirer ${product.name} du panier`}><Trash2 size={15} strokeWidth={1.5} aria-hidden="true" /><span>Retirer</span></button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className={styles.cartFooter}>
                  <div className={styles.cartTotal} aria-live="polite" aria-atomic="true"><span>Total de démonstration</span><strong>{formatEuro(total)}</strong></div>
                  <p>Les articles et les prix sont fictifs. Cette simulation ne crée aucune commande.</p>
                  <button className={styles.checkoutButton} type="button" onClick={() => { setLines([]); setIsComplete(true); }}>Simuler la commande <ArrowUpRight size={19} aria-hidden="true" /></button>
                  <span className={styles.noPayment}>Sans paiement · Sans coordonnées bancaires</span>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </CartContext.Provider>
  );
}
