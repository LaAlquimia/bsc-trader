import { ethers } from 'ethers';
import dotenv from 'dotenv';
import * as readline from 'readline';
import { getBalances } from './trade/balance';
import { Bot } from './bot/bot';
dotenv.config();

// Ejecutar el bot
(async () => {
    const bot = new Bot();
    bot.start();
})();