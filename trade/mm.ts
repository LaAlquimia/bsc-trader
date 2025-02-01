export class MarketMaker {
    public baseBalance: number; // USDT o BNB
    public tokenBalance: number; // Token específico
    public tokenPrice: number; // Precio del token en base
    public targetRatio: number; // Porcentaje deseado del portafolio en el token
    public ethBalance: number; // ETH
    public balancingUmbral: number; // Umbral de balanceo

    constructor(
        baseBalance: number, 
        tokenBalance: number, tokenPrice: number, ethBalance: number,   targetRatio: number = 0.5 ,
        balancingUmbral: number = 0.05)
        {
        this.baseBalance = baseBalance;
        this.tokenBalance = tokenBalance;
        this.tokenPrice = tokenPrice;
        this.targetRatio = targetRatio;
        this.ethBalance = ethBalance;
        this.balancingUmbral = balancingUmbral;
    }

    public setBaseBalances(
        baseBalance: number,
        tokenBalance: number,
        tokenPrice: number,
        ethBalance: number,
        targetRatio: number = 0.5       

    ) {
        this.baseBalance = baseBalance;
        this.tokenBalance = tokenBalance;
        this.tokenPrice = tokenPrice;
        this.targetRatio = targetRatio;
        this.ethBalance = ethBalance;
    }


    public getPortfolioValue(): number {
        return this.baseBalance + (this.tokenBalance * this.tokenPrice);
    }

    public getCurrentRatio(): number {
        return (this.tokenBalance * this.tokenPrice) / this.getPortfolioValue();
    }

    public rebalance(): { action: string; amount: number } | null {
        const currentRatio = this.getCurrentRatio();
        const portfolioValue = this.getPortfolioValue();
        const targetValue = portfolioValue * this.targetRatio;
        const tokenValue = this.tokenBalance * this.tokenPrice;

        if (currentRatio / this.targetRatio > (1 + this.balancingUmbral)) {
            const excessValue = tokenValue - targetValue;
            const sellAmount = excessValue / this.tokenPrice;
            return { action: "sell", amount: sellAmount };
        } else if (currentRatio / this.targetRatio < (1 - this.balancingUmbral)) {
            const missingValue = targetValue - tokenValue;
            const buyAmount = missingValue / this.tokenPrice;
            return { action: "buy", amount: buyAmount };
        }
        
        return null; // No es necesario rebalancear
    }
}

