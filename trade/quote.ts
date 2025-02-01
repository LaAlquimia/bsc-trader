import { constructSimpleSDK, SwapSide } from '@paraswap/sdk';
import axios from 'axios';
import { ethers, JsonRpcSigner, SigningKey } from 'ethers';
import { USDT, ALQ } from '../utils/tokens';

import dotenv from "dotenv";

dotenv.config();

// construct minimal SDK with fetcher only
const paraSwapMin = constructSimpleSDK({chainId: 56, axios}
);

export async function quotePrice() {
    
    const signer = new ethers.Wallet( String(process.env.pk)); 
    const senderAddress = signer.address;
    console.log(senderAddress);
    const priceRoute = await paraSwapMin.swap.getRate({
        srcToken: USDT.address,
        destToken: ALQ.address,
        amount: '1' + '0'.repeat(18),
        userAddress: senderAddress,
        srcDecimals: 18,
        destDecimals: 18,
        side: SwapSide.SELL,
    });
    // calculate price usdt per alq
    const price = Number(priceRoute.srcAmount) / Number(priceRoute.destAmount);
    console.log(price);
    return price;

}
