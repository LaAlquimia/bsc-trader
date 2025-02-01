import { readFile } from "fs/promises";

const PORT = 3000;
const url =
  "https://matcha.xyz/api/time-series?address=0x4b48c0db4e460c894bfc031d602a5c3b57a26857&chainId=56&chartRangeInMinutes=43800&resolution=60&currencyCode=USD&removeLeadingNullValues=false&now=1738093037714";

// Función para obtener datos de la API
async function fetchData() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.status}`);
    }

    const apiData = await response.json();
    // Transforma los datos para Lightweight Charts
    // console.log(apiData);
    // media pero de todos los valores de la serie
    const n = 9;
    const mean = apiData['o'].map((value, index) => {
        const startIndex = Math.max(0, index - n + 1); // Índice de inicio para la ventana deslizante
        const window = apiData['o'].slice(startIndex, index + 1); // Ventana de los últimos n valores
        const sum = window.reduce((a, b) => a + b, 0); // Suma de los valores en la ventana
        return sum / window.length; // Media de la ventana
      });
      
      // console.log(mean);
    
    return [apiData['o'], apiData['t'], apiData['c'], apiData['h'], apiData['l'], apiData['volume'], mean ];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Servidor Bun
Bun.serve({
  port: PORT,
  async fetch(req) {
    const pathname = new URL(req.url).pathname;
    console.log(`Ruta solicitada: ${pathname}`);

    if (pathname === "/" || pathname === "/index.html") {
      const html = await readFile("./index.html", "utf-8");
      return new Response(html, { headers: { "Content-Type": "text/html" } });
    }

    if (pathname === "/data") {
      const data = await fetchData();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("404 Not Found", { status: 404 });
  },
});

console.log(`Servidor en ejecución en http://localhost:${PORT}`);
