# A.R.I.A. - Automated RWA Intelligence & Authentication

<p align="center">
  <strong>A complete protocol to verify, mint, and trade Real-World Assets as liquid, on-chain NFTs.</strong>
</p>

<p align="center">
  <a href="https://aria-rwa-dapp.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Launch-Live%20dApp-9d4edd?style=for-the-badge&logo=vercel" alt="Launch Live dApp">
  </a>
  <a href="https://youtu.be/kHUxSGeolEs" target="_blank">
    <img src="https://img.shields.io/badge/Watch-Video%20Demo-blue?style=for-the-badge&logo=youtube" alt="Watch Demo">
  </a>
</p>

---

## 🎯 The Problem & Our Solution

Tokenizing Real-World Assets (RWAs) is crippled by a fundamental bottleneck: **trust and liquidity**. Manual verification is slow and expensive, and even tokenized assets have no native venue to be traded.

**A.R.I.A. (Automated RWA Intelligence & Authentication)** solves this by creating a trustless, end-to-end ecosystem. We have built a complete, self-sustaining protocol—powered by Andromeda's aOS—that handles the entire lifecycle of a Real-World Asset.

Our "document-to-DeFi" lifecycle is live and fully automated:

1. **AI-Powered Verification:** A custom AI Agent uses **Google Gemini** for deep data analysis and **QR Code Cross-Verification** to provide two-factor proof of authenticity.
2. **On-Chain Integrity:** The AI's full verification report is formatted into rich metadata and permanently pinned to **IPFS**.
3. **Mint & List:** Our custom contract programmatically mints a "Verified RWA" NFT on a **CW721 ADO** and the user can instantly list it on the integrated **Marketplace ADO**.
4. **Trade & Earn:** The Marketplace allows anyone to buy the RWA NFT. Proceeds are sent to a **Splitter ADO**, which routes a 5% platform fee to a **CW20 Staking ADO**.
5. **Community-Owned Yield:** Holders of the native **$ARIA** token can stake their tokens to earn a proportional share of all platform revenue, creating a complete, decentralized economic loop.

---

## 🗺️ Architecture & aOS Composability

Our architecture is a seamless integration of off-chain AI processing with on-chain composable smart contracts. We successfully chained **`Custom Contract -> CW721 -> Marketplace -> Splitter -> Staking ADO`** to create a fully automated, on-chain business model.

This is made transparent to the user through our **Live Workflow Visualizer**.

![A.R.I.A. Workflow Flowchart](https://raw.githubusercontent.com/Nihal-Pandey-2302/aria-rwa-dapp/main/Flowchart_final.png)

---

## ✨ Key Features

We delivered a feature-rich MVP that showcases a truly investable and self-sustaining protocol.

* ✅ **Two-Sided Marketplace:** A fully on-chain venue for users to browse, buy, and sell verified RWA NFTs, completing the asset's liquidity lifecycle.
* ✅ **Complete Economic Loop:** An end-to-end business model where marketplace fees automatically fund the staking contract via a Splitter ADO.
* ✅ **Deep AI Integration:** Multi-factor verification using Gemini Vision and on-document QR code validation, presented in a polished "AI Report Card".
* ✅ **Professional UX/UI:** A custom dark theme, a modern header with a wallet "chip", toast notifications, and component-based code create a premium user experience.
* ✅ **Comprehensive Dashboards:** Includes a "My RWA Portfolio," a full-featured "Staking Dashboard," and the new "Marketplace."
* ✅ **"Payload Viewer" for Judges:** An integrated modal for technical reviewers to inspect the raw JSON transaction payloads, demonstrating our deep command of the aOS protocol.

---

## 🛠️ Technology Stack

* **Frontend:** React, Vite, CosmJS, Chakra UI, Keplr Wallet
* **Backend:** Python, Flask
* **AI:** Google Gemini Pro Vision API
* **Blockchain:** Andromeda Testnet (Galileo-4), CosmWasm
* **aOS/ADOs:** Custom Contract, CW721, Marketplace, Splitter, CW20 ($ARIA), CW20 Staking
* **Decentralized Storage:** IPFS (via Pinata)

---

## 🚀 Getting Started

### Live Demo (Recommended)

The best way to experience A.R.I.A. is through our live deployment.

**Live Application URL:** **[https://aria-rwa-dapp.vercel.app/](https://aria-rwa-dapp.vercel.app/)**

**User Journey:**

1. Connect your Keplr Wallet (Galileo-4 Testnet).
2. Go to the **"Mint RWA"** page to verify a document and mint it as an NFT.
3. List your newly minted NFT on the marketplace.
4. Navigate to the **"Marketplace"** page to browse and buy assets listed by other users.
5. Visit the **"Staking"** page to stake your `$ARIA` tokens and earn platform fees.

### Running Locally

1. **Clone the Repository:**

    ```sh
    git clone [https://github.com/Nihal-Pandey-2302/aria-rwa-dapp.git](https://github.com/Nihal-Pandey-2302/aria-rwa-dapp.git)
    cd aria-rwa-dapp
    ```

2. **Setup & Run Backend:**

    ```sh
    cd aria-backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    # Create a .env file with your API keys (see .env.example)
    python app.py
    ```

3. **Setup & Run Frontend:**

    ```sh
    cd ../aria-frontend
    npm install
    # Create a .env.local file (see .env.example)
    npm run dev
    ```

---

## 🔗 Deployed Contracts (Galileo-4)

* **$ARIA Token (CW20):** `andr1epwyxg4vt2f7g8udddzfzmhsdr0zm3lcs8j38rad7q03ma6l2vwqnhqnae`
* **Staking App:** `andr1kjxasu7d504amhr7h3jnyvcryc702agtpqcsnu5648gtky0fjphszfupwr`
* **Splitter ADO:** `andr13tpamsp58gcu8xte4gwdkhd7laapfztqkucs7za9dnyekkrklgnqhs38k7`
* **Marketplace ADO:** `andr1f5l38d5ztvrxuwvsr9vvnk9u0qglsrfwp8t064fq4ze8uh0k3jqsv5hxjk`
* **CW721 (NFT Collection):** `andr104t7skjtky657cr88fnfjzqmzxvpm0fgfkhazerd9aeq4ktneu7qm828l9`
* **VerifiedRWA Contract (The "Brain"):** `andr132hquqqs0m64hthpv6wpjwgnmgpr2exrwvhw9kqpqeh4dk4ls4tq3ldsjm`

---

## 🔮 Future Vision

* **Fractionalization:** Integrate CW20 ADOs to allow users to fractionalize high-value RWAs.
* **DeFi Collateralization:** Partner with lending protocols to allow A.R.I.A.'s AI-verified NFTs to be used as trusted collateral.
* **Full DAO Governance:** Transition ownership of key protocol contracts to a DAO ADO controlled by staked $ARIA holders.

---

## 👨‍💻 Author

* **Nihal Pandey**
* **[GitHub](https://github.com/Nihal-Pandey-2302)** | **[LinkedIn](https://www.linkedin.com/in/nihal-pandey-8529b6257/)** | **[X (Twitter)](https://x.com/PandeyNihal23)**
