import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  VStack,
  Alert,
  AlertIcon,
  Heading,
  useToast
} from '@chakra-ui/react';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import { Buffer } from "buffer";

// Component Imports
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import LiveWorkflowVisualizer from './components/LiveWorkflowVisualizer';
import AIReportCard from './components/AIReportCard';
import PayloadViewer from './components/PayloadViewer';
import NftActions from './components/NftActions';
import NftGallery from './components/NftGallery';
import StakingDashboard from './components/StakingDashboard';

// Chain Configuration
const CHAIN_ID = "galileo-4";
const CHAIN_NAME = "Andromeda Testnet";
const RPC_URL = "https://api.andromedaprotocol.io/rpc/testnet";
const REST_URL = "https://api.andromedaprotocol.io/rest/testnet";
const BECH32_PREFIX = "andr";
const DENOM_MINIMAL = "uandr";
const DENOM_DISPLAY = "ANDR";
const DENOM_DECIMALS = 6;
const GAS_PRICE_STEP = {
  low: 0.01,
  average: 0.025,
  high: 0.03,
};

// Backend API URL
const BACKEND_URL = "http://127.0.0.1:5000";

// --- Contract Addresses ---
const VERIFIED_RWA_CONTRACT_ADDRESS = "andr132hquqqs0m64hthpv6wpjwgnmgpr2exrwvhw9kqpqeh4dk4ls4tq3ldsjm";
const NEW_CW721_ADO_ADDRESS = "andr104t7skjtky657cr88fnfjzqmzxvpm0fgfkhazerd9aeq4ktneu7qm828l9";
const MARKETPLACE_ADO_ADDRESS = "andr1f5l38d5ztvrxuwvsr9vvnk9u0qglsrfwp8t064fq4ze8uh0k3jqsv5hxjk";
const SPLITTER_ADO_ADDRESS = "andr13tpamsp58gcu8xte4gwdkhd7laapfztqkucs7za9dnyekkrklgnqhs38k7";
const ARIA_APP_ADDRESS = "andr1epwyxg4vt2f7g8udddzfzmhsdr0zm3lcs8j38rad7q03ma6l2vwqnhqnae";
const STAKING_APP_ADDRESS = "andr1kjxasu7d504amhr7h3jnyvcryc702agtpqcsnu5648gtky0fjphszfupwr";

