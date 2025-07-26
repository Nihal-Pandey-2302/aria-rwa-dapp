# A.R.I.A. - Automated RWA Intelligence & Authentication

### *Trust, tokenized. Liquidity, unlocked.*

<p align="center">
  <a href="https://aria-rwa-dapp.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Launch-Live%20dApp-9d4edd?style=for-the-badge&logo=vercel" alt="Launch Live dApp">
  </a>
    
  <a href="https://youtu.be/kHUxSGeolEs" target="_blank">
    <img src="https://img.shields.io/badge/Watch-%20Demo-blue?style=for-the-badge&logo=youtube" alt="Watch Demo">
  </a>
</p>

---

## 📝 Idea Snapshot

*   **Concept Overview:** An AI-powered platform to verify real-world documents and mint them as liquid, composable RWA NFTs on Andromeda, featuring an automated on-chain revenue model.
*   **Intended Track:**
    *   **Primary:** Track 1: Real World Assets on Andromeda
    *   **Secondary:** Track 2: Automated DeFi Legos
*   **Technology Stack:**
    *   💻 **Frontend:** React, Vite, cosmjs, Chakra UI, Keplr Wallet (Deployed on Vercel)
    *   ⚙️ **Backend:** Python, Flask (Deployed on Render)
    *   🧠 **AI:** Google Gemini Pro Vision API
    *   ⛓️ **Blockchain:** Andromeda Testnet (Galileo-4), CosmWasm
    *   🧩 **aOS/ADOs:** Custom Contract, CW721, Marketplace, Splitter, **CW20 Token ($ARIA)**, **CW20 Staking**
    *   📦 **Decentralized Storage:** IPFS (via Pinata)

---

## 🎯 The Problem We Solved

Tokenizing Real-World Assets (RWAs) is the next frontier of DeFi, but it's crippled by a fundamental bottleneck: **trust and liquidity**. The current process is slow, requires expensive manual verification, and results in on-chain assets that are difficult to value and trade. A.R.I.A. attacks this problem head-on, creating a trustless, fully automated pipeline from any raw document to a liquid, AI-verified on-chain asset.

---

## 💡 Our Solution: The A.R.I.A. Protocol

We have successfully built a polished, full-stack dApp that showcases the true composability of Andromeda's Operating System (aOS) from end to end. A.R.I.A. is not just an application, but a complete, self-sustaining protocol with a fully on-chain business model.

**Our protocol delivers a complete "document-to-DeFi" lifecycle:**
1.  **AI-Powered Verification:** Our AI Agent uses **Google Gemini** for deep analysis and **QR Code Cross-Verification** to provide two-factor proof of authenticity.
2.  **On-Chain Integrity:** The AI's report is formatted into rich metadata, permanently pinned to **IPFS**.
3.  **Composable aOS Workflow:** Our custom contract programmatically mints a "Verified RWA" NFT on a **CW721 ADO**, which is then listed on a **Marketplace ADO**.
4.  **Automated On-Chain Value Capture:** The Marketplace is configured to send all sale proceeds to a **Splitter ADO**, which automatically routes a 5% platform fee directly to a **CW20 Staking ADO**.
5.  **Community-Owned Yield:** Holders of the **$ARIA** token can stake their tokens in our Staking Dashboard to earn a proportional share of all platform revenue, creating a complete, decentralized economic loop.

---

## 🗺️ Architecture & Workflow

Our architecture is a seamless integration of off-chain AI processing with on-chain composable smart contracts, made transparent to the user through our Live Workflow Visualizer.

