import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getTranslations } from "next-intl/server";

export default async function PrivacyPage() {
  const t = await getTranslations("legal");

  return (
    <div className="flex min-h-screen flex-col bg-shironeri">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl px-4 py-16">
        <div className="mb-10 space-y-2">
          <div className="h-px w-12 bg-beni" />
          <h1 className="text-3xl font-light text-sumi">{t("privacy")}</h1>
          <p className="text-sm text-ginnezumi">Última actualización: Marzo 2026</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-ginnezumi">
          <section className="space-y-3">
            <h2 className="text-base font-medium text-sumi">1. Datos que recopilamos</h2>
            <p>Al usar DevMinds Links recopilamos:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li><strong>Cuenta:</strong> nombre, email e imagen de perfil (provistos por Google OAuth).</li>
              <li><strong>Links:</strong> URLs destino, títulos y configuración de página.</li>
              <li><strong>Analytics:</strong> País de origen, tipo de dispositivo, navegador, referer y timestamp de cada visita. Las IPs se almacenan hasheadas (SHA-256) — nunca en texto plano.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-medium text-sumi">2. Cómo usamos los datos</h2>
            <ul className="ml-4 list-disc space-y-1">
              <li>Para mostrar estadísticas de clicks al creador del link.</li>
              <li>Para proteger el servicio contra abuso (rate limiting por IP hasheada).</li>
              <li>Para autenticación mediante Google OAuth.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-medium text-sumi">3. Privacidad de visitantes</h2>
            <p>
              Las IPs de los visitantes nunca se almacenan en texto plano.
              Usamos un hash unidireccional (SHA-256) para conteo de visitas únicas
              sin poder identificar a ningún individuo. No vendemos ni compartimos
              datos con terceros.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-medium text-sumi">4. Retención de datos</h2>
            <p>
              Los datos de analytics se retienen mientras el link esté activo.
              Al eliminar un link, todos sus datos de clicks se eliminan en cascada.
              Puedes eliminar tu cuenta en cualquier momento contactándonos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-medium text-sumi">5. Cookies</h2>
            <p>
              Usamos una cookie de sesión para mantener tu login activo y
              una cookie de preferencia de idioma. No usamos cookies de rastreo
              ni publicidad de terceros.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
