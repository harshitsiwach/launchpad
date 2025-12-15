LAUNCHPAD SPECIFICATION — EVM \+ SOLANA  
**Table of Contents**

1\. Overview

2\. User Roles

3\. Supported Wallets & Chains

4\. Project Onboarding (Google Form)

5\. Contribution Cap System (Updated)

6\. Sale Pools (EVM \+ Solana)

7\. Vesting & Claiming

8\. KYC Requirements

9\. Admin Panel Requirements

10\. Notifications

11\. What Is NOT Included

12\. v1 Summary

**1\. Overview**  
A multi-chain token launchpad supporting EVM \+ Solana, without staking. Users are assigned a maximum contribution cap, and may contribute any amount up to that cap. Final token allocation is based on how much they actually contribute. Admin controls all allocations, whitelists, caps, vesting, and sale settings.

**2\. User Roles**  
Investors: Connect wallet, complete KYC if required, contribute an amount up to their assigned cap, then claim tokens.

Project Teams: Submit details through Google Form only.

Admin: Creates projects, configures pools, uploads wallet caps, manages contributions, vesting, and treasury.

**3\. Supported Wallets & Chains**  
EVM Wallets: MetaMask, Rabby, WalletConnect, OKX Wallet.

Solana Wallets: Phantom, Solflare, Backpack.

UI automatically shows correct wallets based on whether the pool is on EVM or Solana.

**4\. Project Onboarding (Google Form)**  
Projects submit description, token details, raise information, vesting plan, and documentation links. Admin reviews manually and configures all sale details.

**5\. Contribution Cap System (Updated)**  
Each wallet is assigned a maximum contribution cap by the Admin.

Users can contribute ANY amount up to their cap. They cannot exceed it.

Final token allocation \= actual contribution ÷ token price.

Users who contribute less simply receive fewer tokens.

If they contribute nothing, they receive nothing.

Admin uploads a CSV before the sale containing:

wallet\_address, contribution\_cap

During the sale, the UI shows: 'Your cap: X. You may contribute any amount up to this limit.'

**6\. Sale Pools (EVM \+ Solana)**  
Projects may have multiple pools on EVM or Solana.

Admin configures: token price, accepted token, timeline, whitelist, KYC, contribution caps.

Only wallets in the uploaded list may participate.

Users cannot exceed their assigned cap and may contribute only once or multiple times (admin choice).

**7\. Vesting & Claiming**  
Admin sets TGE %, cliff duration, total vesting period, and unlock frequency.

Users can see claimable tokens, next unlock date, vesting progress, and total allocation.

**8\. KYC Requirements**  
Optional per sale. If enabled, users must pass KYC before contributing.

KYC is tied to identity, not a specific wallet, allowing users to verify additional wallets.

**9\. Admin Panel Requirements**  
Admin must be able to:

\- Create and edit projects

\- Configure pools on EVM or Solana

\- Upload whitelist and contribution caps CSVs

\- View live contribution data

\- Manage vesting settings

\- Release funds and manage treasury

\- Enable claiming and TGE

**10\. Notifications**  
Notify users when sales begin, when they are ending soon, when TGE starts, and when vesting unlocks are available.

**11\. v1 Summary**  
The MVP includes: multi-chain pools (EVM \+ Solana), wallet connect, contribution cap logic, KYC, whitelist, admin dashboard, vesting, TGE, and a claim page.

