# BSC Trader

BSC Trader es un bot de trading automatizado diseñado para operar en intercambios descentralizados (DEX) en la Binance Smart Chain (BSC). Este bot permite la compra y venta de tokens de manera eficiente, implementando estrategias de trading personalizables.

## Características

- Automatización: Ejecuta operaciones de compra y venta sin intervención manual.
- Estrategias Personalizables: Permite la implementación de diferentes estrategias de trading según las necesidades del usuario.

## Requisitos Previos

Antes de instalar y utilizar BSC Trader, asegúrate de tener lo siguiente:

- Node.js: Versión 14 o superior. Puedes descargarlo desde https://nodejs.org/.
- Cuenta en BSC: Una dirección de billetera en la Binance Smart Chain con fondos suficientes en BNB para cubrir las transacciones.
- Servicio de Blockchain: Un nodo rpc de la red de blockchain de Binance Smart Chain (BSC) para ejecutar transacciones.
lo puedes obtener gratis en https://docs.bscscan.com/misc-tools-and-utilities/public-rpc-nodes.
- Clave Privada: Una clave privada de la cuenta que se utilizará para enviar transacciones.



## Instalación

Sigue estos pasos para instalar y configurar BSC Trader:

1. Clona el repositorio:
    ``` bash
   git clone https://github.com/LaAlquimia/bsc-trader.git

   cd bsc-trader 
   ```

2. Instala las dependencias:
    ``` bash
   npm install
   ```

3. Configura las variables de entorno:

   - Copia el archivo .env.example y renómbralo a .env.
   - Abre el archivo .env y completa los siguientes campos:
``` python 
    pk 
    #  pk: La clave privada de la cuenta que se utilizará para enviar transacciones.
    RPC_URL
    #  RPC_URL: La URL de RPC de la red de blockchain de Binance Smart Chain.
    REBALANCE_INTERVAL
    #  REBALANCE_INTERVAL: El intervalo de tiempo en milisegundos entre rebalances.
    TARGET_RATIO
    #  TARGET_RATIO: La relación objetivo del pool.
    BALANCING_UMBRAL
    #  BALANCING_UMBRAL: El umbral de balanceo para realizar un rebalance.

   Nota: Nunca compartas tu clave privada. Asegúrate de que este archivo no se comparta públicamente.
```
   - Si no tienes clave privada puedes generara con 
``` bash 
    npm generate-key
```
## Uso

Para iniciar el bot, ejecuta el siguiente comando:
   ``` bash
   npm start
```
El bot comenzará a monitorear el mercado y ejecutará operaciones según la estrategia definida.

## Personalización de Estrategias

Puedes personalizar las estrategias de trading modificando los archivos en la carpeta strategies. Asegúrate de probar cualquier cambio en un entorno seguro antes de implementarlo en el mercado real.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar BSC Trader, por favor, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama:
``` bash
   git checkout -b feature/nueva-funcionalidad
```
3. Realiza tus cambios y haz commit:
``` bash
   git commit -am "Agrega nueva funcionalidad"
```
4. Envía tus cambios a tu repositorio fork:
``` bash
   git push origin feature/nueva-funcionalidad
```
5. Abre un Pull Request en este repositorio.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.

## Descargo de Responsabilidad

BSC Trader es una herramienta de código abierto para automatizar operaciones en la Binance Smart Chain. El uso de este bot es bajo tu propio riesgo. Los desarrolladores no son responsables de ninguna pérdida financiera que pueda ocurrir al usar este software. Asegúrate de comprender completamente los riesgos asociados con el trading automatizado antes de utilizar BSC Trader.
