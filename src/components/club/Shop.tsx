"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { CLUB_PRODUCTS, formatEuro } from "@/lib/club-products";
import { useCart } from "./CartProvider";
import styles from "./Shop.module.css";

export default function Shop() {
  const { addItem } = useCart();

  return (
    <section className={styles.collection} id="collection" aria-labelledby="collection-title">
      <div className={styles.collectionInner}>
        <p className={styles.eyebrow}>04 / La collection</p>
        <div className={styles.sectionHeading}>
          <h2 id="collection-title">L’esprit du club.<br />À emporter.</h2>
          <div className={styles.headingAside}>
            <p>Un détail rouge. Un signe de reconnaissance. La passion se porte aussi au quotidien.</p>
            <span>Collection concept — articles et tarifs de démonstration</span>
          </div>
        </div>

        <div className={styles.products}>
          {CLUB_PRODUCTS.map((product, index) => (
            <article className={styles.product} key={product.id}>
              <div className={styles.productImage}>
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                />
                <span className={styles.productIndex}>Objet 0{index + 1}</span>
                <span className={styles.productConcept}>Concept</span>
              </div>
              <div className={styles.productHeading}>
                <h3>{product.name}</h3>
                <span>{formatEuro(product.price)}</span>
              </div>
              <p className={styles.productDetail}>{product.detail}</p>
              <button
                type="button"
                className={styles.addButton}
                onClick={() => addItem(product.id)}
                aria-label={`Ajouter ${product.name} au panier de démonstration`}
              >
                Ajouter au panier <Plus size={18} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
