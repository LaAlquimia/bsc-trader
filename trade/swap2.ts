import { constructSimpleSDK, SwapSide } from '@paraswap/sdk';
import axios from 'axios';
import { ethers } from 'ethers';
import { USDT, ALQ } from '../utils/tokens';
import dotenv from "dotenv";

dotenv.config();

// Configurar provider de BSC
const BSC_RPC_URL = 'https://bsc-dataseed.binance.org/';
const provider = new ethers.JsonRpcProvider(BSC_RPC_URL);

// Conectar el signer al provider
const signer = new ethers.Wallet(String(process.env.pk), provider);

const paraSwapMin = constructSimpleSDK({ chainId: 56, axios });

// Obtener la dirección del signer
async function getSenderAddress(): Promise<string> {
    return await signer.getAddress();
}

// Obtener ruta de precios
async function getPriceRoute(
    srcToken: string,
    destToken: string,
    amount: string,
    srcDecimals: number,
    destDecimals: number,
    side: SwapSide,
    userAddress: string
): Promise<any> {
    return await paraSwapMin.swap.getRate({
        srcToken,
        destToken,
        amount: ethers.parseUnits(amount, srcDecimals).toString(),
        userAddress,
        srcDecimals,
        destDecimals,
        side,
    });
}

// Verificar y aprobar allowance
async function checkAndApprove(
    contract: ethers.Contract,
    spenderAddress: string,
    requiredAmount: ethers.BigNumberish
): Promise<void> {
    const allowance = await contract.allowance(await signer.getAddress(), spenderAddress);
    console.log('Allowance actual:', allowance.toString());

    if (allowance < requiredAmount) {
        console.log('Haciendo approve...');
        const approveTx = await contract.approve(spenderAddress, ethers.MaxUint256);
        await approveTx.wait();
        console.log('Approve confirmado');
    }
}

// Construir transacción
async function buildTransaction(
    priceRoute: any,
    srcToken: string,
    destToken: string,
    srcDecimals: number,
    destDecimals: number,
    userAddress: string
): Promise<any> {
    return await paraSwapMin.swap.buildTx({
        priceRoute,
        srcToken,
        destToken,
        srcDecimals,
        destDecimals,
        srcAmount: priceRoute.srcAmount,
        destAmount: priceRoute.destAmount,
        userAddress,
    });
}

// Enviar transacción
async function sendTransaction(txParams: any): Promise<ethers.TransactionReceipt> {
    const txResponse = await signer.sendTransaction({
        ...txParams,
        gasPrice: ethers.parseUnits('1', 'gwei'),
        gasLimit: 300000,
    });

    console.log('Transacción enviada:', txResponse.hash);
    const receipt = await txResponse.wait();
    console.log('Transacción confirmada en bloque:', receipt!.blockNumber);
    return receipt!;
}

// Swap de USDT a ALQ
export async function swap(): Promise<ethers.TransactionReceipt> {
    try {
        const senderAddress = await getSenderAddress();
        console.log('Sender address:', senderAddress);

        const priceRoute = await getPriceRoute(
            USDT.address,
            ALQ.address,
            '1',
            USDT.decimals,
            ALQ.decimals,
            SwapSide.SELL,
            senderAddress
        );

        const usdtContract = new ethers.Contract(USDT.address, [
            "function allowance(address owner, address spender) external view returns (uint256)",
            "function approve(address spender, uint256 amount) external returns (bool)"
        ], signer);

        const spenderAddress = await paraSwapMin.swap.getSpender();
        await checkAndApprove(usdtContract, spenderAddress, priceRoute.srcAmount);

        const txParams = await buildTransaction(priceRoute, USDT.address, ALQ.address, USDT.decimals, ALQ.decimals, senderAddress);
        return await sendTransaction(txParams);
    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        throw error;
    }
}

// Sell de ALQ a USDT
export async function sell(): Promise<ethers.TransactionReceipt> {
    try {
        const senderAddress = await getSenderAddress();
        console.log('Sender address:', senderAddress);

        const priceRoute = await getPriceRoute(
            ALQ.address,
            USDT.address,
            '500',
            ALQ.decimals,
            USDT.decimals,
            SwapSide.SELL,
            senderAddress
        );

        const price = Number(priceRoute.destAmount) / Number(priceRoute.srcAmount);
        console.log('Precio:', price);

        const alqContract = new ethers.Contract(ALQ.address, [
            "function allowance(address owner, address spender) external view returns (uint256)",
            "function approve(address spender, uint256 amount) external returns (bool)"
        ], signer);

        const spenderAddress = await paraSwapMin.swap.getSpender();
        await checkAndApprove(alqContract, spenderAddress, priceRoute.srcAmount);

        const txParams = await buildTransaction(priceRoute, ALQ.address, USDT.address, ALQ.decimals, USDT.decimals, senderAddress);
        return await sendTransaction(txParams);
    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        throw error;
    }
}

(async () => {
    await sell();
})();
