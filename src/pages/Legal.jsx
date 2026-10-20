import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LEGAL_ENTITY, LEGAL_URLS, CONSENT_VERSION } from '../constants/legal.js';
import { MAX_DEBT_TO_INCOME, MAX_DEBT_TO_SALES } from '../engine/finance.js';

// Páginas legales: política de datos, términos y cómo recomendamos.
// Los datos del responsable salen de LEGAL_ENTITY para no repetirlos en tres lugares.

const PENDING = '[pendiente]';
// Nombre, documento y ciudad son opcionales por ahora; el correo es obligatorio (lo verifica Legal.test.jsx).
const operator = [LEGAL_ENTITY.name, LEGAL_ENTITY.document].filter(Boolean).join(', ');

const versionLabel = new Date(`${CONSENT_VERSION}T12:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });

const EmailLink = ({ subject }) => LEGAL_ENTITY.email
  ? <a href={`mailto:${LEGAL_ENTITY.email}?subject=${encodeURIComponent(subject)}`} className="text-cyan-700 underline">{LEGAL_ENTITY.email}</a>
  : <span>{PENDING}</span>;

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
    <div className="text-gray-700 space-y-3 leading-relaxed">{children}</div>
  </section>
);

const List = ({ items }) => (
  <ul className="list-disc pl-5 space-y-1.5">
    {items.map((item, i) => <li key={i}>{item}</li>)}
  </ul>
);

function LegalLayout({ title, children }) {
  useEffect(() => {
    document.title = `${title} | Banqueando`;
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-stone-100 px-4 py-10">
      <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-12">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <img src="/logo.png" alt="" className="w-10 h-10 object-contain" />
          <span className="font-bold text-gray-900">Banqueando</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-sm text-gray-500 mb-10">Vigente desde el {versionLabel}</p>
        {children}
        <nav className="border-t border-gray-200 pt-6 mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link to={LEGAL_URLS.privacy} className="text-cyan-700 hover:underline">Política de datos</Link>
          <Link to={LEGAL_URLS.terms} className="text-cyan-700 hover:underline">Términos y condiciones</Link>
          <Link to={LEGAL_URLS.howWeRecommend} className="text-cyan-700 hover:underline">Cómo recomendamos</Link>
          <Link to="/" className="text-gray-500 hover:underline">Volver al inicio</Link>
        </nav>
      </article>
    </div>
  );
}

export function Privacy() {
  return (
    <LegalLayout title="Política de tratamiento de datos personales">
      <p className="text-gray-700 mb-8 leading-relaxed">
        Esta política explica qué datos recogemos en Banqueando, para qué los usamos y cómo puedes consultarlos,
        corregirlos o pedir que los borremos, según la Ley 1581 de 2012 y el Decreto 1377 de 2013 (incorporado en el Decreto 1074 de 2015).
      </p>

      <Section title="1. Quién es el responsable">
        <List items={[
          <>Responsable: <strong>{operator || 'Banqueando'}</strong>{LEGAL_ENTITY.city ? `, con domicilio en ${LEGAL_ENTITY.city}` : ''}.</>,
          <>Correo para consultas, reclamos y borrado de datos: <EmailLink subject="Solicitud sobre mis datos personales" />.</>
        ]} />
      </Section>

      <Section title="2. Qué datos recogemos">
        <List items={[
          <><strong>Obligatorios para ver tu resultado:</strong> número de WhatsApp y correo electrónico.</>,
          <><strong>Opcionales:</strong> nombre, rango de edad, género y ciudad.</>,
          <><strong>Respuestas del quiz:</strong> por ejemplo, rango de ingresos, cómo describes tu historial crediticio, cómo pagas tu tarjeta, cuánto necesitas prestado y, si es para tu negocio, sus ventas y antigüedad aproximadas.</>,
          <><strong>Uso del sitio:</strong> en qué paso del quiz vas, en qué producto das clic en «Solicitar» y el tipo de dispositivo. Mientras haces el quiz se guarda sin tus datos de contacto; cuando te registras, queda asociado a tu resultado.</>
        ]} />
        <p>
          No pedimos documentos, contraseñas ni datos de tus cuentas, y <strong>no consultamos centrales de riesgo</strong>:
          trabajamos solo con lo que tú respondes. No pedimos datos sensibles (salud, origen, religión, opinión política, biometría).
          El servicio no está dirigido a menores de 18 años.
        </p>
      </Section>

      <Section title="3. Para qué los usamos">
        <p>Con la autorización que das al ver tu resultado (obligatoria para usar el servicio):</p>
        <List items={[
          'Calcular y mostrarte las tarjetas o créditos que mejor se ajustan a tus respuestas.',
          'Contactarte por WhatsApp o correo sobre tu resultado, por ejemplo para preguntarte si solicitaste el producto y si te lo aprobaron.',
          'Hacer estadísticas y mejorar el algoritmo de recomendación. Cuando mostramos o compartimos cifras, van agregadas y sin datos que te identifiquen.'
        ]} />
        <p>Solo si marcas la casilla opcional:</p>
        <List items={['Enviarte por WhatsApp o correo ofertas y novedades de tarjetas y créditos que puedan servirte.']} />
        <p>Puedes retirar cualquiera de estas autorizaciones cuando quieras, escribiendo al correo de la sección 1.</p>
      </Section>

      <Section title="4. Con quién los compartimos">
        <p>
          <strong>No vendemos ni compartimos tus datos personales con bancos, fintechs ni otras empresas.</strong> Si en el futuro
          quisiéramos hacerlo, te pediremos antes una autorización nueva y separada, y podrás decir que no.
        </p>
        <p>
          Cuando das clic en "Solicitar", te llevamos al sitio oficial de la entidad. No le enviamos tus datos: lo que llenes allá
          queda bajo la política de esa entidad.
        </p>
        <p>
          Para funcionar usamos proveedores de tecnología que guardan la información por cuenta nuestra y bajo nuestras
          instrucciones: Supabase (base de datos, con servidores en São Paulo, Brasil) y Vercel (alojamiento del sitio, Estados Unidos).
          Al aceptar esta política autorizas esa transmisión de datos fuera de Colombia.
        </p>
      </Section>

      <Section title="5. Tus derechos">
        <List items={[
          'Conocer, actualizar y corregir tus datos.',
          'Pedir prueba de la autorización que nos diste.',
          'Saber cómo hemos usado tus datos.',
          'Retirar la autorización y pedir que borremos tus datos, siempre que no exista un deber legal de conservarlos.',
          'Consultar tus datos gratis.',
          'Presentar quejas ante la Superintendencia de Industria y Comercio (SIC), después de haber hecho tu solicitud ante nosotros.'
        ]} />
      </Section>

      <Section title="6. Cómo ejercerlos">
        <p>
          Escribe a <EmailLink subject="Solicitud sobre mis datos personales" /> desde el correo que usaste o indicando el
          número de WhatsApp que registraste, y cuéntanos qué necesitas.
        </p>
        <List items={[
          <><strong>Consultas</strong> (qué datos tenemos y cómo los usamos): respondemos en máximo 10 días hábiles. Si no alcanzamos, te avisamos y respondemos en máximo 5 días hábiles más.</>,
          <><strong>Reclamos</strong> (corregir, borrar o retirar la autorización): respondemos en máximo 15 días hábiles. Si no alcanzamos, te avisamos y respondemos en máximo 8 días hábiles más.</>
        ]} />
      </Section>

      <Section title="7. Seguridad y conservación">
        <p>
          La información viaja cifrada (HTTPS) y el proveedor la guarda cifrada. El sitio solo puede escribir registros nuevos:
          leerlos requiere una cuenta de administrador.
        </p>
        <p>
          Conservamos tus datos hasta 2 años después de tu última interacción con Banqueando, o hasta que nos pidas borrarlos, lo que pase primero.
        </p>
      </Section>

      <Section title="8. Cookies">
        <p>No usamos cookies de publicidad ni rastreadores de terceros. El registro del uso del quiz descrito arriba es propio y anónimo.</p>
      </Section>

      <Section title="9. Cambios a esta política">
        <p>
          Si cambiamos algo importante, por ejemplo una nueva finalidad o compartir datos con terceros, lo publicaremos aquí con
          la nueva fecha y te pediremos la autorización cuando haga falta.
        </p>
      </Section>
    </LegalLayout>
  );
}

export function Terms() {
  return (
    <LegalLayout title="Términos y condiciones">
      <Section title="1. Qué es Banqueando">
        <p>
          Banqueando es un comparador gratuito que, con tus respuestas a un cuestionario y la información pública de cada
          producto, te muestra las tarjetas de crédito o los créditos que mejor parecen ajustarse a ti.{operator && ` Lo opera ${operator}.`}
        </p>
        <p>
          <strong>No somos un banco ni una entidad vigilada por la Superintendencia Financiera</strong>, no prestamos dinero,
          no emitimos tarjetas y no intervenimos en la aprobación de ningún producto.
        </p>
      </Section>

      <Section title="2. No es asesoría financiera">
        <List items={[
          'Las recomendaciones son orientativas y se basan solo en lo que respondes. No conocemos toda tu situación financiera.',
          'Las tasas, cuotas, beneficios y requisitos vienen de los sitios oficiales de cada entidad y pueden cambiar sin aviso. En cada producto mostramos los datos que tenemos y, cuando la conocemos, la fecha en que los verificamos.',
          'El beneficio neto, la cuota estimada y la probabilidad de aprobación son cálculos aproximados, no ofertas ni promesas.',
          'Antes de solicitar, revisa las condiciones vigentes en el sitio oficial de la entidad. La decisión final es tuya.'
        ]} />
      </Section>

      <Section title="3. Cómo ordenamos los resultados y cómo nos financiamos">
        <p>
          El orden depende solo de qué tan bien se ajusta cada producto a tus respuestas. Lo explicamos en{' '}
          <Link to={LEGAL_URLS.howWeRecommend} className="text-cyan-700 underline">Cómo recomendamos</Link>.
        </p>
        <p>
          Hoy Banqueando no recibe pagos de ninguna entidad. Si en el futuro recibimos una comisión cuando alguien solicita un
          producto, lo diremos junto a ese producto, y esa comisión no cambiará el orden de los resultados. El servicio seguirá siendo gratis para ti.
        </p>
      </Section>

      <Section title="4. Lo que te pedimos">
        <List items={[
          'Responder con información verdadera: de eso depende que la recomendación sirva.',
          'Usar un número de WhatsApp y un correo que sean tuyos.',
          'Ser mayor de 18 años.'
        ]} />
      </Section>

      <Section title="5. Tus datos">
        <p>
          El tratamiento de tus datos se rige por la{' '}
          <Link to={LEGAL_URLS.privacy} className="text-cyan-700 underline">Política de tratamiento de datos personales</Link>.
          No compartimos tus datos personales con entidades financieras.
        </p>
      </Section>

      <Section title="6. Responsabilidad">
        <p>
          Hacemos lo posible por mantener la información correcta y actualizada, pero no respondemos por cambios que hagan las
          entidades en sus productos, por la decisión de aprobar o negar una solicitud, ni por lo que ocurra en los sitios de
          terceros a los que te enlazamos. Nada de esto limita los derechos que te da la ley como consumidor.
        </p>
      </Section>

      <Section title="7. Propiedad intelectual">
        <p>La marca, el diseño y el contenido de Banqueando son nuestros. Las marcas de bancos y fintechs pertenecen a sus dueños y se usan solo para identificar sus productos.</p>
      </Section>

      <Section title="8. Cambios y ley aplicable">
        <p>
          Si cambiamos estos términos, publicaremos la nueva versión aquí con su fecha. Se rigen por las leyes de Colombia.
          Para dudas o quejas escríbenos a <EmailLink subject="Consulta sobre Banqueando" />.
        </p>
      </Section>
    </LegalLayout>
  );
}

export function HowWeRecommend() {
  const incomePct = Math.round(MAX_DEBT_TO_INCOME * 100);
  const salesPct = Math.round(MAX_DEBT_TO_SALES * 100);
  return (
    <LegalLayout title="Cómo recomendamos">
      <p className="text-gray-700 mb-8 leading-relaxed">
        Queremos que entiendas por qué te mostramos cada producto. Esto es lo que hace el algoritmo, sin letra pequeña.
      </p>

      <Section title="De dónde salen los datos">
        <p>
          Cada producto (tarjetas y créditos de bancos y fintechs en Colombia) se arma con la información publicada en el sitio
          oficial de la entidad: tasas, cuota de manejo, beneficios, montos y requisitos. No comparamos todo el mercado: solo los
          productos que tenemos en nuestra base. Los productos que dejaron de existir o que no pudimos confirmar se ocultan.
        </p>
      </Section>

      <Section title="Tarjetas de crédito">
        <List items={[
          'Primero descartamos las que no podrías obtener: las que piden un ingreso mínimo mayor al tuyo o no aceptan personas reportadas, si nos dijiste que lo estás. Si quieres cambiar de tarjeta, también quitamos las de tu banco actual.',
          'Luego damos puntos según tus respuestas: cómo pagas la tarjeta (si financias, pesa más una tasa baja), cuánto te importa la cuota de manejo, si prefieres millas, cashback o salas VIP, cada cuánto viajas, dónde compras, cómo prefieres manejarla, tus intereses y, si quieres cambiar, qué te molesta de la actual.',
          'Calculamos el beneficio neto al año con tu gasto mensual: lo que te devuelve en cashback o millas, menos la cuota de manejo, menos los intereses si dijiste que financias tus compras. Ese beneficio también cuenta para el orden, y si dos tarjetas empatan, gana la que más te deja.',
          'Si quieres cambiar de tarjeta, también te mostramos cuánto ahorrarías frente a lo que pagas hoy de cuota de manejo.'
        ]} />
      </Section>

      <Section title="Créditos">
        <List items={[
          'Primero dejamos solo los créditos que sirven para lo que pediste. Por ejemplo, una compra a cuotas en tiendas no aparece si necesitas efectivo para tu negocio; la libranza solo aparece si eres empleado o pensionado; el factoring solo si tu negocio factura formalmente.',
          'También descartamos los productos que no aceptan personas reportadas (si nos dijiste que lo estás) o que exigen ser cliente de una entidad con la que no tienes relación.',
          'A los que quedan les damos puntos según qué tan urgente es, tu formalidad, tu historial crediticio, lo que más te importa (tasa, rapidez o facilidad) y si el producto está pensado justo para tu propósito.',
          'Estimamos la cuota mensual con el monto y el plazo que elegiste, usando el rango de tasas que publica cada entidad.',
          <>Comparamos esa cuota con tu capacidad de pago: hasta el {incomePct}% de tus ingresos (o el {salesPct}% de las ventas de tu negocio), menos lo que ya pagas en deudas. Si la cuota no cabe, el producto baja en la lista y te avisamos.</>,
          'Estimamos qué tan probable es la aprobación (alta, media o baja) con tu historial crediticio, tus ingresos y los requisitos del producto.',
          'Además del mejor resultado, te mostramos alternativas distintas cuando existen: la de menor costo, la de desembolso más rápido o la más fácil de aprobar.'
        ]} />
      </Section>

      <Section title="Lo que nunca hacemos">
        <List items={[
          'Cobrarte por usar Banqueando.',
          'Subir un producto en la lista porque una entidad nos pague. Hoy ninguna nos paga.',
          'Consultar centrales de riesgo o afectar tu historial crediticio.',
          'Garantizar la aprobación: eso lo decide cada entidad.'
        ]} />
      </Section>
    </LegalLayout>
  );
}
