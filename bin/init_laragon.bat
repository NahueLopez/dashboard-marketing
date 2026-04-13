@echo off
set PATH=C:\laragon\bin\php\php-8.3.30-Win32-vs16-x64;C:\laragon\bin\composer;%PATH%
cd "D:\Code\Dashboard Marketing"
if exist naverys-backend rmdir /s /q naverys-backend
echo Iniciando instalacion de Laravel 11 usando Laragon...
composer create-project laravel/laravel naverys-backend --no-interaction
if exist naverys-backend\artisan (
    echo Proyecto creado exitosamente, instalando Sanctum...
    cd naverys-backend
    php artisan install:api
) else (
    echo Error al crear el proyecto
)
exit
