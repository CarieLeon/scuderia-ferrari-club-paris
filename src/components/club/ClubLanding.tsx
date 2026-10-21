"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Menu, Minus, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CartButton, CartProvider } from "./CartProvider";
import Shop from "./Shop";
import ScrollCarHero from "./ScrollCarHero";
import styles from "./ClubLanding.module.css";

const experiences = [
  { number: "01", category: "SUR LA ROUTE", title: "L’échappée belle.", text: "Sortir de Paris. Suivre une belle route. Partager le plaisir de conduire, tout simplement.", image: "/images/hero/IMG_8668-scaled.jpg", alt: "Ferrari du club en balade dans Paris", href: "/evenements#rassemblement-ferrari-3", tag: "Rassemblements & escapades" },
  { number: "02", category: "AUTOUR DE LA TABLE", title: "Le goût du partage.", text: "Une escale en Champagne, une rencontre, une belle table. La passion a aussi ses saveurs.", image: "/images/champagne-2016/1-Week-end-Champagne-2016-Scuderia-Ferrari-Club.jpg", alt: "Rencontre des membres du club sur une terrasse en Champagne", href: "/evenements#week-end-champagne-2016", tag: "Rencontres & art de vivre" },
  { number: "03", category: "AU PLUS PRÈS DU MYTHE", title: "L’émotion mécanique.", text: "Des modèles d’exception, des histoires à écouter et un regard privilégié sur l’univers Ferrari.", image: "/images/hero/KBRossocorsaday-II-0670-scaled.jpg", alt: "Ferrari anciennes et contemporaines réunies lors d’un événement du club", href: "/galerie", tag: "Héritage & découvertes" },
];

const faqs = [
  { question: "Faut-il posséder une Ferrari pour rejoindre le club ?", answer: "La passion du Cheval Cabré est le point de départ. Le club accueille aussi les passionnés qui ne possèdent pas de Ferrari. Les conditions d’accès aux sorties dépendent de la formule choisie : retrouvez tous les détails sur la page Adhésion." },
  { question: "Comment se déroule l’adhésion ?", answer: "Choisissez la formule qui vous correspond, puis complétez le formulaire d’adhésion existant. L’équipe du club vous accompagne pour finaliser votre inscription et vous présenter les rencontres proposées." },
  { question: "Les articles de la collection sont-ils disponibles à l’achat ?", answer: "La collection présentée ici est un concept pour cette nouvelle version du site. Les visuels et tarifs sont illustratifs. Le panier permet uniquement de tester le parcours : aucune commande réelle et aucun paiement ne sont effectués." },
];

function Brand({ footer = false }: { footer?: boolean }) {
  return <Link href="/" className={styles.brand} aria-label="Scuderia Ferrari Club Paris, accueil">
    <span className={styles.brandMark} aria-hidden="true"><span>SFC</span><i /></span>
    <span className={styles.brandText}>SCUDERIA FERRARI<span>CLUB <b>PARIS</b>{footer && <small>LA PASSION, ENSEMBLE.</small>}</span></span>
  </Link>;
}

function LandingHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 30);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  const links = [{ href: "/#le-club", text: "Le club" }, { href: "/#experiences", text: "Les expériences" }, { href: "/#collection", text: "La collection" }];
  return <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
    <Brand />
    <nav className={styles.desktopNav} aria-label="Navigation principale">{links.map(link => <a key={link.href} href={link.href}>{link.text}</a>)}</nav>
    <div className={styles.headerActions}>
      <Link href="/adhesion" className={styles.joinLink}>Rejoindre le club <ArrowUpRight size={15} /></Link>
      <CartButton className={styles.cartButton} />
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild><button className={styles.menuButton} aria-label="Ouvrir le menu"><Menu size={23} /></button></Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.menuOverlay} />
          <Dialog.Content className={styles.mobileMenu}>
            <Dialog.Title className={styles.menuTitle}>SCUDERIA FERRARI CLUB PARIS</Dialog.Title>
            <Dialog.Description className={styles.srOnly}>Naviguez dans l’univers du club.</Dialog.Description>
            <Dialog.Close className={styles.menuClose} aria-label="Fermer le menu"><X size={25} /></Dialog.Close>
            <nav aria-label="Navigation mobile">{links.map((link, i) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}><span>0{i + 1}</span>{link.text}<ArrowUpRight size={23} /></a>)}</nav>
            <Link href="/adhesion" className={styles.redButton} onClick={() => setOpen(false)}>Rejoindre le club <ArrowUpRight size={18} /></Link>
            <Link href="/contact" className={styles.menuContact} onClick={() => setOpen(false)}>Parlons de votre passion <ArrowRight size={16} /></Link>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  </header>;
}

