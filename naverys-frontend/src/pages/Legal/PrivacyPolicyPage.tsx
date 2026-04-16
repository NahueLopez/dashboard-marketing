import { Link } from 'react-router-dom';

export function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] text-slate-900 dark:text-slate-100 p-8 sm:p-12 transition-colors duration-300">
            <div className="max-w-3xl mx-auto bg-white dark:bg-[#111] p-8 sm:p-12 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xl shadow-blue-900/5">
                <Link to="/" className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-8 inline-block hover:underline">
                    ← Volver al Inicio
                </Link>
                <h1 className="text-3xl font-extrabold mb-6">Política de Privacidad</h1>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mb-8">Última actualización: Noviembre 2024</p>

                <div className="space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    <p>
                        Bienvenido al Dashboard de Marketing de <strong>Naverys</strong>. Esta Política de Privacidad explica cómo recopilamos, utilizamos, revelamos y protegemos su información cuando utiliza nuestra aplicación web ("el Servicio"). Lea atentamente este documento.
                    </p>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">1. Información que Recopilamos</h2>
                    <p>
                        <strong>Datos de la Cuenta:</strong> Al crear una cuenta en nuestro panel de forma corporativa, recopilamos su nombre, correo electrónico y contraseña (encriptada).
                    </p>
                    <p>
                        <strong>Datos vía OAuth (Google Analytics 4 y Meta Ads):</strong> El Servicio le permite conectar cuentas de terceros usando los protocolos de autenticación oficial. Al hacerlo, el Servicio extraerá métricas de sólo lectura, tales como: sesiones, visitas a la página, usuarios totales, conversiones, gasto publicitario (spend), impresiones y métricas de desempeño de las propiedades que usted expresamente conecte mediante sus credenciales.
                    </p>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">2. Uso de la Información</h2>
                    <p>Utilizamos la información recopilada estrictamente para los siguientes propósitos:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Construir el panel gráfico interactivo personal de KPIs de su empresa.</li>
                        <li>Proporcionar resúmenes históricos de rendimiento.</li>
                        <li>Garantizar que solo usted pueda acceder a la data de su sitio/negocio utilizando bases de datos aisladas.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">3. Cómo Protegemos su Información</h2>
                    <p>
                        La seguridad es nuestra mayor prioridad. Todos los <code>access_tokens</code> y <code>refresh_tokens</code> proporcionados por proveedores de terceros (OAuth) se almacenan <strong>encriptados en reposo a nivel de base de datos</strong>. No realizamos ninguna acción de escritura o modificación sobre sus cuentas de Google o Meta Ads. Nuestra app sólo consume permisos de <em>lectura</em> de reportes métricos.
                    </p>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">4. Divulgación de Información a Terceros</h2>
                    <p>
                        <strong>No vendemos, comercializamos, ni compartimos</strong> bajo ninguna circunstancia sus datos analíticos o de inversión publicitaria a ningún tercero. Únicamente el equipo técnico autorizado de la agencia Naverys tiene acceso al clúster general para casos de soporte técnico o mantenimiento del servidor.
                    </p>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4">5. Retención de Datos y Derecho al Olvido</h2>
                    <p>
                        Usted puede solicitar la eliminación completa de su perfil y datos en caché asociados en cualquier momento solicitándolo por los canales de gestión tradicionales pautados con la agencia en su SLA de Servicio de Marketing.
                    </p>
                </div>
            </div>
        </div>
    );
}
