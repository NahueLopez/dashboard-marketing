# Guía de Despliegue en Hostinger (Naverys Dashboard)

Esta guía documenta la infraestructura para un entorno de Hosting Compartido (hPanel) separando el Backend (Laravel) del Document Root para máxima seguridad.

## 1. Estructura de Carpetas (Seguridad)

Nunca alojar el núcleo de Laravel dentro de `public_html`. La estructura debe ser:

```text
/home/uXXXXXXX/
├── naverys_backend/          <-- TODO Laravel (app, routes, .env, vendor)
└── domains/midominio.com/
    └── public_html/          <-- Document Root de Hostinger
        ├── assets/           <-- (React dist/)
        ├── index.html        <-- (React dist/)
        ├── api/              <-- ¡NUEVO! Todo el contenido original de laravel/public
        │   ├── index.php     <-- Index de Laravel modificado
        │   └── .htaccess     <-- .htaccess Nativo de Laravel
        └── .htaccess         <-- .htaccess General Maestro (Ver abajo)
```

### Puente API (`public_html/api/index.php`)

Modificar los require de Laravel para alcanzar la ruta exterior y segura:

```php
require __DIR__.'/../../../../naverys_backend/vendor/autoload.php';
$app = require_once __DIR__.'/../../../../naverys_backend/bootstrap/app.php';
```

## 2. Enrutamiento Maestro (`public_html/.htaccess`)

Archivo `.htaccess` a colocar en la RAÍZ de `public_html`. Gestiona el ruteo de React SPA, respeta las llamadas a Laravel `/api/` y bloquea intentos de lectura de credenciales.

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On

    # 1. Ignorar la carpeta /api/ para que Laravel maneje esas rutas
    RewriteCond %{REQUEST_URI} ^/api/ [NC]
    RewriteRule ^(.*) - [PT,L]

    # 2. Enrutar todo el tráfico restante hacia React SPA
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.html [L]
</IfModule>

# 3. Blindaje Crítico Hostinger (Bloqueo 403 estricto contra curiosos)
<FilesMatch "^\.env|^\.git|composer\.json|package\.json">
    Require all denied
</FilesMatch>
<FilesMatch "(^#.*#|\.(bak|conf|dist|fla|in[ci]|log|psd|sh|sql|sw[op])|~)$">
    Require all denied
</FilesMatch>
```

## 3. Procesamiento Asíncrono (Cron Jobs Laravel sin Supervisor)

Configurar en Hostinger -> Advanced -> Cron Jobs:

*   **Comando:** `/usr/bin/php /home/uXXXXXXX/naverys_backend/artisan queue:work database --stop-when-empty --timeout=90 --tries=3`
*   **Frecuencia:** `* * * * *` (Cada minuto).

> `--stop-when-empty` procesa los trabajos y cierra el script, evitando acumulación de procesos estancados en el servidor compartido.

## 4. Front End (React/Vite)

1. En el archivo `.env.production` local configurar: `VITE_API_BASE_URL=https://midominio.com` *(sin /api al final ya que el código lo asume)*.
2. Ejecutar `npm run build` en la terminal local.
3. Subir TODO el contenido de la carpeta `/dist/` hacia `/home/uXXXXXXX/domains/midominio.com/public_html/` del servidor.
