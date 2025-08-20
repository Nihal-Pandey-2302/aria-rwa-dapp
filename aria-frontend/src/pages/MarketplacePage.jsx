// src/pages/MarketplacePage.jsx
import { useState, useEffect, useCallback } from 'react';
import { Box, Button, Heading, Text, VStack, Spinner, Alert, AlertIcon, SimpleGrid, Image, useToast } from '@chakra-ui/react';
import { CosmWasmClient, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';

import { RPC_URL, GAS_PRICE_STEP, DENOM_MINIMAL, DENOM_DISPLAY, DENOM_DECIMALS, MARKETPLACE_ADO_ADDRESS, CHAIN_ID } from '../constants';

const MarketplacePage = ({ address }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buyingNft, setBuyingNft] = useState(null);
  const toast = useToast();

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const client = await CosmWasmClient.connect(RPC_URL);
      const allSalesDetails = [];

      // Step 1: Query all authorized CW721 contract addresses
      const authorizedCw721s = await client.queryContractSmart(MARKETPLACE_ADO_ADDRESS, {
        authorized_addresses: { action: "send_nft", limit: 50 }
      });

      if (!authorizedCw721s.addresses || authorizedCw721s.addresses.length === 0) {
        setSales([]);
        setLoading(false);
        return;
      }

      // Step 2: For each CW721 address, get its sale infos
      for (const cw721Address of authorizedCw721s.addresses) {
        try {
          const saleInfos = await client.queryContractSmart(MARKETPLACE_ADO_ADDRESS, {
            sale_infos_for_address: { token_address: cw721Address, limit: 100 }
          });

          // Step 3 & 4: For each sale, get its state and metadata
          for (const saleInfo of saleInfos.sale_infos) {
            for (const saleId of saleInfo.sale_ids) {
              try {
                // Get sale state (price, seller)
                const saleState = await client.queryContractSmart(MARKETPLACE_ADO_ADDRESS, {
                  sale_state: { sale_id: saleId }
                });
                
                // Only process if the sale is open
                if (saleState.status.toLowerCase() !== 'open') continue;

                // Get NFT metadata
                const nftInfo = await client.queryContractSmart(cw721Address, {
                  nft_info: { token_id: saleInfo.token_id }
                });

                const ipfsUrl = nftInfo.token_uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
                const metadataResponse = await fetch(ipfsUrl);
                const metadata = await metadataResponse.json();

                allSalesDetails.push({
                  sale_id: saleId,
                  token_id: saleInfo.token_id,
                  token_address: cw721Address,
                  price: saleState.price.amount,
                  seller: saleState.seller,
                  metadata: metadata,
                });
              } catch (e) {
                console.error(`Failed to fetch details for sale ID ${saleId}`, e);
              }
            }
          }
        } catch (e) {
          console.error(`Failed to fetch sale infos for address ${cw721Address}`, e);
        }
      }

      setSales(allSalesDetails);

    } catch (err) {
      console.error("Failed to fetch marketplace sales:", err);
      setError("Could not fetch sales. There was an issue with the multi-step query process.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const handleBuy = useCallback(async (sale) => {
    if (!address) {
      toast({ title: "Please connect your wallet to buy", status: "warning", position: "bottom-right", isClosable: true });
      return;
    }
    setBuyingNft(sale.sale_id);
    try {
      if (!window.keplr) throw new Error("Keplr wallet not found.");
      await window.keplr.enable(CHAIN_ID);
      const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID);
      const client = await SigningCosmWasmClient.connectWithSigner(RPC_URL, offlineSigner, { gasPrice: GasPrice.fromString(`${GAS_PRICE_STEP.average}${DENOM_MINIMAL}`) });

      // According to docs, the `buy` message uses `sale_id`
      const executeMsg = {
        buy: {
          sale_id: sale.sale_id,
        }
      };

      const funds = [{
        amount: sale.price,
        denom: DENOM_MINIMAL,
      }];

      const result = await client.execute(
        address,
        MARKETPLACE_ADO_ADDRESS,
        executeMsg,
        "auto",
        `Buying RWA NFT (Sale ID: ${sale.sale_id})`,
        funds
      );

      if (result.code !== 0) throw new Error(`Transaction failed: ${result.rawLog}`);
      
      toast({ title: "Purchase Successful!", description: `You are now the owner of RWA NFT #${sale.token_id}.`, status: "success", position: "bottom-right", isClosable: true });
      fetchSales();

    } catch (err) {
      console.error("Failed to buy NFT:", err);
      toast({ title: "Purchase Failed", description: err.message, status: "error", position: "bottom-right", isClosable: true });
    } finally {
      setBuyingNft(null);
    }
  }, [address, toast, fetchSales]);

  if (loading) return <VStack><Spinner size="xl" /><Text>Loading Marketplace...</Text></VStack>;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;

  return (
    <Box mt={2} p={6} shadow="lg" borderWidth="1px" borderRadius="xl" width="100%" bg="gray.800">
      <Heading as="h2" size="lg" mb={6} textAlign="center">RWA Marketplace</Heading>
      {sales.length === 0 ? (
        <Text textAlign="center">No RWA NFTs are currently for sale.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {sales.map((sale) => (
            <Box key={sale.sale_id} p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="gray.700">
              <VStack spacing={4}>
                <Image
                  src={sale.metadata.image?.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                  alt={sale.metadata.name}
                  borderRadius="md"
                  boxSize="200px"
                  objectFit="cover"
                  fallbackSrc="https://via.placeholder.com/200"
                />
                <Heading size="md" noOfLines={1}>{sale.metadata.name || `RWA #${sale.token_id}`}</Heading>
                <Text fontWeight="bold" fontSize="lg" color="purple.300">
                  {parseInt(sale.price) / (10 ** DENOM_DECIMALS)} {DENOM_DISPLAY}
                </Text>
                <Button
                  colorScheme="purple"
                  width="100%"
                  onClick={() => handleBuy(sale)}
                  isLoading={buyingNft === sale.sale_id}
                  isDisabled={address === sale.seller}
                >
                  {address === sale.seller ? "You are the seller" : "Buy Now"}
                </Button>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default MarketplacePage;