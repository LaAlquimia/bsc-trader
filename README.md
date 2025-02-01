# BSC Trader

BSC Trader es un bot de trading automatizado diseñado para operar en intercambios descentralizados (DEX) en la Binance Smart Chain (BSC). Este bot permite la compra y venta de tokens de manera eficiente, implementando estrategias de trading personalizables.

## Características

- Automatización: Ejecuta operaciones de compra y venta sin intervención manual.
- Estrategias Personalizables: Permite la implementación de diferentes estrategias de trading según las necesidades del usuario.
- Gestión de Riesgos: Incluye configuraciones para establecer niveles de stop-loss y take-profit.
- Registro de Operaciones: Mantiene un registro detallado de todas las transacciones realizadas.

## Requisitos Previos

Antes de instalar y utilizar BSC Trader, asegúrate de tener lo siguiente:

- Node.js: Versión 14 o superior. Puedes descargarlo desde https://nodejs.org/.
- Cuenta en BSC: Una dirección de billetera en la Binance Smart Chain con fondos suficientes en BNB para cubrir las transacciones.
- Clave API de BSCScan: Regístrate en https://bscscan.com/ y genera una clave API gratuita.

## Instalación

Sigue estos pasos para instalar y configurar BSC Trader:

1. Clona el repositorio:

   git clone https://github.com/LaAlquimia/bsc-trader.git
   cd bsc-trader

2. Instala las dependencias:

   npm install

3. Configura las variables de entorno:

   - Copia el archivo .env.example y renómbralo a .env.
   - Abre el archivo .env y completa los siguientes campos:

     PRIVATE_KEY=tu_clave_privada
     BSC_API_KEY=tu_clave_api_de_bscscan

   Nota: Nunca compartas tu clave privada. Asegúrate de que este archivo no se comparta públicamente.

## Uso

Para iniciar el bot, ejecuta el siguiente comando:

   npm start

El bot comenzará a monitorear el mercado y ejecutará operaciones según la estrategia definida.

## Personalización de Estrategias

Puedes personalizar las estrategias de trading modificando los archivos en la carpeta strategies. Asegúrate de probar cualquier cambio en un entorno seguro antes de implementarlo en el mercado real.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar BSC Trader, por favor, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama:

   git checkout -b feature/nueva-funcionalidad

3. Realiza tus cambios y haz commit:

   git commit -am "Agrega nueva funcionalidad"

4. Envía tus cambios a tu repositorio fork:

   git push origin feature/nueva-funcionalidad

5. Abre un Pull Request en este repositorio.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.

## Descargo de Responsabilidad

BSC Trader es una herramienta de código abierto para automatizar operaciones en la Binance Smart Chain. El uso de este bot es bajo tu propio riesgo. Los desarrolladores no son responsables de ninguna pérdida financiera que pueda ocurrir al usar este software. Asegúrate de comprender completamente los riesgos asociados con el trading automatizado antes de utilizar BSC Trader.
