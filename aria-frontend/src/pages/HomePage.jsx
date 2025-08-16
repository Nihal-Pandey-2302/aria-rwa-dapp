import { useState, useCallback } from 'react';
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

// Component Imports
import FileUpload from '../components/FileUpload';
import LiveWorkflowVisualizer from '../components/LiveWorkflowVisualizer';
import AIReportCard from '../components/AIReportCard';
import PayloadViewer from '../components/PayloadViewer';
import NftActions from '../components/NftActions';
import NftGallery from '../components/NftGallery';

// Import your constants
import {
    CHAIN_ID, RPC_URL, GAS_PRICE_STEP, DENOM_MINIMAL, DENOM_DISPLAY, DENOM_DECIMALS,
    BACKEND_URL, VERIFIED_RWA_CONTRACT_ADDRESS, NEW_CW721_ADO_ADDRESS,
    MARKETPLACE_ADO_ADDRESS, SPLITTER_ADO_ADDRESS
} from '../constants'; // We will create this constants file later

export default function HomePage({ address }) {
  // All the state related to the workflow moves here
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
  const [workflowStatus, setWorkflowStatus] = useState('idle');
  const [mintedNfts, setMintedNfts] = useState([]);
  const toast = useToast();

  // All the workflow-related functions (analyze, mint, list) also move here
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
      <VStack spacing={8} align="stretch">
        <Box p={6} shadow="lg" borderWidth="1px" borderRadius="xl" width="100%" bg="gray.800">
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
        <NftGallery nfts={mintedNfts} />
      </VStack>
    </Container>
  );
}