function LandingContent() {
  const root = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  useEffect(() => {
    const elements = root.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!elements || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add(styles.revealed); observer.unobserve(entry.target); } }), { threshold: 0.08 });
    elements.forEach(element => { element.classList.add(styles.willReveal); observer.observe(element); });
    return () => observer.disconnect();
  }, []);

  return <div className={styles.root} ref={root} id="top">
    <a className={styles.skipLink} href="#le-club">Aller au contenu</a>
    <LandingHeader />
    <main>
      <ScrollCarHero />
      <div className={styles.manifestoBar} aria-label="Les valeurs du club"><span>UNE MÊME PASSION</span><i /><span>DES RENCONTRES VRAIES</span><i /><span>L’ÉMOTION FERRARI</span><i /><span>L’ART DE VIVRE À PARIS</span><i /><span>FORZA, INSIEME.</span></div>
      <section id="le-club" className={styles.clubSection}>
        <div className={styles.sectionEyebrow} data-reveal><span>01 / LE CLUB</span><span>UNE HISTOIRE DE PASSIONNÉS</span></div>
        <div className={styles.clubGrid}>
          <div className={styles.clubHeading} data-reveal><h2>Bien plus<br />qu’un emblème.<br /><em>Un lien.</em></h2><Link href="/presentation" className={styles.textLink}>Notre histoire <ArrowUpRight size={19} /></Link></div>
          <div className={styles.clubBody} data-reveal><span className={styles.miniTricolor}><i /><i /><i /></span><p>Il y a ceux qui admirent Ferrari.<br />Et ceux qui la vivent <strong>ensemble.</strong></p><p className={styles.bodyCopy}>Depuis 2010, le Scuderia Ferrari Club Paris réunit celles et ceux qui partagent la passion du Cheval Cabré. Des routes d’Île-de-France aux rencontres autour d’une belle table, nous cultivons le goût des belles mécaniques et des moments partagés.</p><p className={styles.bodyCopy}>Propriétaires ou passionnés, une même émotion nous rassemble. Et chaque rencontre écrit la suite de l’histoire.</p><div className={styles.clubFacts}><div><strong>2010</strong><span>LA NAISSANCE DU CLUB</span></div><div><strong>2012</strong><span>LA RECONNAISSANCE OFFICIELLE</span></div></div></div>
        </div>
      </section>
      <section id="experiences" className={styles.experienceSection}>
        <div className={styles.sectionEyebrow} data-reveal><span>02 / LES EXPÉRIENCES</span><span>LA PASSION SE VIT</span></div>
        <div className={styles.sectionHeading} data-reveal><h2>Le frisson.<br /><span>Et tout ce qui va avec.</span></h2><Link href="/evenements" className={styles.textLink}>La vie du club <ArrowUpRight size={19} /></Link></div>
        <div className={styles.experienceGrid}>{experiences.map(experience => <Link href={experience.href} className={styles.experienceCard} key={experience.number} data-reveal><div className={styles.experienceImage}><Image src={experience.image} alt={experience.alt} fill sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 33vw" /><span className={styles.experienceNumber}>{experience.number}</span><span className={styles.experienceTag}>{experience.tag}</span><span className={styles.experienceArrow}><ArrowUpRight size={21} /></span></div><div className={styles.experienceCardText}><span>{experience.category}</span><h3>{experience.title}</h3><p>{experience.text}</p></div></Link>)}</div>
        <p className={styles.archiveNote}>Images issues des rencontres du club. Retrouvez les souvenirs et les détails dans nos archives.</p>
      </section>
      <section className={styles.passionBanner} aria-labelledby="passion-title"><div className={styles.bannerImage}><Image src="/images/hero/KB-_MG_2922-scaled.jpg" alt="Ferrari lors d’une rencontre du club" fill sizes="100vw" /></div><div className={styles.bannerContent} data-reveal><span>03 / L’ESPRIT SCUDERIA</span><h2 id="passion-title">On vient pour Ferrari.<br /><em>On reste pour les rencontres.</em></h2><Link href="/galerie" className={styles.outlineButton}>Le club en images <ArrowUpRight size={18} /></Link></div><span className={styles.bannerCaption}>PASSION ITALIENNE. CONVIVIALITÉ PARISIENNE.</span></section>
      <Shop />
      <section id="rejoindre" className={styles.joinSection}>
        <div className={styles.sectionEyebrow}><span>05 / REJOIGNEZ L’HISTOIRE</span><span>VOTRE PLACE EST PARMI NOUS</span></div>
        <div className={styles.joinGrid} data-reveal><div><span className={styles.redDot} /><h2>Le prochain chapitre,<br /><em>c’est avec vous.</em></h2><p>La passion n’a de sens que si elle se partage.<br />Faites connaissance avec le club.</p><Link href="/adhesion" className={styles.redButton}>Devenir membre <ArrowUpRight size={19} /></Link><Link href="/contact" className={styles.joinContact}>Une question ? Écrivez-nous <ArrowRight size={15} /></Link></div><div className={styles.membershipNote}><span>LA PASSION POUR POINT DE DÉPART</span><h3>Propriétaire.<br />Supporter.<br /><em>Passionné.</em></h3><p>Découvrez les formules d’adhésion et celle qui correspond à votre façon de vivre Ferrari.</p><div><Check size={17} /><span>Des rencontres autour du Cheval Cabré</span></div><div><Check size={17} /><span>Une communauté à découvrir</span></div><div><Check size={17} /><span>Un accueil pour chaque passion</span></div></div></div>
      </section>
      <section className={styles.faqSection}><div data-reveal><span className={styles.sectionEyebrow}>AVANT DE PRENDRE LA ROUTE</span><h2>Quelques repères.</h2></div><div className={styles.faqList}>{faqs.map((faq, index) => <div className={styles.faqItem} key={faq.question}><h3><button aria-expanded={openFaq === index} aria-controls={`faq-answer-${index}`} id={`faq-question-${index}`} onClick={() => setOpenFaq(value => value === index ? null : index)}>{faq.question}{openFaq === index ? <Minus size={20} /> : <Plus size={20} />}</button></h3><div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} hidden={openFaq !== index}><p>{faq.answer}</p>{index < 2 && <Link href="/adhesion">Découvrir les formules <ArrowUpRight size={14} /></Link>}</div></div>)}</div></section>
    </main>
    <footer className={styles.footer}><div className={styles.footerTop}><Brand footer /><p>Un emblème.<br />Une ville. Une passion.</p><Link href="/contact">PARLONS FERRARI <ArrowUpRight size={19} /></Link></div><div className={styles.footerLinks}><span>PARIS, FRANCE <i /></span><nav aria-label="Liens de pied de page"><Link href="/presentation">Le club</Link><Link href="/evenements">Événements</Link><Link href="/galerie">Galerie</Link><Link href="/partenaires">Partenaires</Link><Link href="/contact">Contact</Link></nav><a href="#top">Retour en haut <ArrowUpRight size={15} /></a></div><div className={styles.footerLegal}><p>© {new Date().getFullYear()} Scuderia Ferrari Club Paris</p><p>Ferrari et le Cheval Cabré sont des marques de Ferrari S.p.A.</p><span>FORZA FERRARI. SEMPRE.</span></div></footer>
  </div>;
}

export default function ClubLanding() {
  return <CartProvider><LandingContent /></CartProvider>;
}
