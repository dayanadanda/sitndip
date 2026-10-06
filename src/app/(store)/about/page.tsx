export default function AboutPage() {
  return (
    <div>
      <section className="relative h-[42vw] min-h-[280px] max-h-[420px] overflow-hidden">
        <img src="/images/hero-sweet.jpg" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <h1 className="logo-mark text-5xl md:text-6xl">About Us</h1>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-muted">Our story</p>
        <h2 className="logo-mark mt-3 text-4xl">Sit down. Dip in.</h2>
        <p className="mt-6 text-left text-[15px] leading-8 text-muted md:text-center">
          We are pleased to introduce SitnDip, an international brand recognized for high quality and distinctive chocolate spreads. Our products are manufactured by Foodient, a leading company in the food industry and an ISO-certified manufacturer.
        </p>
        <p className="mt-4 text-left text-[15px] leading-8 text-muted md:text-center">
          This certification reflects our commitment to the highest standards of hygiene, food safety, and manufacturing quality. Every SitnDip cup is made in Lebanon — hazelnut chocolate, pistachio, Lotus, cookies and cream, and more.
        </p>
      </article>

      <section className="grid md:grid-cols-3">
        {[
          { image: "/images/hazelnut-tub.png", title: "ISO certified", text: "Manufactured to international hygiene and food-safety standards." },
          { image: "/images/pistachio-tub.png", title: "Made in Lebanon", text: "All SitnDip products are manufactured in Lebanon." },
          { image: "/images/lotus-tub.png", title: "Retail and wholesale", text: "½ KG cups for the shelf, 6 KG tubs for shops and kitchens." },
        ].map((item) => (
          <div key={item.title} className="border-t border-line px-8 py-12 text-center">
            <img src={item.image} alt="" className="mx-auto h-40 w-40 object-contain" />
            <h3 className="mt-4 text-lg">{item.title}</h3>
            <p className="mt-2 text-sm text-muted">{item.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
