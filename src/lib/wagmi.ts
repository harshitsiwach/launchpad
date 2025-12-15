import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
    mainnet,
    sepolia,
} from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'Launchpad',
    projectId: 'YOUR_PROJECT_ID', // TODO: Get from Env or WalletConnect
    chains: [mainnet, sepolia],
    ssr: true,
});