![A.R.I.A. Workflow Flowchart](https://raw.githubusercontent.com/Nihal-Pandey-2302/aria-rwa-dapp/refs/heads/main/Flowchart_final.png)

---

## ✨ Key Features & Why We Should Win

We delivered a feature-rich MVP that directly addresses and excels in every category of the judging criteria, presenting a truly investable solution.

#### 🏆 A Masterclass in aOS Composability
*   ✅ **End-to-End Workflow:** A complete, working flow from document upload to a tradable NFT.
*   ✅ **Deep ADO Chain:** We successfully chained **`Custom Contract -> CW721 -> Marketplace -> Splitter -> Staking ADO`** to create a fully automated, on-chain business model.
*   ✅ **Complete On-Chain Economic Loop:** The integrated Splitter automatically funds the staking contract with platform fees from every sale, demonstrating a self-sustaining and investable protocol.

#### 🧠 Deep & Meaningful AI Integration
*   ✅ **Multi-Factor Verification:** Goes beyond simple AI assessment by cross-verifying on-document QR codes.
*   ✅ **Interactive AI Report Card:** A polished "Report Card" component with a radial progress bar for the authenticity score.

#### 💎 Polished & Professional User Experience
*   ✅ **Modern dApp UI:** A custom dark theme, a professional header with a wallet "chip", and component-based code create a premium user experience.
*   ✅ **Live Workflow Visualizer:** A dynamic visualizer makes the complex backend process transparent and engaging.
*   ✅ **"My RWA Portfolio" & Staking Dashboard:** User-centric dashboards to view minted assets and manage staking.
*   ✅ **"Peek Behind the Curtain" Payload Viewer:** A modal for technical judges to view the raw JSON transaction payloads, demonstrating deep command of the protocol.
*   ✅ **Toast Notifications & Social Sharing:** Modern toast notifications and a "Share on X" button encourage community engagement.

---

## 🏁 Getting Started

### 🚀 Live Demo (Recommended)

The best way to experience A.R.I.A. is through our live deployment.

**Live Application URL:** **[https://aria-rwa-dapp.vercel.app/](https://aria-rwa-dapp.vercel.app/)**

**Prerequisites:**
*   A modern web browser (Chrome, Brave, Firefox).
*   The [Keplr Wallet](https://www.keplr.app/) browser extension.
*   Galileo-4 testnet tokens (`uandr`).

### 👩‍💻 Running Locally (For Developers)

Follow these instructions to set up and run the A.R.I.A. project locally.

1.  **Clone the Repository:**
    ```sh
    git clone https://github.com/Nihal-Pandey-2302/aria-rwa-dapp.git
    cd aria-rwa-dapp
    ```
2.  **Setup & Run Backend:**
    ```sh
    cd aria-backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    # Create a .env file with your API keys
    python app.py
    ```
3.  **Setup & Run Frontend:**
    ```sh
    cd ../aria-frontend
    npm install
    # Create a .env.local file and set VITE_BACKEND_URL=http://127.0.0.1:5000
    npm run dev
    ```

---

## 🔗 Deployed Contracts (Galileo-4 Testnet)

*   **$ARIA Token (CW20) App:** `andr1epwyxg4vt2f7g8udddzfzmhsdr0zm3lcs8j38rad7q03ma6l2vwqnhqnae` *(The App containing the protocol's governance token.)*
*   **Staking App:** `andr1kjxasu7d504amhr7h3jnyvcryc702agtpqcsnu5648gtky0fjphszfupwr` *(Receives and distributes platform fees.)*
*   **Splitter ADO:** `andr13tpamsp58gcu8xte4gwdkhd7laapfztqkucs7za9dnyekkrklgnqhs38k7` *(Handles the automatic 95/5% revenue split.)*
*   **Marketplace ADO:** `andr1f5l38d5ztvrxuwvsr9vvnk9u0qglsrfwp8t064fq4ze8uh0k3jqsv5hxjk` *(The decentralized venue where NFTs are sold.)*
*   **CW721 ADO:** `andr104t7skjtky657cr88fnfjzqmzxvpm0fgfkhazerd9aeq4ktneu7qm828l9` *(The NFT collection, exclusively controlled by our "Brain".)*
*   **VerifiedRWA-NFT Contract (The "Brain"):** `andr132hquqqs0m64hthpv6wpjwgnmgpr2exrwvhw9kqpqeh4dk4ls4tq3ldsjm` *(Orchestrates the AI verification and minting process.)*

---

## 🔮 Future Vision

With the core "Trust & Monetization Engine" built, our post-hackathon roadmap is focused on scaling A.R.I.A. into the central hub for RWA liquidity on Andromeda:

*   **Fractionalization:** Integrate CW20 ADOs to allow users to fractionalize high-value RWAs.
*   **DeFi Collateralization:** Partner with lending protocols to allow A.R.I.A.'s AI-verified NFTs to be used as trusted collateral.
*   **Expanding AI Capabilities:** Integrate more advanced AI for active fraud detection and predictive valuation.

---

## 👨‍💻 Author

*   **Nihal Pandey**
*   **[GitHub](https://github.com/Nihal-Pandey-2302)** | **[LinkedIn](https://www.linkedin.com/in/nihal-pandey-8529b6257/)** | **[X (Twitter)](https://x.com/PandeyNihal23)**
