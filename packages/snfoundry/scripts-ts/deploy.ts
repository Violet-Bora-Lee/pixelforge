import {
  deployContract,
  executeDeployCalls,
  exportDeployments,
  deployer,
} from "./deploy-contract";
import { green } from "./helpers/colorize-log";

/**
 * Deploy a contract using the specified parameters.
 *
 * @example (deploy contract with contructorArgs)
 * const deployScript = async (): Promise<void> => {
 *   await deployContract(
 *     {
 *       contract: "YourContract",
 *       contractName: "YourContractExportName",
 *       constructorArgs: {
 *         owner: deployer.address,
 *       },
 *       options: {
 *         maxFee: BigInt(1000000000000)
 *       }
 *     }
 *   );
 * };
 *
 * @example (deploy contract without contructorArgs)
 * const deployScript = async (): Promise<void> => {
 *   await deployContract(
 *     {
 *       contract: "YourContract",
 *       contractName: "YourContractExportName",
 *       options: {
 *         maxFee: BigInt(1000000000000)
 *       }
 *     }
 *   );
 * };
 *
 *
 * @returns {Promise<void>}
 */
const deployScript = async (): Promise<void> => {
  // Deploy bored apes key
  const { address: boredApeKeyAddress } = await deployContract({
    contract: "WardrobeKey",
    constructorArgs: {
      owner: deployer.address,
      base_uri: "https://pixelforge.io/bored-apes-key/", // TODO: change this to the actual base uri
    },
    contractName: "WardrobeKeyBoredApes",
  });
  // Deploy Oxford key
  const { address: oxfordKeyAddress } = await deployContract({
    contract: "WardrobeKey",
    contractName: "WardrobeKeyOxford",
    constructorArgs: {
      owner: deployer.address,
      base_uri: "https://pixelforge.io/oxford-key/",
    },
  });
  // Deploy PixelForgeAvatar
  const { address: avatarAddress } = await deployContract({
    contract: "PixelForgeAvatar",
    constructorArgs: {
      owner: deployer.address,
      base_uri: "https://pixelforge.io/avatar/",
    },
  });
  // Register affiliates
  // TODO (need to do it manually now)
};

deployScript()
  .then(async () => {
    executeDeployCalls()
      .then(() => {
        exportDeployments();
        console.log(green("All Setup Done"));
      })
      .catch((e) => {
        console.error(e);
        process.exit(1); // exit with error so that non subsequent scripts are run
      });
  })
  .catch(console.error);
