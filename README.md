

# **A.R.I.A. - Automated RWA Intelligence & Authentication**

### *Trust, tokenized. Liquidity, unlocked.*

**[▶️ Watch the 3-Minute Winning Demo Video](https://www.google.com/search?q=./docs/demo.mp4)**

-----

## 📝 Idea Snapshot

* **Concept Overview:** An AI-powered platform to verify real-world documents and mint them as liquid, composable RWA NFTs on Andromeda, featuring an automated on-chain revenue model.
* **Intended Track:** Track 1: Real World Assets on Andromeda
* **Technology Stack:**
  * 💻 **Frontend:** React, Vite, cosmjs, Chakra UI, Keplr Wallet
  * ⚙️ **Backend:** Python, Flask
  * 🧠 **AI:** Google Gemini 2.5 Pro
  * ⛓️ **Blockchain:** Andromeda Testnet (Galileo-4), CosmWasm
  * 🧩 **aOS/ADOs:** Custom Contract, CW721, Marketplace, Splitter, **CW20 Token ($ARIA)**, **CW20 Staking**
  * 📦 **Decentralized Storage:** IPFS (via Pinata)

-----

## 📖 Table of Contents

* The Problem We Solved
* Our Solution: The A.R.I.A. Platform
* Architecture & Workflow
* Key Features & Why We Should Win
* The A.R.I.A. Experience: A 60-Second Guide
* Getting Started
* Deployed Contracts (Galileo-4 Testnet)
* Future Vision
* Author

-----

## 🎯 The Problem We Solved

Tokenizing Real-World Assets (RWAs) is the next frontier of DeFi, but it's crippled by a fundamental bottleneck: **trust and liquidity**. The current process is slow, requires expensive manual verification, and results in on-chain assets that are difficult to value and trade. A.R.I.A. attacks this problem head-on, creating a trustless, fully automated pipeline from any raw document to a liquid, AI-verified on-chain asset.

-----

## 💡 Our Solution: The A.R.I.A. Protocol

We have successfully built a polished, full-stack dApp that showcases the true composability of Andromeda's Operating System (aOS) from end to end. A.R.I.A. is not just an application, but a complete, self-sustaining protocol with a fully on-chain business model.

**A.R.I.A. delivers a complete "document-to-DeFi" lifecycle:**

1. **AI-Powered Verification:** Our Python AI Agent uses **Google's Gemini API** for deep analysis and **QR Code Cross-Verification** to provide two-factor proof of a document's authenticity.
2. **On-Chain Integrity:** The AI's report is formatted into rich metadata, permanently pinned to **IPFS**, forming the bedrock of the RWA's on-chain value.
3. **Composable aOS Workflow:** Our custom contract programmatically mints a "Verified RWA" NFT on a **CW721 ADO**. The user then lists this NFT on a **Marketplace ADO**.
4. **Automated Value Capture:** The Marketplace is configured to send all sale proceeds to a **Splitter ADO**, which automatically routes a 5% platform fee directly to a **CW20 Staking ADO**.
5. **Community-Owned Value:** Holders of the **$ARIA** token can stake their tokens in our Staking Dashboard to earn a proportional share of all platform revenue, creating a complete, decentralized economic loop.

-----

## 🗺️ Architecture & Workflow

Our architecture is a seamless integration of off-chain AI processing with on-chain composable smart contracts, made transparent to the user through our Live Workflow Visualizer.

-----

## ✨ Key Features & Why We Should Win

We delivered a feature-rich MVP that directly addresses and excels in every category of the judging criteria, presenting a truly investable solution.

#### Core Functionality & aOS Integration

* ✅ **End-to-End RWA Tokenization:** A complete, working flow from document upload to a tradable NFT listed on a marketplace.
* 🤖 **Deep AI Integration:** Google Gemini provides the core data and trust layer for each RWA.
* 🧩 **aOS Composability Masterclass:** We successfully chained **Custom Contract -\> CW721 -\> Marketplace -\> Splitter -\> Staking ADO** to create a fully automated, on-chain business model.
* 💰 **Complete On-Chain Economic Loop:** We implemented a native token (`$ARIA`) and a staking contract. The integrated Splitter automatically funds the staking contract with platform fees from every sale, demonstrating a self-sustaining and investable protocol.

#### UI/UX & Professional Polish

* ✨ **Modern dApp Experience:** A custom dark theme, a professional header with a wallet "chip", and component-based code create a premium user experience.
* 🔐 **Two-Factor Verification:** Goes beyond AI assessment to provide verifiable proof by reading on-document QR codes and displaying the confirmed data on the UI.
* 👀 **Live Workflow Visualizer:** A dynamic visualizer makes the complex backend process transparent and engaging.
* 🖼️ **"My RWA Portfolio" & Staking Dashboard:** User-centric dashboards to view minted assets and manage staking, creating a complete portfolio experience.
* 📜 **Interactive AI Report Card:** A polished "Report Card" component with a radial progress bar for the authenticity score.
* 🔍 **"Peek Behind the Curtain" Payload Viewer:** A modal for technical judges to view the raw JSON transaction payloads.
* 👨‍💻**Toast Notifications & Social Sharing:** Modern toast notifications provide smooth feedback, and a "Share on X" button encourages community engagement.

-----

## 🚀 The A.R.I.A. Experience: A 60-Second Guide

When you use A.R.I.A. or watch our demo, you will see a complete journey:

1. **Instant AI & QR Verification:** An uploaded document is analyzed and cross-verified in seconds.
2. **One-Click Minting:** The verified data is used to mint a unique, on-chain RWA NFT.
3. **Seamless Listing & Sale:** The new NFT is immediately listed and can be sold on a decentralized marketplace.
4. **The Magic Moment:** We will show on the block explorer how a sale automatically triggers our **Splitter contract** to send a 5% fee directly to the **Staking contract**.
5. **Earn Real Yield:** We will then use the Staking Dashboard to stake `$ARIA` and show how users can earn a share of the platform's revenue.

-----

## 🏁 Getting Started

Follow these instructions to set up and run the A.R.I.A. project locally.

### Prerequisites

* Node.js (`v18+`) & npm
* Python 3.8+ & pip
* Keplr Wallet Browser Extension

### Installation & Setup

1. **Clone the Repository:**

    ```sh
    git clone <your-repo-url>
    cd aOS_Aria
    ```

2. **Setup the Backend (AI Agent):**

    ```sh
    cd aria-backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

    Create a `.env` file in `aria-backend` and add your API keys:

    ```
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    PINATA_API_KEY="YOUR_PINATA_API_KEY"
    PINATA_SECRET_API_KEY="YOUR_PINATA_SECRET_KEY"
    ```

3. **Setup the Frontend:**

    ```sh
    cd ../aria-frontend
    npm install
    ```

### Running the Application

You will need two separate terminal windows.

1. **Run the Backend Server:**

    ```sh
    cd aria-backend
    source venv/bin/activate
    python app.py
    ```

    The backend will be running on `http://127.0.0.1:5000`.

2. **Run the Frontend Development Server:**

    ```sh
    cd aria-frontend
    npm run dev
    ```

    The frontend will be available at `http://localhost:5173`.

-----

## 🔗 Deployed Contracts (Galileo-4 Testnet)

* **$ARIA Token (CW20) App:** `andr1epwyxg4vt2f7g8udddzfzmhsdr0zm3lcs8j38rad7q03ma6l2vwqnhqnae` *(The App containing the protocol's governance token.)*
* **Staking App:** `andr1kjxasu7d504amhr7h3jnyvcryc702agtpqcsnu5648gtky0fjphszfupwr` *(The App containing the staking contract that receives and distributes platform fees.)*
* **Splitter ADO:** `andr13tpamsp58gcu8xte4gwdkhd7laapfztqkucs7za9dnyekkrklgnqhs38k7` *(Handles the automatic 95/5% revenue split on every sale.)*
* **Marketplace ADO:** `andr1f5l38d5ztvrxuwvsr9vvnk9u0qglsrfwp8t064fq4ze8uh0k3jqsv5hxjk` *(The decentralized venue where NFTs are sold.)*
* **CW721 ADO:** `andr104t7skjtky657cr88fnfjzqmzxvpm0fgfkhazerd9aeq4ktneu7qm828l9` *(The NFT collection contract, exclusively controlled by our "Brain".)*
* **VerifiedRWA-NFT Contract (The "Brain"):** `andr132hquqqs0m64hthpv6wpjwgnmgpr2exrwvhw9kqpqeh4dk4ls4tq3ldsjm` *(Our custom contract that orchestrates the entire AI verification and minting process.)*

-----

## 🔮 Future Vision

With the core "Trust & Monetization Engine" now built, our post-hackathon roadmap is focused on scaling A.R.I.A. into the central hub for RWA liquidity on Andromeda:

* **Fractionalization:** Integrate CW20 ADOs to allow users to fractionalize high-value RWAs into fungible tokens.
* **DeFi Collateralization:** Partner with lending protocols to allow A.R.I.A.'s AI-verified NFTs to be used as trusted collateral for loans.
* **Expanding AI Capabilities:** Integrate more advanced AI models for active fraud detection, predictive valuation, and automated compliance checks.

-----

## 👨‍💻 Author

* **Nihal Pandey**
* **[GitHub](https://github.com/Nihal-Pandey-2302)**
* **[LinkedIn](https://www.linkedin.com/in/nihal-pandey-8529b6257/)**
* **[X](https://x.com/PandeyNihal23)**
