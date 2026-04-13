$root = "D:\Code\Dashboard Marketing"
$bin = Join-Path $root "bin"
$phpZip = Join-Path $bin "php.zip"
$phpDir = Join-Path $bin "php"
$composerPhar = Join-Path $bin "composer.phar"

Write-Host "Iniciando setup de entorno..."

# 1. Descarga
if (-not (Test-Path $phpZip)) {
    Write-Host "Descargando PHP 8.5.5..."
    Invoke-WebRequest -Uri "https://downloads.php.net/~windows/releases/archives/php-8.5.5-Win32-vs17-x64.zip" -OutFile $phpZip
}

# 2. Extracción
if (-not (Test-Path $phpDir)) { New-Item -ItemType Directory -Path $phpDir -Force }
Write-Host "Extrayendo PHP..."
Expand-Archive -Path $phpZip -DestinationPath $phpDir -Force

# 3. Configuración php.ini
$iniDev = Join-Path $phpDir "php.ini-development"
$ini = Join-Path $phpDir "php.ini"
if (Test-Path $iniDev) {
    Copy-Item $iniDev $ini -Force
    Write-Host "Configurando php.ini..."
    (Get-Content $ini) | ForEach-Object {
        $_ -replace ';extension_dir = "ext"', 'extension_dir = "ext"' `
            -replace ';extension=curl', 'extension=curl' `
            -replace ';extension=fileinfo', 'extension=fileinfo' `
            -replace ';extension=gd', 'extension=gd' `
            -replace ';extension=mbstring', 'extension=mbstring' `
            -replace ';extension=openssl', 'extension=openssl' `
            -replace ';extension=pdo_mysql', 'extension=pdo_mysql' `
            -replace ';extension=sqlite3', 'extension=sqlite3'
    } | Set-Content $ini
}

# 4. Composer
if (-not (Test-Path $composerPhar)) {
    Write-Host "Descargando Composer..."
    Invoke-WebRequest -Uri "https://getcomposer.org/composer.phar" -OutFile $composerPhar
}

# 5. Verificación
$phpExe = Join-Path $phpDir "php.exe"
if (Test-Path $phpExe) {
    Write-Host "PHP OK: $(& $phpExe -v | Select-Object -First 1)"
    Write-Host "Composer OK: $(& $phpExe $composerPhar -V)"
}
else {
    Write-Host "Error: php.exe no encontrado en $phpExe"
}
