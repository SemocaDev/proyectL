import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getTranslations } from "next-intl/server";

export default async function TermsPage() {
  const t = await getTranslations("legal");

  return (
    <div className="flex min-h-screen flex-col bg-shironeri">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl px-4 py-16">
        <div className="mb-10 space-y-2">
          <div className="h-px w-12 bg-beni" />
          <h1 className="text-3xl font-light text-sumi">{t("terms")}</h1>
          <p className="text-sm text-ginnezumi">Última actualización: Marzo 2026</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-ginnezumi">
          <section className="space-y-3">
            <h2 className="text-base font-medium text-sumi">1. Uso del servicio</h2>
            <p>
              DevMinds Links es una plataforma de acortamiento de URLs y páginas
              de enlaces. Al usar este servicio, aceptas no utilizarlo para
              actividades ilegales o dañinas.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-medium text-sumi">2. Contenido prohibido</h2>
            <p>Está estrictamente prohibido usar este servicio para distribuir o enlazar:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Material de abuso sexual infantil (CSAM) o cualquier contenido que involucre menores de forma sexual.</li>
              <li>Contenido de grooming o acoso a menores.</li>
              <li>Estafas (phishing, fraude financiero, suplantación de identidad).</li>
              <li>Malware, virus o software malicioso.</li>
              <li>Contenido ilegal bajo las leyes de Colombia o el país del usuario.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-medium text-sumi">3. Contenido permitido</h2>
            <p>
              El contenido adulto legal (plataformas como OnlyFans, sitios para adultos
              verificados) está permitido bajo la responsabilidad exclusiva del creador
              del link. El usuario debe asegurarse de cumplir con las leyes locales
              aplicables.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-medium text-sumi">4. Moderación</h2>
            <p>
              Nos reservamos el derecho de deshabilitar cualquier link que viole estos
              términos, sin previo aviso. Los links reportados por la comunidad serán
              revisados por nuestro equipo de moderación.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-medium text-sumi">5. Responsabilidad</h2>
            <p>
              DevMinds Links actúa como intermediario técnico. No somos responsables
              del contenido al que los links redirigen. La responsabilidad recae
              íntegramente en el creador del link.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
