import { Link } from 'react-router-dom';

export function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] text-slate-900 dark:text-slate-100 p-8 sm:p-12 transition-colors duration-300">
            <div className="max-w-3xl mx-auto bg-white dark:bg-[#111] p-8 sm:p-12 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xl shadow-blue-900/5">
                <Link to="/" className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-8 inline-block hover:underline">
                    ← Volver al Inicio
                </Link>
                <h1 className="text-3xl font-extrabold mb-6">Términos y Condiciones de Uso</h1>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mb-8">Última actualización: Noviembre 2024</p>

                <div className="space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    <p>
                        Al acceder o utilizar el Naverys Marketing Dashboard ("el Servicio"), usted acepta automáticamente estar sujeto a estos Términos y Condiciones de Uso. Si usted no está de acuerdo con alguna parte de los términos, no debe utilizar el software.
                    </p>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">1. Uso del Servicio</h2>
                    <p>
                        El Servicio es un panel de control corporativo que permite a los clientes vigilar el desempeño integral de sus plataformas en línea mediante la agregación de datos de terceros. Este software está provisto estrictamente como un producto SaaS B2B de valor agregado para clientes de la Agencia Naverys.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Usted debe mantener la confidencialidad de sus credenciales.</li>
                        <li>No utilizará el Servicio para monitorear actividades o robar analíticas de dominios/empresas de las cuales no sea dueño legítimo o no tenga expresa autorización de auditar.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">2. Integraciones de Terceros (Google & Meta)</h2>
                    <p>
                        El Dashboard solicita conectar con su cuenta de Google (Analytics 4) y Meta (Business Ads) utilizando la integración oficial mediante el protocolo estándar de la industria (OAuth 2.0).
                        Nosotros nos regimos enteramente bajo los términos y límites de las APIs de <a href="https://developers.google.com/terms/" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-400">Google API Services User Data Policy</a> y <a href="https://developers.facebook.com/terms" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-400">Meta Platform Terms</a>.
                    </p>
                    <p>
                        El acceso otorgado (Token) no nos confiere derechos ni herramientas para publicar en sus redes ni redactar información en su nombre. Limitamos nuestro uso únicamente a leer reportes preestablecidos.
                    </p>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">3. Limitación de Responsabilidad</h2>
                    <p>
                        Naverys provee los datos calculados de forma asíncrona directamente desde los proveedores originales (Google/Meta). Por lo tanto, no somos responsables por fallos temporales en la exactitud, discrepancias matemáticas o problemas de red originados por el lado de las APIs de Google Cloud o el Graph de Meta. Las métricas del Dashboard tienen fines de control y monitoreo y no de absoluta certificación contable.
                    </p>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">4. Cambios a estos Términos</h2>
                    <p>
                        La Agencia puede actualizar los presentes términos a medida que implemente nuevos módulos en el panel. Le recomendamos revisar activamente este documento, el cual se encontrará siempre al pie de la URL pública.
                    </p>
                </div>
            </div>
        </div>
    );
}
