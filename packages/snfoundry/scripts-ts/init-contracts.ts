import path from "path";
import { green, red, yellow } from "./helpers/colorize-log";
import deployedContracts from "../../nextjs/contracts/deployedContracts";
import { Contract, RpcProvider, Account } from "starknet";

async function main() {
  // Configuration
  const rpcUrl = process.env.NEXT_PUBLIC_PROVIDER_URL || "http://localhost:5050";
  const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY ?? "0x71d7bb07b9a64f6f78ac4c816aff4da9";
  const deployerAddress = process.env.DEPLOYER_ADDRESS ?? "0x64b48806902a367c8598f4f95c305e8c1a1acba5f082d294a43793113115691";

  // Connect to provider and account
  const provider = new RpcProvider({ nodeUrl: rpcUrl });
  const account = new Account(provider, deployerAddress, deployerPrivateKey);
  console.log(green('Account connected successfully'));

  // Load deployed contract addresses
  const avatarAddress = deployedContracts.devnet.PixelForgeAvatar.address;
  const avatarAbi = deployedContracts.devnet.PixelForgeAvatar.abi;
  const wardrobeKeyOxfordAddress = deployedContracts.devnet.WardrobeKeyOxford.address;
  const wardrobeKeyBoredApesAddress = deployedContracts.devnet.WardrobeKeyBoredApes.address;

  // Create contract instances
  const avatarContract = new Contract(avatarAbi, avatarAddress, account);

  try {
    // Register affiliates
    console.log(yellow('Registering affiliates...'));
    
    const boredApesAffiliate = 'bored_apes';
    const oxfordAffiliate = 'oxford';

    await avatarContract.invoke('register_affiliate', [
      boredApesAffiliate,
      wardrobeKeyBoredApesAddress
    ]);
    console.log(green(`Registered Bored Apes affiliate: ${wardrobeKeyBoredApesAddress}`));

    await avatarContract.invoke('register_affiliate', [
      oxfordAffiliate,
      wardrobeKeyOxfordAddress
    ]);
    console.log(green(`Registered Oxford affiliate: ${wardrobeKeyOxfordAddress}`));

    // Register accessories for Bored Apes
    console.log(yellow('Registering Bored Apes accessories...'));
    await avatarContract.invoke('register_accessory', [boredApesAffiliate, 'hat']);
    await avatarContract.invoke('register_accessory', [boredApesAffiliate, 't-shirt']);
    console.log(green('Registered Bored Apes accessories'));

    // Register accessories for Oxford
    console.log(yellow('Registering Oxford accessories...'));
    await avatarContract.invoke('register_accessory', [oxfordAffiliate, 'glasses']);
    console.log(green('Registered Oxford accessories'));

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

  // TODO: use multicall to register affiliates and accessories