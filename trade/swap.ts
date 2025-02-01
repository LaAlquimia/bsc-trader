import { constructSimpleSDK, SwapSide } from '@paraswap/sdk';
import axios from 'axios';
import { ethers } from 'ethers';
import { USDT, ALQ } from '../utils/tokens';
import dotenv from "dotenv";
import { log } from 'console';

dotenv.config();

// Configurar provider de BSC
const BSC_RPC_URL = process.env.RPC_URL || '';
const provider = new ethers.JsonRpcProvider(BSC_RPC_URL);

// Conectar el signer al provider
const signer = new ethers.Wallet(String(process.env.pk), provider);

const paraSwapMin = constructSimpleSDK({ chainId: 56, axios });

export async function buy(
    amount: string,
) {
    try {
        const senderAddress = await signer.getAddress(); // Usar la dirección del signer
        // console.log('Sender address:', senderAddress);

        // 1. Obtener ruta de precios
        
        console.log(amount);
        const priceRoute = await paraSwapMin.swap.getRate({
            srcToken: USDT.address,
            destToken: ALQ.address,            
            amount: ethers.parseUnits(amount, USDT.decimals).toString(), // 1 USDT
            userAddress: senderAddress,
            srcDecimals: USDT.decimals,
            destDecimals: ALQ.decimals,
            side: SwapSide.SELL,
            maxImpact: 100,
        } as any);

        // console.log(priceRoute);
        // 2. Verificar allowance
        const usdtContract = new ethers.Contract(
            USDT.address,
            [
                "function allowance(address owner, address spender) external view returns (uint256)",
                "function approve(address spender, uint256 amount) external returns (bool)"
            ],
            signer // Pasar el signer con provider
        );

        const spenderAddress = paraSwapMin.swap.getSpender();
        const usdtAllowance = await usdtContract.allowance(senderAddress, spenderAddress);
        // console.log('Allowance actual:', usdtAllowance.toString());

        // 3. Si el allowance es insuficiente, hacer approve
        if (usdtAllowance < priceRoute.srcAmount) {
            console.log('Haciendo approve...');
            const approveTx = await usdtContract.approve(
                spenderAddress,
                ethers.MaxUint256 // Approve infinito
            );
            await approveTx.wait();
            console.log('Approve confirmado');
        }

        // 4. Construir transacción de swap
        const txParams = await paraSwapMin.swap.buildTx({
            priceRoute,
            srcToken: USDT.address,
            destToken: ALQ.address,
            srcDecimals: USDT.decimals,
            destDecimals: ALQ.decimals,
            srcAmount: priceRoute.srcAmount,
            destAmount: priceRoute.destAmount,
            userAddress: senderAddress,
        });

        // 5. Enviar transacción
        const txResponse = await signer.sendTransaction({
            ...txParams,
            gasPrice : ethers.parseUnits('1', 'gwei'),
            gasLimit: 300000
        });

        console.log('Transacción enviada:', txResponse.hash);
        const receipt = await txResponse.wait();
        // console.log('Transacción confirmada en bloque:', receipt!.blockNumber);
        return receipt;

    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        throw error;
    }
}

export async function sell(
    amount: string,
) {
    try {
        const senderAddress = await signer.getAddress(); // Usar la dirección del signer
        // console.log('Sender address:', senderAddress);
        const priceRoute = await paraSwapMin.swap.getRate({
            srcToken: ALQ.address,
            destToken: USDT.address,
            amount: ethers.parseUnits(amount, ALQ.decimals).toString(), // 100 ALQ
            userAddress: senderAddress,
            srcDecimals: ALQ.decimals,
            destDecimals: USDT.decimals,
            side: SwapSide.SELL,
            maxImpact: 100,
        } as any);
        // console.log('priceRoute:', priceRoute);
        // verificar precio 
        const price = Number(priceRoute.destAmount) / Number(priceRoute.srcAmount);
        console.log('Precio:', price);
        // 2. Verificar allowance
        const alqContract = new ethers.Contract(
            ALQ.address,
            [
                "function allowance(address owner, address spender) external view returns (uint256)",
                "function approve(address spender, uint256 amount) external returns (bool)"
            ],
            signer // Pasar el signer con provider
        );

        const spenderAddress = await paraSwapMin.swap.getSpender(); // Obtener la dirección del spender
        const alqAllowance = await alqContract.allowance(senderAddress, spenderAddress); // Obtener el balance del token en wei (unidad mínima)
        // console.log('Allowance actual:', alqAllowance.toString());
        // 3. Si el balance del token es insuficiente, hacer approve
        console.log(priceRoute.srcAmount);
        if (alqAllowance < priceRoute.srcAmount) {
            console.log('Haciendo approve...'); // Hacer approve
            const approveTx = await alqContract.approve(
                spenderAddress, // Pasar la dirección del spender
                ethers.MaxUint256 // Approve infinito // Pasar el amount
                );
            await approveTx.wait(); // Esperar a que se confirme la transacción
            console.log('Approve confirmado'); // Mostrar mensaje de confirmación
        }

        const txParams = await paraSwapMin.swap.buildTx({
            priceRoute,
            srcToken: ALQ.address,
            destToken: USDT.address,
            srcDecimals: ALQ.decimals,
            destDecimals: USDT.decimals,
            srcAmount: priceRoute.srcAmount,
            destAmount: priceRoute.destAmount,
            userAddress: senderAddress,
        });
        // console.log('txParams:', txParams);

        // 5. Enviar transacción
        const txResponse = await signer.sendTransaction({
            ...txParams,
            gasPrice : ethers.parseUnits('1', 'gwei'),
            gasLimit: 300000
        });

        console.log('Transacción enviada:', txResponse.hash);
        const receipt = await txResponse.wait();
        // console.log('Transacción confirmada en bloque:', receipt!.blockNumber);
        return receipt;
    } 
    catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        throw error;
        }
    }

