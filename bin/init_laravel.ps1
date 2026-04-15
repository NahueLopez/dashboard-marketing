$root = "D:\Code\Dashboard Marketing"
$binPhp = Join-Path $root "bin\php"
$composer = Join-Path $root "bin\composer.phar"
$backend = Join-Path $root "naverys-backend"
$phpExe = Join-Path $binPhp "php.exe"
$phpIni = Join-Path $binPhp "php.ini"

# Forzar el PATH local para que PHP encuentre sus propias DLLs (libcrypto, libssl, etc.)
$env:PATH = "$binPhp;" + $env:PATH

Write-Host "Diagnóstico de módulos PHP:"
& $phpExe -c $phpIni -m | Select-String "openssl|curl|mbstring|pdo_mysql"

Write-Host "Iniciando instalación de Laravel 11..."
Set-Location $root
if (Test-Path $backend) { 
    Write-Host "Limpiando directorio existente..."
    Remove-Item $backend -Recurse -Force 
}

# Ejecutar creación de proyecto forzando el uso del php.ini local
& $phpExe -c $phpIni $composer create-project laravel/laravel naverys-backend --no-interaction

if (Test-Path $backend) {
    Write-Host "Laravel instalado correctamente en $backend"
    # Verificar que artisan funcione
    Write-Host "Verificando Artisan..."
    & $phpExe -c $phpIni (Join-Path $backend "artisan") --version
}
else {
    Write-Host "Error: No se pudo crear el directorio del proyecto."
    exit 1
}
