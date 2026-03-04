import { ArrowRight, MapPin, Star } from "lucide-react";
import { motion } from "motion/react";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

interface HomeProps {
  onNavigate: (path: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen">
      <Header currentHash="/" />

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        {/* Background accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 70% 40%, rgba(199,163,90,0.04) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 20% 80%, rgba(26,11,16,0.5) 0%, transparent 50%)",
          }}
        />

        {/* Decorative vertical line */}
        <div
          className="absolute left-6 md:left-12 top-1/4 h-48 w-px"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(199,163,90,0.3), transparent)",
          }}
        />

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center w-full">
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p
              className="gold-label mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Premium Sushi · Rīga
            </motion.p>

            <motion.h1
              className="font-serif mb-6 leading-tight"
              style={{
                fontSize: "clamp(3.5rem, 10vw, 7rem)",
                color: "#F3F0E6",
                letterSpacing: "-0.02em",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              SETE
            </motion.h1>

            <motion.p
              className="font-serif text-xl md:text-2xl mb-3"
              style={{
                color: "rgba(243,240,230,0.75)",
                fontWeight: 300,
                letterSpacing: "0.02em",
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              Michelin līmeņa sushi.
            </motion.p>

            <motion.p
              className="text-sm mb-10"
              style={{
                color: "rgba(243,240,230,0.45)",
                letterSpacing: "0.08em",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.7 }}
            >
              Pasūtī tiešsaistē. Saņem vai pievedīnām.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
            >
              <button
                type="button"
                className="btn-gold flex items-center gap-2"
                onClick={() => onNavigate("/offers")}
                data-ocid="home.cta_button"
              >
                Apskatīt piedāvājumus
                <ArrowRight size={16} />
              </button>
            </motion.div>

            {/* Address badge */}
            <motion.div
              className="mt-10 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <MapPin size={13} style={{ color: "rgba(199,163,90,0.6)" }} />
              <span
                className="text-xs"
                style={{
                  color: "rgba(243,240,230,0.35)",
                  letterSpacing: "0.06em",
                }}
              >
                Blaumaņa iela 34-2, Rīga
              </span>
            </motion.div>
          </motion.div>

          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden md:block"
          >
            <div className="image-frame" style={{ borderRadius: "4px" }}>
              <img
                src="/assets/generated/sete-01-placeholder.dim_1200x800.jpg"
                alt="SETE Premium Sushi"
                className="w-full h-80 object-cover"
                style={{ display: "block" }}
                loading="eager"
              />
            </div>
            {/* Decorative gold dot */}
            <div
              className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(199,163,90,0.08) 0%, transparent 70%)",
                border: "1px solid rgba(199,163,90,0.15)",
              }}
            />
          </motion.div>
        </div>

        {/* Bottom scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <div
            className="w-px h-12"
            style={{
              background:
                "linear-gradient(180deg, rgba(199,163,90,0.5), transparent)",
            }}
          />
        </motion.div>
      </section>

      {/* About section */}
      <section className="suede-section py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                num: "01",
                title: "Svaigums",
                text: "Ikdienas piegādes no uzticamiem piegādātājiem. Tikai svaigākās sastāvdaļas.",
              },
              {
                num: "02",
                title: "Meistarsklase",
                text: "Sushi šefi ar vairāk nekā 10 gadu pieredzi Japānas un Eiropas virtuvē.",
              },
              {
                num: "03",
                title: "Kompleksi",
                text: "Rūpīgi veidoti seti 2–6 personām. Ideāli vakaram, sanāksmei vai svinībām.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="space-y-4"
              >
                <span
                  className="font-serif text-5xl"
                  style={{
                    color: "rgba(199,163,90,0.25)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {item.num}
                </span>
                <h3
                  className="font-serif text-xl"
                  style={{
                    color: "#F3F0E6",
                    fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(243,240,230,0.55)" }}
                >
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured offer teaser */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="gold-label mb-4">Mūsu piedāvājumi</p>
            <h2
              className="font-serif"
              style={{ color: "#F3F0E6", fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              Rūpīgi veidoti komplekti
            </h2>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <button
              type="button"
              className="btn-ghost-gold flex items-center gap-2"
              onClick={() => onNavigate("/offers")}
            >
              Skatīt visus piedāvājumus
              <ArrowRight size={15} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Review / social proof strip */}
      <section className="py-12 suede-section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 text-center">
            {[
              { value: "48+", label: "Gabali katrā setā" },
              { value: "4.9★", label: "Klientu vērtējums" },
              { value: "60min", label: "Piegādes laiks" },
            ].map((stat, idx) => (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <div
                  className="font-serif text-3xl mb-1"
                  style={{
                    color: "#C7A35A",
                    fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs"
                  style={{
                    color: "rgba(243,240,230,0.45)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
