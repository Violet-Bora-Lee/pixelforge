export interface CheckOwnershipRequest {
  address: string;
}

export interface CheckOwnershipResponse {
  address: string;
  balance: number;
  hasNFT: boolean;
}

export interface MintKeyRequest {
  address: string;
}

export interface MintKeyResponse {
  success: boolean;
  transaction_hash: string;
  minted_to: string;
  contract_address: string;
}