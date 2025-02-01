import { ethers } from "ethers";
import * as fs from "fs";

const RPC_URL = "https://bnb-mainnet.g.alchemy.com/v2/YFiYj-vQi_-b_ecbFTkI3n8VqoGaGbiN";
const provider = new ethers.JsonRpcProvider(RPC_URL);

const PAIR_ADDRESS = "0xb9081e31c419625e318edca4c89f071d643a94d0"; // Dirección del par
const TOPIC_SWAP = "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822"; // Evento Swap
const MAX_SWAPS = 50; // Número de swaps que queremos buscar

async function fetchLastSwaps(pairAddress: string, topic: string, maxSwaps: number) {
    const latestBlock = await provider.getBlockNumber();
    let currentBlock = latestBlock;
    const logs: any[] = [];
    const blockChunkSize = 2000; // Tamaño del rango de bloques por consulta

    console.log(`Bloque más reciente: ${latestBlock}`);

    while (logs.length < maxSwaps && currentBlock > 0) {
        const fromBlock = Math.max(currentBlock - blockChunkSize, 0);

        console.log(`Consultando de ${fromBlock} a ${currentBlock}...`);

        try {
            const events = await provider.send("eth_getLogs", [
                {
                    address: pairAddress,
                    fromBlock: ethers.toQuantity(fromBlock),
                    toBlock: ethers.toQuantity(currentBlock),
                    topics: [topic],
                },
            ]);

            logs.push(...events);

            if (logs.length >= maxSwaps) {
                console.log(`Se encontraron ${logs.length} swaps.`);
                break;
            }
        } catch (error: any) {
            console.error("Error al consultar los eventos:", error.message);
        }

        currentBlock = fromBlock - 1; // Mover hacia atrás
    }

    // Limitar la cantidad de swaps a MAX_SWAPS
    return logs.slice(0, maxSwaps);
}

async function main() {
    try {
        const swaps = await fetchLastSwaps(PAIR_ADDRESS, TOPIC_SWAP, MAX_SWAPS);
        // save swaps to json 
        fs.writeFileSync('logs.json', JSON.stringify(swaps, null, 2));
        console.log(`Total de swaps encontrados: ${swaps.length}`);
        console.log("Ejemplo de swap:", swaps[0]);
    } catch (err) {
        console.error("Error:", err);
    }
}

main();
