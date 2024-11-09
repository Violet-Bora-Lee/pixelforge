import path from "path";
import { green, red, yellow } from "./helpers/colorize-log";
import deployedContracts from "../../nextjs/contracts/deployedContracts";
import scaffoldConfig from "../../nextjs/scaffold.config";
import dotenv from "dotenv";

import { Contract, RpcProvider, Account } from "starknet";

dotenv.config();

async function main() {
  // Configuration
  const preferredChain = scaffoldConfig.targetNetworks[0].network as string;
  console.log(yellow(`Using ${preferredChain} network`));

  const rpcUrl = preferredChain === "devnet" ? "http://localhost:5050" : process.env.RPC_URL_SEPOLIA;
  console.log(yellow(`Using ${rpcUrl} as RPC URL`));

  const deployerPrivateKey = preferredChain === "devnet" ? "0x71d7bb07b9a64f6f78ac4c816aff4da9" : process.env.PRIVATE_KEY_SEPOLIA;
  const deployerAddress = preferredChain === "devnet" ? "0x64b48806902a367c8598f4f95c305e8c1a1acba5f082d294a43793113115691" : process.env.ACCOUNT_ADDRESS_SEPOLIA;

  // Connect to provider and account
  const provider = new RpcProvider({ nodeUrl: rpcUrl });
  const account = new Account(provider, deployerAddress, deployerPrivateKey);
  console.log(green('Account connected successfully'));

  // Load deployed contract addresses
  const avatarAddress = deployedContracts[preferredChain].PixelForgeAvatar.address;
  const avatarAbi = deployedContracts[preferredChain].PixelForgeAvatar.abi;
  const wardrobeKeyOxfordAddress = deployedContracts[preferredChain].WardrobeKeyOxford.address;
  const wardrobeKeyBoredApesAddress = deployedContracts[preferredChain].WardrobeKeyBoredApes.address;

  // Create contract instances
  const avatarContract = new Contract(avatarAbi, avatarAddress, account);

  try {
    // Register affiliates
    console.log(yellow('Registering affiliates...'));
    
    const boredApesAffiliate = 'bored_apes';
    const oxfordAffiliate = 'oxford';

    console.log(green(`Registering Bored Apes affiliate: ${wardrobeKeyBoredApesAddress}`));
    const boredApesRegistration = avatarContract.populate('register_affiliate', [
      boredApesAffiliate,
      wardrobeKeyBoredApesAddress
    ]);

    console.log(green(`Registering Oxford affiliate: ${wardrobeKeyOxfordAddress}`));
    const oxfordRegistration = avatarContract.populate('register_affiliate', [
      oxfordAffiliate,
      wardrobeKeyOxfordAddress
    ]);

    // Register accessories for Bored Apes
    console.log(yellow('Registering Bored Apes accessories...'));
    const boredApesAccessoryRegistration = [
      avatarContract.populate('register_accessory', [boredApesAffiliate, 'hat']),
      avatarContract.populate('register_accessory', [boredApesAffiliate, 't-shirt'])
    ];

    // Register accessories for Oxford
    console.log(yellow('Registering Oxford accessories...'));
    const oxfordAccessoryRegistration = avatarContract.populate('register_accessory', [oxfordAffiliate, 'glasses']);

    console.log(green('Sending transactions...'));

    const result = await account.execute([
      boredApesRegistration,
      oxfordRegistration,
      ...boredApesAccessoryRegistration,
      oxfordAccessoryRegistration
    ]);

    console.log(green(`Waiting for transaction ${result.transaction_hash} to be included in a block...`));
    const txReceipt = await provider.waitForTransaction(result.transaction_hash);

    console.log(green('Initialization completed successfully!'));
  } catch (error) {
    console.error(red('Error during initialization:'), error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
