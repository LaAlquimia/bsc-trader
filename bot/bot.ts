import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { ALQ, USDT } from '../utils/tokens';
import * as readline from 'readline';
import { getBalances, tokenBalance } from '../trade/balance';
import { MarketMaker } from '../trade/mm';
import { getBidRates, getAskRates } from '../trade/rates';
import { buy, sell } from '../trade/swap';



export class Bot {
    private provider: ethers.JsonRpcProvider;
    private wallet: ethers.Wallet | null;
    private rl: readline.Interface;
    private marketMaker: MarketMaker | null;
    private rebalanceInterval: number;
    private targetRatio: number;
    private balancingUmbral: number;

    constructor() {
        const rpcUrl = process.env.RPC_URL || '';
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.wallet = process.env.pk ? new ethers.Wallet(String(process.env.pk), this.provider) : null;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        this.rebalanceInterval = parseInt(process.env.REBALANCE_INTERVAL || '10000'); // 5 minutos por defecto
        this.targetRatio = parseFloat(process.env.TARGET_RATIO || '0.5');
        this.marketMaker = null;
        this.balancingUmbral = parseFloat(process.env.BALANCING_UMBRAL || '0.05');
    }

    async initializeMarketMaker(): Promise<void> {
        if (!this.wallet) return;

        const [baseBalance, tokenBalance, ethBalance] = await Promise.all([
            this.getBaseBalance(),
            this.getTokenBalance(),
            this.getEthBalance()
        ]);

        const tokenPrice = await this.getTokenPrice();
        

        this.marketMaker = new MarketMaker(
            baseBalance,
            tokenBalance,
            tokenPrice,
            ethBalance,

            this.targetRatio
        );
    }
    private async getEthBalance(): Promise<number> {
        const balance = await this.provider.getBalance(this.wallet!.address);
        return parseFloat(ethers.formatEther(balance));
    }

    private async getBaseBalance(): Promise<number> {
        
        const balance = Number(await tokenBalance(this.wallet!.address, USDT.address));
        
        return balance ;
    }

    private async getTokenBalance(): Promise<number> {
        const balances = await getBalances();
        const tokenBalance = Number(balances?.alqBalance);
        return tokenBalance; // Asume que getBalances devuelve el balance del token
    }



    private async getTokenPrice(): Promise<number> {        
        const tbalance = await tokenBalance(this.wallet!.address, ALQ.address);
        // console.log(tbalance);
        const priceRoute = await getAskRates(tbalance); 
        const price = priceRoute! 
        // console.log('Precio:', price);
        return price;
    }
    

    private async executeTrade(action: string, amount: number): Promise<void> {
        if (!this.wallet) throw new Error('Wallet no configurada');
        
        // Implementar lógica real de intercambio aquí
        console.log(`Ejecutando orden: ${action} ${amount.toFixed(4)} tokens`);
        if (action === 'buy') {
            const price = await this.getTokenPrice();
            console.log('Precio:', price);
            await buy(String(amount * price));
        } else if (action === 'sell') {
            await sell(String(amount));
        }
    }

    public async rebalancePortfolio(): Promise<void> {
        if (!this.marketMaker || !this.wallet) return;

        try {
            // Actualizar balances y precios
            const [newBaseBalance, newTokenBalance, newEthBalance] = await Promise.all([
                this.getBaseBalance(),
                this.getTokenBalance(),
                this.getEthBalance()
            ]);
            
            const newTokenPrice = await this.getTokenPrice();

            this.marketMaker.setBaseBalances(newBaseBalance, newTokenBalance, newTokenPrice, newEthBalance);


            // Obtener acción de rebalanceo
            const rebalanceAction = this.marketMaker.rebalance();
            
            if (rebalanceAction) {
                console.log(`Acción de rebalanceo: ${rebalanceAction.action} ${rebalanceAction.amount.toFixed(4)}`);
                await this.executeTrade(rebalanceAction.action, rebalanceAction.amount);
                
                // Actualizar balances después del trade
                await this.initializeMarketMaker();
            }
        } catch (error) {
            console.error('Error durante el rebalanceo:', error);
        }
    }

    async showInfo(): Promise<void> {
        if (!this.wallet || !this.marketMaker) {
            console.log('No se encontró una billetera en el archivo .env');
            return;
        }
        
        console.clear();
        const portfolioValue = this.marketMaker.getPortfolioValue();
        const currentRatio = this.marketMaker.getCurrentRatio();
        
        console.log('========================');
        console.log('       BOT INFO        ');
        console.log('========================');
        console.log(`Dirección: ${this.wallet.address}`);
        
        console.log(`USDT: ${this.marketMaker.baseBalance.toFixed(4)}`);
        console.log(`ALQ: ${this.marketMaker.tokenBalance.toFixed(4)}`);
        console.log(`BNB: ${this.marketMaker.ethBalance.toFixed(4)}`);
        console.log(`Precio : ${this.marketMaker.tokenPrice.toFixed(4)}`);
        console.log(`Valor total del portfolio: ${portfolioValue.toFixed(4)} USDT`);
        console.log(`Ratio actual: ${(currentRatio * 100).toFixed(2)}%`);
        console.log(`Ratio objetivo: ${(this.targetRatio * 100).toFixed(2)}%`);
        // accion de rebalanceo
    }

    start(): void {
        console.log("Bot iniciando. Comandos disponibles:");

        this.initializeMarketMaker().then(() => {
                
            console.log("- Enter: Mostrar información");
            console.log("- 'r': Rebalancear manualmente");
            console.log("- 's': Salir");
            // Programa rebalanceo automático
            setInterval(() => this.rebalancePortfolio(), this.rebalanceInterval);
            
            this.rl.on('line', async (input) => {
                switch (input.trim().toLowerCase()) {
                    case '':
                        await this.showInfo();
                        break;
                    case 'r':
                        await this.rebalancePortfolio();
                        break;
                    case 's':
                        console.log('Saliendo del bot...');
                        this.rl.close();
                        process.exit(0);
                        break;
                    default:
                        console.log("Comando no reconocido");
                }
            });
        }).catch(error => {
            console.error('Error inicializando el bot:', error);
            process.exit(1);
        });
    }
}