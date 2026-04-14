# 🚀 Proyecto: Naverys Dashboard SaaS - Contexto Maestro

## 1. El Producto y Alcance Estricto
SaaS de analítica B2B orientado a clientes de la agencia Naverys. El objetivo es centralizar métricas en un panel de control minimalista y "Plug & Play".
* **INCLUIDO en el MVP (V1):** Login de usuarios, conexión OAuth con Google, y visualización de métricas de Core Web Vitals y Google Analytics (visitas/sesiones). Panel de uso interno para clientes actuales.
* **EXCLUIDO del MVP (Queda para V2):** Integración con Meta Ads (Facebook/Instagram), pasarelas de cobro (Stripe/MercadoPago), sistema de referidos y alertas por email.

## 2. Stack Tecnológico
* **Arquitectura:** Desacoplada (Frontend y Backend separados).
* **Frontend:** React, Vite, Tailwind CSS (Diseño a medida, sin plantillas genéricas).
* **Backend:** PHP 8.x, Laravel 11 (API REST pura).
* **Autenticación:** Laravel Sanctum (Cookies httpOnly para SPA).
* **Base de Datos:** MySQL (Vía Eloquent ORM, preparado para migrar a PostgreSQL).
* **Infraestructura MVP:** Hostinger Compartido (Usando Cron Jobs para Workers).

## 3. Reglas Estrictas de Desarrollo (Instrucciones para la IA)
* **PHP:** Usar tipado estricto en todo momento (`declare(strict_types=1);`).
* **Laravel:** Prohibida la lógica de negocio pesada en los Controladores. Usar el patrón de diseño *Actions* o *Services*.
* **Seguridad:** Todo Token de API de terceros (Google, Meta) DEBE guardarse encriptado en la base de datos usando Eloquent Model Casts (`encrypted`).
* **Aislamiento:** Aplicar *Global Scopes* para asegurar que cada usuario solo consulte su propia data (Multitenancy básico).
* **Convenciones de Nombrado Backend:**
    * **Actions:** Verbo + Entidad + Action (Ej: `CreateUserAction`, `SyncGoogleMetricsAction`). Solo deben tener un método público `execute()`.
    * **Services:** Entidad + Service (Ej: `GoogleAnalyticsService`). Dedicados a la lógica de conexión a APIs externas.
    * **Controllers:** Solo reciben la Request, llaman a un Action/Service y devuelven la Response. Cero lógica de negocio.
* **Convenciones de Nombrado Frontend:** Componentes en `PascalCase` (Ej: `StatCard.jsx`), funciones auxiliares y hooks en `camelCase` (Ej: `useMetrics()`).

## 4. Esquema Base de Datos (MVP)
* `users`: id, name, email, password, timestamps.
* `connected_accounts`: id, user_id (FK), provider (ENUM: 'google', 'meta'), provider_id, access_token (encrypted), refresh_token (encrypted), timestamps.
* `metrics_cache`: id, user_id (FK), provider (ENUM: 'google', 'meta'), metric_key (string), metric_value (text/json), recorded_at (date), timestamps.

## 5. Roadmap Actual (Por Fases)
- [x] **Fase 1:** Cimientos y Autenticación (Setup Laravel/React + Sanctum). ✅ **[FINALIZADA]**
- [ ] **Fase 2:** Conectividad OAuth (Socialite + Tablas de conexión). -> **[ESTADO ACTUAL]** (Backend y tablas creadas, a la espera de credenciales y front).
- [ ] **Fase 3:** Workers y APIs (Traer datos de Google/Meta).
- [ ] **Fase 4:** Frontend y Gráficos (Dashboard UI). 🚧 **[EN PROGRESO: Interfaces base (Layout/Pages) creadas, falta integrar gráficos]**
- [ ] **Fase 5:** Pulido y Deploy en Hostinger.

## 6. Candados Anti-Alucinaciones (Instrucciones de Comportamiento IA)
* **Versiones Bloqueadas:** Asumir SIEMPRE Laravel 11, PHP 8.2+, React 18+ y TailwindCSS. Bajo ninguna circunstancia utilizar sintaxis o paquetes de versiones anteriores.
* **Filosofía "Native-First":** Prohibido sugerir librerías de terceros si el framework ya lo resuelve. (Ejemplo: usar Laravel HTTP Client en lugar de instalar Guzzle a mano; usar las herramientas de fecha nativas de PHP/Laravel en lugar de Carbon externo si no es estrictamente necesario).
* **Manejo de Errores Obligatorio (Fail-Gracefully):** Toda interacción con bases de datos o APIs externas (Google, Meta) DEBE estar encapsulada en bloques `try/catch` y registrar el fallo usando `Log::error()`. Nunca dejar que una excepción rompa la aplicación en silencio.
* **Respuestas Atómicas:** Al pedir una corrección o función, devolver SOLO la porción de código a modificar o agregar. Prohibido reescribir el archivo completo a menos que se solicite explícitamente, para no sobreescribir lógica ya validada.

## 7. Evolución de Infraestructura (El Horizonte)
* **Fase MVP (Actual):** Hostinger Compartido. Uso de MySQL y simulación de Workers con Cron Jobs de hPanel.
* **Fase Escala (Futuro):** Migración a VPS propio. Orquestación con Docker. Cambio de base de datos a PostgreSQL y reemplazo de la cola de trabajos/caché por Redis para máximo rendimiento.

## 8. Pre-requisitos y Bloqueantes (No-Código)
* **Legal (Urgente para Fase 2):** Se requiere una URL pública en naverys.com con "Política de Privacidad" y "Términos de Uso" para poder registrar y aprobar la Aplicación en *Google Cloud Console* y *Meta for Developers*. Sin esto, las APIs de terceros no nos darán acceso a producción.
* **UI/UX:** Antes de maquetar con Tailwind, la interfaz (Layout, Sidebar, Gráficos) debe estar abocetada (Figma o similar) para mantener la coherencia visual de la marca y evitar rediseños sobre el código.