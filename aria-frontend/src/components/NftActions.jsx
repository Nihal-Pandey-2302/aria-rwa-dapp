// src/components/NftActions.jsx

import {
  Box, Button, VStack, Spinner, Alert, AlertIcon, Heading, Text, Input,
  InputGroup, InputRightElement,
} from '@chakra-ui/react';
import { FaTwitter } from 'react-icons/fa';

const NftActions = ({
  aiAnalysisResult, mintRwaNft, mintingLoading, mintTxHash, mintingError,
  listNftOnMarketplace, listingLoading, listingTxHash, listingError,
  listPrice, setListPrice, denomDisplay,
}) => {

  const hasMinted = !!mintTxHash;
  const hasListed = !!listingTxHash;

  return (
    <Box width="100%" mt={6}>
      {/* === MINTING SECTION === */}
      {!hasMinted && (
        <Button
          mt={6} colorScheme="purple" size="lg" onClick={mintRwaNft}
          isLoading={mintingLoading} isDisabled={!aiAnalysisResult} w="100%"
        >
          {mintingLoading ? <Spinner size="sm" /> : "Mint Verified RWA NFT"}
        </Button>
      )}

      {mintingError && (
        <Alert status="error" mt={4} borderRadius="md"><AlertIcon />{mintingError}</Alert>
      )}

      {/* === POST-MINT / LISTING SECTION === */}
      {hasMinted && (
        <Box mt={8}>
          <Alert status="success" borderRadius="md" w="100%" mb={4}>
            <AlertIcon />
            NFT Minted Successfully!
          </Alert>
          <Button
            as="a" href={`https://twitter.com/intent/tweet?text=I just verified and minted an RWA as an NFT using A.R.I.A. on @AndromedaProt!&url=https://explorer.testnet.andromedaprotocol.io/galileo-4/tx/${mintTxHash}`}
            target="_blank" rel="noopener noreferrer" colorScheme="twitter"
            leftIcon={<FaTwitter />} w="100%"
          >
            Share on X
          </Button>

          {/* Show Listing UI only if it has NOT been listed yet */}
          {!hasListed && (
            <Box mt={8} p={5} shadow="sm" borderWidth="1px" borderRadius="md" borderColor="gray.700">
              <Heading as="h3" size="md" mb={4}>List for Sale</Heading>
              <VStack spacing={4}>
                <InputGroup>
                  <Input
                    placeholder="Enter price" value={listPrice}
                    onChange={(e) => setListPrice(e.target.value)} type="number"
                  />
                  <InputRightElement width="4.5rem">
                    <Text mr={2} color="gray.400">{denomDisplay}</Text>
                  </InputRightElement>
                </InputGroup>
                <Button
                  onClick={listNftOnMarketplace} isLoading={listingLoading}
                  isDisabled={!listPrice || parseFloat(listPrice) <= 0}
                  colorScheme="green" size="lg" w="100%"
                >
                  {listingLoading ? <Spinner size="sm" /> : "List on Marketplace"}
                </Button>
              </VStack>
            </Box>
          )}

          {listingError && (
            <Alert status="error" mt={4} borderRadius="md"><AlertIcon />{listingError}</Alert>
          )}

          {hasListed && (
            <Alert status="success" mt={4} borderRadius="md">
              <AlertIcon />
              <Box>
                <Text>Successfully listed on Marketplace!</Text>
                <Text as="a" href={`https://explorer.testnet.andromedaprotocol.io/galileo-4/tx/${listingTxHash}`} target="_blank" textDecoration="underline" fontSize="sm">
                  View Transaction
                </Text>
              </Box>
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
};

export default NftActions;