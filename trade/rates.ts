import { constructSimpleSDK, SwapSide } from '@paraswap/sdk';
import axios from 'axios';
import { ethers } from 'ethers';
import { USDT, ALQ } from '../utils/tokens';
import dotenv from "dotenv";

dotenv.config();

async function getWalletAddress() {
    try {
        return new ethers.Wallet(String(process.env.pk)).getAddress();
    } catch (error) {
        throw new Error('Error al obtener la dirección del wallet');
    }
}

async function fetchRate(
    srcToken: string,
    destToken: string, 
    amount: string, 
    srcDecimals: number, 
    destDecimals: number

) {
    try {
        const paraSwapMin = constructSimpleSDK({ chainId: 56, axios });
        const senderAddress = await getWalletAddress();
        
        const priceRoute = await paraSwapMin.swap.getRate({
            srcToken,
            destToken,
            amount: ethers.parseUnits(amount, srcDecimals).toString(),
            userAddress: senderAddress,
            srcDecimals,
            destDecimals,
            side: SwapSide.SELL,
            maxImpact: 100,
        } as any );
        
        return priceRoute;
    } catch (error) {
        console.error('Error al obtener la tarifa:', error instanceof Error ? error.message : error);
        return null;
    }
}

export async function getBidRates(
    amount: string,
) {
    const priceRoute = await fetchRate(USDT.address, ALQ.address, amount, USDT.decimals, ALQ.decimals);
    if (priceRoute) {
        const price = Number(priceRoute.srcAmount) / Number(priceRoute.destAmount);
        return price;
    }
    return null;
}

export async function getAskRates(
    amount: string,
) {
    const priceRoute = await fetchRate(ALQ.address, USDT.address, amount, ALQ.decimals, USDT.decimals);
    if (priceRoute) {
        const price = Number(priceRoute.destAmount) / Number(priceRoute.srcAmount);
        return price;
    }
    return null;
}

