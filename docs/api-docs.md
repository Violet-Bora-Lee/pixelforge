# API Documentation

## Endpoints

### Check if wallet has Bored Apes NFTs
**Endpoint:** `/api/checkOwnership`
**Method:** POST

#### Request
```json
{
  "address": "string" // Ethereum wallet address
}
```

#### Response
**Success (200)**
```json
{
  "address": "string",
  "balance": "number",
  "hasNFT": "boolean"
}
```

**Error (400)**
```json
{
  "error": "Address is required"
}
```

**Error (500)**
```json
{
  "error": "Failed to check NFT balance"
}
```

---

### Mint Wardrobe Key
**Endpoint:** `/api/mintKey`
**Method:** POST

#### Request
```json
{
  "address": "string" // Starknet wallet address
}
```

#### Response
**Success (200)**
```json
{
  "success": true,
  "transaction_hash": "string",
  "minted_to": "string",
  "contract_address": "string"
}
```

**Error (400)**
```json
{
  "error": "Address is required"
}
```

**Error (500)**
```json
{
  "error": "Failed to mint key"
}
```

## Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_PROVIDER_URL` - Starknet RPC URL (defaults to "http://localhost:5050")
- `DEPLOYER_PRIVATE_KEY` - Deployer wallet private key
- `DEPLOYER_ADDRESS` - Deployer wallet address

## Contract Dependencies

- `checkOwnership`: Uses ERC721 contract at address `0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D` on mainnet
- `mintKey`: Uses WardrobeKey contract deployed on devnet (address from deployedContracts)