function App() {
  // Core State
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Workflow State
  const [selectedFile, setSelectedFile] = useState(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [backendLoading, setBackendLoading] = useState(false);
  const [backendError, setBackendError] = useState(null);
  const [mintingLoading, setMintingLoading] = useState(false);
  const [mintingError, setMintingError] = useState(null);
  const [mintTxHash, setMintTxHash] = useState(null);
  const [listPrice, setListPrice] = useState("");
  const [listingLoading, setListingLoading] = useState(false);
  const [listingError, setListingError] = useState(null);
  const [listingTxHash, setListingTxHash] = useState(null);

  // UI Enhancement State
  const [workflowStatus, setWorkflowStatus] = useState('idle');
  const [mintedNfts, setMintedNfts] = useState([]);
  const toast = useToast();

  // Wallet Connection Logic
  const connectWallet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!window.keplr) throw new Error("Keplr wallet not found.");
      await window.keplr.experimentalSuggestChain({
        chainId: CHAIN_ID, chainName: CHAIN_NAME, rpc: RPC_URL, rest: REST_URL, bip44: { coinType: 118 },
        bech32Config: {
          bech32PrefixAccAddr: BECH32_PREFIX, bech32PrefixAccPub: BECH32_PREFIX + "pub", bech32PrefixValAddr: BECH32_PREFIX + "valoper",
          bech32PrefixValPub: BECH32_PREFIX + "valoperpub", bech32PrefixConsAddr: BECH32_PREFIX + "valcons", bech32PrefixConsPub: BECH32_PREFIX + "valconspub",
        },
        currencies: [{ coinDenom: DENOM_DISPLAY, coinMinimalDenom: DENOM_MINIMAL, coinDecimals: DENOM_DECIMALS }],
        feeCurrencies: [{ coinDenom: DENOM_DISPLAY, coinMinimalDenom: DENOM_MINIMAL, coinDecimals: DENOM_DECIMALS, gasPriceStep: GAS_PRICE_STEP }],
        stakeCurrency: { coinDenom: DENOM_DISPLAY, coinMinimalDenom: DENOM_MINIMAL, coinDecimals: DENOM_DECIMALS },
      });
      await window.keplr.enable(CHAIN_ID);
      const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID);
      const accounts = await offlineSigner.getAccounts();
      if (accounts.length === 0) throw new Error("No accounts found in Keplr.");
      setAddress(accounts[0].address);
    } catch (err) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAddress(null);
    setError(null);
  }, []);

  // AI Analysis Logic
  const analyzeDocument = useCallback(async () => {
    if (!selectedFile || !address) {
      setBackendError("Please select a document and connect your wallet.");
      return;
    }
    setBackendLoading(true);
    setBackendError(null);
    setAiAnalysisResult(null);
    setWorkflowStatus('analyzing');
    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('owner_address', address);
      const response = await fetch(`${BACKEND_URL}/analyze_and_prepare`, { method: 'POST', body: formData });
      setWorkflowStatus('uploading');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setWorkflowStatus('ready');
      if (result.success) setAiAnalysisResult(result);
      else throw new Error(result.error || "Backend analysis failed.");
    } catch (err) {
      setBackendError(err.message || "An unknown error during analysis.");
      setWorkflowStatus('idle');
    } finally {
      setBackendLoading(false);
    }
  }, [selectedFile, address]);

  // Minting Logic
  const mintRwaNft = useCallback(async () => {
    if (!address || !aiAnalysisResult?.transaction_payload) {
      setMintingError("Analysis results missing.");
      return;
    }
    setWorkflowStatus('minting');
    setMintingLoading(true);
    setMintingError(null);
    setMintTxHash(null);
    try {
      const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID);
      const client = await SigningCosmWasmClient.connectWithSigner(RPC_URL, offlineSigner, { gasPrice: GasPrice.fromString(`${GAS_PRICE_STEP.average}${DENOM_MINIMAL}`) });
      const mintPayload = aiAnalysisResult.transaction_payload.verify_and_mint;
      const executeMsg = { verify_and_mint: { ...mintPayload } };
      const result = await client.execute(address, VERIFIED_RWA_CONTRACT_ADDRESS, executeMsg, "auto", "Minting A.R.I.A. RWA NFT");
      if (result.code !== undefined && result.code !== 0) {
        throw new Error(`Transaction failed: ${result.rawLog}`);
      }
      const updatedResult = { ...aiAnalysisResult, minted: true, mintedTokenId: mintPayload.token_id, mintedC721Address: NEW_CW721_ADO_ADDRESS };
      setMintTxHash(result.transactionHash);
      setAiAnalysisResult(updatedResult);
      setMintedNfts(prevNfts => [...prevNfts, updatedResult]);
      setWorkflowStatus('minted');
      toast({ title: "NFT Minted!", description: "Your RWA has been successfully brought on-chain.", status: "success", duration: 5000, isClosable: true, position: "bottom-right" });
    } catch (err) {
      setMintingError(err.message || "An unknown error occurred.");
      setWorkflowStatus('ready');
      toast({ title: "Minting Failed", description: err.message, status: "error", duration: 7000, isClosable: true, position: "bottom-right" });
    } finally {
      setMintingLoading(false);
    }
  }, [address, aiAnalysisResult, toast]);

  // Marketplace Listing Logic
  const listNftOnMarketplace = useCallback(async () => {
    if (!address || !aiAnalysisResult?.mintedTokenId || !listPrice) {
      setListingError("NFT not minted, or price missing.");
      return;
    }
    setListingLoading(true);
    setListingError(null);
    setListingTxHash(null);
    try {
      const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID);
      const client = await SigningCosmWasmClient.connectWithSigner(RPC_URL, offlineSigner, { gasPrice: GasPrice.fromString(`${GAS_PRICE_STEP.average}${DENOM_MINIMAL}`) });
      const priceInUandr = (BigInt(listPrice) * BigInt(10 ** DENOM_DECIMALS)).toString();
      const startSaleHookMsg = { start_sale: { price: priceInUandr, coin_denom: { native_token: DENOM_MINIMAL }, recipient: { address: SPLITTER_ADO_ADDRESS } } };
      const encodedHookMsg = btoa(JSON.stringify(startSaleHookMsg));
      const sendNftMsg = { send_nft: { contract: MARKETPLACE_ADO_ADDRESS, token_id: aiAnalysisResult.mintedTokenId, msg: encodedHookMsg } };
      const result = await client.execute(address, aiAnalysisResult.mintedC721Address, sendNftMsg, "auto", "Listing NFT via Splitter");
      if (result.code && result.code !== 0) {
        throw new Error(`Tx failed: ${result.rawLog}`);
      }
      const updatedResult = { ...aiAnalysisResult, listed: true };
      setListingTxHash(result.transactionHash);
      setAiAnalysisResult(updatedResult);
      setMintedNfts(prevNfts => prevNfts.map(nft => nft.transaction_payload.verify_and_mint.token_id === updatedResult.mintedTokenId ? updatedResult : nft));
      setWorkflowStatus('listed');
    } catch (err) {
      setListingError(err.message || "Unknown error");
      setWorkflowStatus('minted');
    } finally {
      setListingLoading(false);
    }
  }, [address, aiAnalysisResult, listPrice]);

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="center">
        <Header address={address} loading={loading} onConnect={connectWallet} onDisconnect={disconnectWallet} />
        {error && <Alert status="error" borderRadius="md"><AlertIcon />{error}</Alert>}
        
        {address && (
          <Box mt={2} p={6} shadow="lg" borderWidth="1px" borderRadius="xl" width="100%" bg="gray.800">
            <Heading as="h2" size="lg" mb={6} textAlign="center">A.R.I.A. Workflow</Heading>
            <FileUpload
              selectedFile={selectedFile} setSelectedFile={setSelectedFile} onAnalyze={analyzeDocument}
              backendLoading={backendLoading} mintTxHax={mintTxHash} setAiAnalysisResult={setAiAnalysisResult}
              setBackendError={setBackendError} setMintTxHash={setMintTxHash} setListingTxHash={setListingTxHash}
              setWorkflowStatus={setWorkflowStatus}
            />
            
            {(backendLoading || aiAnalysisResult) && <LiveWorkflowVisualizer status={workflowStatus} />}
            {backendError && <Alert status="error" mt={4} borderRadius="md"><AlertIcon />{backendError}</Alert>}

            {aiAnalysisResult && (
              <>
                <AIReportCard report={aiAnalysisResult.ai_report_display} ipfsLink={aiAnalysisResult.ipfs_link} />
                <PayloadViewer payload={aiAnalysisResult.transaction_payload} />
                <NftActions
                  aiAnalysisResult={aiAnalysisResult} mintRwaNft={mintRwaNft} mintingLoading={mintingLoading}
                  mintTxHash={mintTxHash} mintingError={mintingError} listNftOnMarketplace={listNftOnMarketplace}
                  listingLoading={listingLoading} listingTxHash={listingTxHash} listingError={listingError}
                  listPrice={listPrice} setListPrice={setListPrice} denomDisplay={DENOM_DISPLAY}
                />
              </>
            )}
          </Box>
        )}

        {address && (
          <StakingDashboard
            address={address}
            rpcUrl={RPC_URL}
            gasPrice={GasPrice.fromString(`${GAS_PRICE_STEP.average}${DENOM_MINIMAL}`)}
            chainId={CHAIN_ID}
            cw20AppAddress={ARIA_APP_ADDRESS}
            stakingAppAddress={STAKING_APP_ADDRESS}
            tokenSymbol="ARIA"
            tokenDecimals={6}
          />
        )}
        
        <NftGallery nfts={mintedNfts} />
      </VStack>
    </Container>
  );
}

export default App;