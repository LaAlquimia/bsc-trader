import { ethers } from 'ethers';
import { USDT, ALQ } from '../utils/tokens';
import dotenv from "dotenv";
dotenv.config();
const rpc= process.env.RPC_URL || '';

export async function BNB_balance(address: string, rpcUrl: string = rpc): Promise<string> {
  try {
    // Crear el provider usando la RPC de BSC
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // Obtener el balance en wei (unidad mínima)
    const balanceWei = await provider.getBalance(address);

    // Convertir el balance a ETH/BSC (formato legible)
    const balanceBnb = ethers.formatEther(balanceWei);

    return balanceBnb;
  } catch (error) {
    throw new Error(`Error checking balance: ${error instanceof Error ? error.message : error}`);
  }
}

export async function tokenBalance(address: string, tokenAddress: string, rpcUrl: string = rpc): Promise<string> {
  try {
    // Crear el provider usando la RPC de BSC
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const erc20Abi = [
      "function balanceOf(address account) external view returns (uint256)",
    ];  

    // Obtener el balance del token en wei (unidad mínima)
    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);
    const balanceWei = await tokenContract.balanceOf(address);

    // Convertir el balance a ETH/BSC (formato legible)
    const tokenBalance = ethers.formatEther(balanceWei);

    return tokenBalance;
  } catch (error) {
    throw new Error(`Error checking balance: ${error instanceof Error ? error.message : error}`);
  }
}

export async function getBalances(){

    try {
        const address = new ethers.Wallet(String(process.env.pk)).address;
        const balance = await BNB_balance(address);
        // console.log(`Balance: ${balance} BNB`);
        const balanceUSDT = await tokenBalance(address, USDT.address);
        // console.log(`Balance: ${balanceUSDT} USDT`);
        const balanceALQ = await tokenBalance(address, ALQ.address);
        // console.log(`Balance: ${balanceALQ} ALQ`);
        return { bnbBalance: balance, usdtBalance: balanceUSDT, alqBalance: balanceALQ };
      } catch (error) {
        console.error(error);
      }
};

    
