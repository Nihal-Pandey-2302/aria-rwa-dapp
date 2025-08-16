import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import StakingDashboard from '../components/StakingDashboard';
import { GasPrice } from '@cosmjs/stargate';

// Import your constants
import {
    RPC_URL, GAS_PRICE_STEP, DENOM_MINIMAL, CHAIN_ID,
    ARIA_APP_ADDRESS, STAKING_APP_ADDRESS
} from '../constants';

export default function StakingPage({ address }) {
  if (!address) {
    return (
      <Container centerContent py={10}>
        <VStack spacing={4}>
          <Heading>Staking Dashboard</Heading>
          <Text>Please connect your wallet to view staking information.</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
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
    </Container>
  );
}