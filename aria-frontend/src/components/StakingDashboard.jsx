// src/components/StakingDashboard.jsx

import { useState, useEffect, useCallback } from 'react';
import {
  Box, Heading, Text, VStack, Button, Input, InputGroup,
  InputRightAddon, Spinner, Stat, StatLabel, StatNumber, useToast,
  SimpleGrid
} from '@chakra-ui/react';
import { CosmWasmClient, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';

const StakingDashboard = ({
  address,
  rpcUrl,
  gasPrice,
  chainId,
  cw20AppAddress,
  stakingAppAddress,
  tokenSymbol,
  tokenDecimals
}) => {
  const [loading, setLoading] = useState(true);
  const [stakingLoading, setStakingLoading] = useState(false);
  
  const [resolvedCw20Address, setResolvedCw20Address] = useState('');
  const [resolvedStakingAddress, setResolvedStakingAddress] = useState('');

  const [ariaBalance, setAriaBalance] = useState('0');
  const [stakedBalance, setStakedBalance] = useState('0');
  const [stakeAmount, setStakeAmount] = useState('');
  const toast = useToast();

  const formatBalance = (balance) => {
    if (!balance) return '0.00';
    return (parseInt(balance) / (10 ** tokenDecimals)).toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  useEffect(() => {
    const resolveAppAddresses = async () => {
      try {
        const client = await CosmWasmClient.connect(rpcUrl);
        
        // ✅ UPDATED to use your specific component name "cw20-1"
        const realCw20Addr = await client.queryContractSmart(cw20AppAddress, { get_address: { name: 'cw20-1' } });
        setResolvedCw20Address(realCw20Addr);
        
        // ✅ UPDATED to use your specific component name "cw20-staking-1"
        const realStakingAddr = await client.queryContractSmart(stakingAppAddress, { get_address: { name: 'cw20-staking-1' } });
        setResolvedStakingAddress(realStakingAddr);
      } catch (error) {
        console.error("Failed to resolve App component addresses:", error);
        toast({ title: "Initialization Error", description: "Could not find underlying contracts. Ensure component names are correct.", status: "error" });
      }
    };
    resolveAppAddresses();
  }, [rpcUrl, cw20AppAddress, stakingAppAddress, toast]);

  const fetchBalances = useCallback(async () => {
    if (!address || !resolvedCw20Address || !resolvedStakingAddress) return;
    
    setLoading(true);
    try {
      const client = await CosmWasmClient.connect(rpcUrl);
      const balanceQuery = { balance: { address } };
      const balanceResponse = await client.queryContractSmart(resolvedCw20Address, balanceQuery);
      setAriaBalance(balanceResponse.balance);

      const stakerQuery = { staker: { address } };
      const stakerResponse = await client.queryContractSmart(resolvedStakingAddress, stakerQuery);
      setStakedBalance(stakerResponse.balance);
    } catch (error) {
      console.warn("Could not fetch staking balances (user may not have staked yet):", error);
      setAriaBalance('0'); // Reset both on error
      setStakedBalance('0');
    } finally {
      setLoading(false);
    }
  }, [address, rpcUrl, resolvedCw20Address, resolvedStakingAddress]);

  useEffect(() => {
    if (resolvedCw20Address && resolvedStakingAddress) {
      fetchBalances();
    }
  }, [fetchBalances, resolvedCw20Address, resolvedStakingAddress]);

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast({ title: "Invalid Amount", status: "error", duration: 3000 });
      return;
    }
    setStakingLoading(true);
    try {
      const offlineSigner = window.keplr.getOfflineSigner(chainId);
      const client = await SigningCosmWasmClient.connectWithSigner(rpcUrl, offlineSigner, { gasPrice });

      const amountToStake = (parseFloat(stakeAmount) * (10 ** tokenDecimals)).toString();
      const hookMsg = btoa(JSON.stringify({ stake_tokens: {} }));

      const executeMsg = {
        send: {
          contract: resolvedStakingAddress,
          amount: amountToStake,
          msg: hookMsg,
        },
      };

      await client.execute(address, resolvedCw20Address, executeMsg, "auto", "Staking ARIA Tokens");

      toast({ title: "Stake Successful!", status: "success", duration: 5000, isClosable: true });
      setStakeAmount('');
      fetchBalances();
    } catch (error) {
      console.error("Staking failed:", error);
      toast({ title: "Staking Failed", description: error.message, status: "error", duration: 5000 });
    } finally {
      setStakingLoading(false);
    }
  };

  return (
    <Box mt={12} p={6} shadow="lg" borderWidth="1px" borderRadius="xl" width="100%" bg="gray.900">
      <Heading as="h2" size="lg" mb={6} textAlign="center">
        $ARIA Governance & Staking
      </Heading>
      {loading || !resolvedCw20Address ? (
        <VStack><Spinner color="purple.400" /></VStack>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <VStack spacing={4} align="stretch">
            <Stat>
              <StatLabel color="gray.400">Your $ARIA Balance</StatLabel>
              <StatNumber fontSize="4xl">{formatBalance(ariaBalance)}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel color="gray.400">Your Staked Balance (with Rewards)</StatLabel>
              <StatNumber fontSize="4xl">{formatBalance(stakedBalance)}</StatNumber>
            </Stat>
          </VStack>
          <VStack spacing={4} align="stretch" justify="center">
            <Text>Stake your $ARIA to earn a share of the platform fees.</Text>
            <InputGroup>
              <Input
                placeholder="Amount to Stake" type="number" value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
              />
              <InputRightAddon bg="gray.700" borderColor="gray.600">{tokenSymbol}</InputRightAddon>
            </InputGroup>
            <Button
              colorScheme="purple" onClick={handleStake}
              isLoading={stakingLoading} isDisabled={!address}
            >
              Stake Tokens
            </Button>
          </VStack>
        </SimpleGrid>
      )}
    </Box>
  );
};

export default StakingDashboard;