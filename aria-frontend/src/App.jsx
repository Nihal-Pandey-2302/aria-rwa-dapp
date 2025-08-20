import { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, VStack, Alert, AlertIcon, Heading } from '@chakra-ui/react';

// Page Imports
import HomePage from './pages/HomePage';
import StakingPage from './pages/StakingPage';
import MarketplacePage from './pages/MarketplacePage'; // 1. Import the new page

// Component Imports
import Header from './components/Header';
import Navbar from './components/Navbar';

// Constants
import {
  CHAIN_ID, CHAIN_NAME, RPC_URL, REST_URL, BECH32_PREFIX,
  DENOM_DISPLAY, DENOM_MINIMAL, DENOM_DECIMALS, GAS_PRICE_STEP
} from './constants';

function App() {
  // Global state (wallet connection) stays in App.jsx
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Wallet connection logic also stays here
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

  return (
    <Container maxW="container.xl" py={4}>
      <VStack spacing={4} align="stretch">
        <Header address={address} loading={loading} onConnect={connectWallet} onDisconnect={disconnectWallet} />
        <Navbar />
        {error && <Alert status="error" borderRadius="md"><AlertIcon />{error}</Alert>}
        
        <Routes>
          <Route path="/" element={<HomePage address={address} />} />

          {/* 2. Add the route for the Marketplace page */}
          <Route 
            path="/marketplace" 
            element={
              address 
                ? <MarketplacePage address={address} /> 
                : <VStack><Heading size="md">Please connect your wallet to view the marketplace.</Heading></VStack>
            } 
          />

          <Route path="/staking" element={<StakingPage address={address} />} />
        </Routes>
      </VStack>
    </Container>
  );
}

export default App;