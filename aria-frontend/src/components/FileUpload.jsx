// src/components/FileUpload.jsx
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiUploadCloud } from 'react-icons/fi';

// ✅ ACTION: Add the new props to the function definition
const FileUpload = ({
  selectedFile,
  setSelectedFile,
  onAnalyze,
  backendLoading,
  mintTxHash,
  setAiAnalysisResult,
  setBackendError,
  setMintTxHash,
  setListingTxHash
}) => {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      // ✅ CORE FIX: Reset all subsequent state when a new file is selected.
      // This prevents using stale data from a previous upload.
      setSelectedFile(acceptedFiles[0]);
      setAiAnalysisResult(null);
      setBackendError(null);
      setMintTxHash(null);
      setListingTxHash(null);
    }
  }, [setSelectedFile, setAiAnalysisResult, setBackendError, setMintTxHash, setListingTxHash]); // Add setters to dependency array

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  return (
    <VStack spacing={5}>
      <motion.div
        {...getRootProps()}
        style={{
          padding: '2.5rem',
          borderWidth: '2px',
          borderRadius: '0.5rem',
          borderStyle: 'dashed',
          borderColor: isDragActive ? '#9F7AEA' : '#4A5568',
          width: '100%',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease-in-out',
        }}
        whileHover={{ scale: 1.02, borderColor: '#B794F4' }}
      >
        <input {...getInputProps()} />
        <VStack>
          <Icon as={FiUploadCloud} w={12} h={12} color={isDragActive ? "purple.300" : "gray.500"} />
          {isDragActive ?
            <Text fontSize="lg" color="purple.300">Drop the document here...</Text> :
            <Text fontSize="lg">Drag 'n' drop your document, or click to select</Text>
          }
          <Text fontSize="sm" color="gray.400">(PDF, JPG, PNG)</Text>
        </VStack>
      </motion.div>

      {selectedFile && (
        <Text fontSize="md" color="green.300">Selected: <Text as="span" fontWeight="bold">{selectedFile.name}</Text></Text>
      )}

      <Button
        onClick={onAnalyze}
        isLoading={backendLoading}
        isDisabled={!selectedFile || backendLoading || !!mintTxHash}
        colorScheme="purple"
        size="lg"
        w="100%"
      >
        Analyze Document with AI
      </Button>
    </VStack>
  );
};

export default FileUpload;