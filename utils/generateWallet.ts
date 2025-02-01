import { ethers } from 'ethers';
import fs from 'fs';

const WALLET_FILE = 'wallet.json';

export async function generateWallet(): Promise<ethers.Wallet> {
    const hdWallet = ethers.HDNodeWallet.createRandom(); // Genera un HDNodeWallet
    const wallet = new ethers.Wallet(hdWallet.privateKey); // Convierte a Wallet

    const walletData = {
        address: wallet.address,
        privateKey: wallet.privateKey,
    };

    if (fs.existsSync(WALLET_FILE)) {
        console.log(`El archivo ${WALLET_FILE} ya existe. No se sobrescribirá.`);
    } else {
        fs.writeFileSync(WALLET_FILE, JSON.stringify(walletData, null, 2));
        console.log(`Billetera guardada en ${WALLET_FILE}`);
        console.log(`Dirección: ${wallet.address}`);
    }

    return wallet;
}

(async () => {
    const wallet = await generateWallet();
})();