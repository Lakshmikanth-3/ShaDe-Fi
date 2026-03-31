# Set up Hardhat

In this section, you’ll learn how to set up a FHEVM Hardhat development environment using the **FHEVM Hardhat template** as a starting point for building and testing fully homomorphic encrypted smart contracts.

## Create a local Hardhat Project

{% stepper %}
{% step %}

#### Install a Node.js TLS version

Ensure that Node.js is installed on your machine.

* Download and install the recommended LTS (Long-Term Support) version from the [official website](https://nodejs.org/en).
* Use an **even-numbered** version (e.g., `v18.x`, `v20.x`)

{% hint style="warning" %}
**Hardhat** does not support odd-numbered Node.js versions. If you’re using one (e.g., v21.x, v23.x), Hardhat will display a persistent warning message and may behave unexpectedly.
{% endhint %}

To verify your installation:

```sh
node -v
npm -v
```

{% endstep %}

{% step %}

#### Create a new GitHub repository from the FHEVM Hardhat template.

1. On GitHub, navigate to the main page of the [FHEVM Hardhat template](https://github.com/zama-ai/fhevm-hardhat-template) repository.
2. Above the file list, click the green **Use this template** button.
3. Follow the instructions to create a new repository from the FHEVM Hardhat template.

{% hint style="info" %}
See Github doc: [Creating a repository from a template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template#creating-a-repository-from-a-template)
{% endhint %}
{% endstep %}

{% step %}

#### Clone your newly created GitHub repository locally

Now that your GitHub repository has been created, you can clone it to your local machine:

```sh
cd <your-preferred-location>
git clone <url-to-your-new-repo>

# Navigate to the root of your new FHEVM Hardhat project
cd <your-new-repo-name>
```

Next, let’s install your local Hardhat development environment.
{% endstep %}

{% step %}

#### Install your FHEVM Hardhat project dependencies

From the project root directory, run:

```sh
npm install
```

This will install all required dependencies defined in your `package.json`, setting up your local FHEVM Hardhat development environment.
{% endstep %}

{% step %}

#### Set up the Hardhat configuration variables (optional)

If you do plan to deploy to the Sepolia Ethereum Testnet, you'll need to set up the following [Hardhat Configuration variables](https://hardhat.org/hardhat-runner/docs/guides/configuration-variables).

`MNEMONIC`

A mnemonic is a 12-word seed phrase used to generate your Ethereum wallet keys.

1. Get one by creating a wallet with [MetaMask](https://metamask.io/), or using any trusted mnemonic generator.
2. Set it up in your Hardhat project:

```sh
npx hardhat vars set MNEMONIC
```

`INFURA_API_KEY`

The INFURA project key allows you to connect to Ethereum testnets like Sepolia.

1. Obtain one by following the[ Infura + MetaMask](https://docs.metamask.io/services/get-started/infura/) setup guide.
2. Configure it in your project:

```sh
npx hardhat vars set INFURA_API_KEY
```

**Default Values**

If you skip this step, Hardhat will fall back to these defaults:

* `MNEMONIC` = "test test test test test test test test test test test junk"
* `INFURA_API_KEY` = "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"

{% hint style="warning" %}
These defaults are not suitable for real deployments.
{% endhint %}

{% hint style="warning" %}

#### Missing variable error:

If any of the requested Hardhat Configuration Variables is missing, you'll get an error message like this one:`Error HH1201: Cannot find a value for the configuration variable 'MNEMONIC'. Use 'npx hardhat vars set MNEMONIC' to set it or 'npx hardhat var setup' to list all the configuration variables used by this project.`
{% endhint %}
{% endstep %}
{% endstepper %}

Congratulations! You're all set to start building your confidential dApp.

## Optional settings

### Install VSCode extensions

If you're using Visual Studio Code, there are some extensions available to improve you your development experience:

* [Prettier - Code formatter by prettier.io](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) — ID:`esbenp.prettier-vscode`,
* [ESLint by Microsoft](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) — ID:`dbaeumer.vscode-eslint`

Solidity support (pick one only):

* [Solidity by Juan Blanco](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) — ID:`juanblanco.solidity`
* [Solidity by Nomic Foundation](https://marketplace.visualstudio.com/items?itemName=NomicFoundation.hardhat-solidity) — ID:`nomicfoundation.hardhat-solidity`

### Reset the Hardhat project

If you'd like to start from a clean slate, you can reset your FHEVM Hardhat project by removing all example code and generated files.

```sh
# Navigate to the root of your new FHEVM Hardhat project
cd <your-new-repo-name>
```

Then run:

```sh
rm -rf test/* src/* deploy ./fhevmTemp ./artifacts ./cache ./coverage ./types ./coverage.json ./dist
```

# 2. Write a simple contract

In this tutorial, you'll write and test a simple regular Solidity smart contract within the FHEVM Hardhat template to get familiar with Hardhat workflow.

In the [next tutorial](https://docs.zama.org/protocol/solidity-guides/getting-started/quick-start-tutorial/turn_it_into_fhevm), you'll learn how to convert this contract into an FHEVM contract.

## Prerequisite

* [Set up your Hardhat envrionment](https://docs.zama.org/protocol/solidity-guides/getting-started/setup).
* Make sure that you Hardhat project is clean and ready to start. See the instructions [here](https://docs.zama.org/protocol/solidity-guides/setup#rest-set-the-hardhat-envrionment).

## What you'll learn

By the end of this tutorial, you will learn to:

* Write a minimal Solidity contract using Hardhat.
* Test the contract using TypeScript and Hardhat’s testing framework.

## Write a simple contract

{% stepper %}
{% step %}

### Create `Counter.sol`

Go to your project's `contracts` directory:

```sh
cd <your-project-root-directory>/contracts
```

From there, create a new file named `Counter.sol` and copy/paste the following Solidity code in it.

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

/// @title A simple counter contract
contract Counter {
  uint32 private _count;

  /// @notice Returns the current count
  function getCount() external view returns (uint32) {
    return _count;
  }

  /// @notice Increments the counter by a specific value
  function increment(uint32 value) external {
    _count += value;
  }

  /// @notice Decrements the counter by a specific value
  function decrement(uint32 value) external {
    require(_count >= value, "Counter: cannot decrement below zero");
    _count -= value;
  }
}
```

{% endstep %}

{% step %}

### Compile `Counter.sol`

From your project's root directory, run:

```sh
npx hardhat compile
```

Great! Your Smart Contract is now compiled.
{% endstep %}
{% endstepper %}

## Set up the testing environment

{% stepper %}
{% step %}

### Create a test script `test/Counter.ts`

Go to your project's `test` directory

```sh
cd <your-project-root-directory>/test
```

From there, create a new file named `Counter.ts` and copy/paste the following Typescript skeleton code in it.

```ts
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers } from "hardhat";

describe("Counter", function () {
  it("empty test", async function () {
    console.log("Cool! The test basic skeleton is running!");
  });
});
```

The file contains the following:

* all the required `import` statements we will need during the various tests
* The `chai` basic statements to run a first empty test named `empty test`
  {% endstep %}

{% step %}

### Run the test `test/Counter.ts`

From your project's root directory, run:

```sh
npx hardhat test
```

Output:

```sh
  Counter
Cool! The test basic skeleton is running!
    ✔ empty test


  1 passing (1ms)
```

Great! Your Hardhat test environment is properly setup.
{% endstep %}

{% step %}

### Set up the test signers

Before interacting with smart contracts in Hardhat tests, we need to initialize signers.

{% hint style="info" %}
In the context of Ethereum development, a signer represents an entity (usually a wallet) that can send transactions and sign messages. In Hardhat, `ethers.getSigners()` returns a list of pre-funded test accounts.
{% endhint %}

We’ll define three named signers for convenience:

* `owner` — the deployer of the contract
* `alice` and `bob` — additional simulated users

**Replace the contents of `test/Counter.ts` with the following:**

```ts
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers } from "hardhat";

type Signers = {
  owner: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

describe("Counter", function () {
  let signers: Signers;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { owner: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  it("should work", async function () {
    console.log(`address of user owner is ${signers.owner.address}`);
    console.log(`address of user alice is ${signers.alice.address}`);
    console.log(`address of user bob is ${signers.bob.address}`);
  });
});
```

**Run the test**

From your project's root directory, run:

```sh
npx hardhat test
```

**Expected Output**

```sh
  Counter
address of user owner is 0x37AC010c1c566696326813b840319B58Bb5840E4
address of user alice is 0xD9F9298BbcD72843586e7E08DAe577E3a0aC8866
address of user bob is 0x3f0CdAe6ebd93F9F776BCBB7da1D42180cC8fcC1
    ✔ should work


  1 passing (2ms)
```

{% endstep %}

{% step %}

### Set up testing instance

Now that we have our signers set up, we can deploy the smart contract.

To ensure isolated and deterministic tests, we should deploy a fresh instance of `Counter.sol` before each test. This avoids any side effects from previous tests.

The standard approach is to define a `deployFixture()` function that handles contract deployment.

```ts
async function deployFixture() {
  const factory = (await ethers.getContractFactory("Counter")) as Counter__factory;
  const counterContract = (await factory.deploy()) as Counter;
  const counterContractAddress = await counterContract.getAddress();

  return { counterContract, counterContractAddress };
}
```

To run this setup before each test case, call `deployFixture()` inside a `beforeEach` block:

```ts
beforeEach(async () => {
  ({ counterContract, counterContractAddress } = await deployFixture());
});
```

This ensures each test runs with a clean, independent contract instance.

Let's put it together. Now your`test/Counter.ts` should look like the following:

```ts
import { Counter, Counter__factory } from "../types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("Counter")) as Counter__factory;
  const counterContract = (await factory.deploy()) as Counter;
  const counterContractAddress = await counterContract.getAddress();

  return { counterContract, counterContractAddress };
}

describe("Counter", function () {
  let signers: Signers;
  let counterContract: Counter;
  let counterContractAddress: Counter;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  beforeEach(async () => {
    // Deploy a new instance of the contract before each test
    ({ counterContract, counterContractAddress } = await deployFixture());
  });

  it("should be deployed", async function () {
    console.log(`Counter has been deployed at address ${counterContractAddress}`);
    // Test the deployed address is valid
    expect(ethers.isAddress(counterContractAddress)).to.eq(true);
  });
});
```

**Run the test:**

From your project's root directory, run:

```sh
npx hardhat test
```

**Expected Output:**

```sh
  Counter
Counter has been deployed at address 0x7553CB9124f974Ee475E5cE45482F90d5B6076BC
    ✔ should be deployed


  1 passing (7ms)
```

{% endstep %}
{% endstepper %}

## Test functions

Now everything is up and running, you can start testing your contract functions.

{% stepper %}
{% step %}

### Call the contract `getCount()` view function

Everything is up and running, we can now call the `Counter.sol` view function `getCount()` !

Just below the test block `it("should be deployed", async function () {...}`,

add the following unit test:

```ts
it("count should be zero after deployment", async function () {
  const count = await counterContract.getCount();
  console.log(`Counter.getCount() === ${count}`);
  // Expect initial count to be 0 after deployment
  expect(count).to.eq(0);
});
```

**Run the test**

From your project's root directory, run:

```sh
npx hardhat test
```

**Expected Output**

```sh
  Counter
Counter has been deployed at address 0x7553CB9124f974Ee475E5cE45482F90d5B6076BC
    ✔ should be deployed
Counter.getCount() === 0
    ✔ count should be zero after deployment


  1 passing (7ms)
```

{% endstep %}

{% step %}

### Call the contract `increment()` transaction function

Just below the test block `it("count should be zero after deployment", async function () {...}`, add the following test block:

```ts
it("increment the counter by 1", async function () {
  const countBeforeInc = await counterContract.getCount();
  const tx = await counterContract.connect(signers.alice).increment(1);
  await tx.wait();
  const countAfterInc = await counterContract.getCount();
  expect(countAfterInc).to.eq(countBeforeInc + 1n);
});
```

**Remarks:**

* `increment()` is a transactional function that modifies the blockchain state.
* It must be signed by a user — here we use `alice`.
* `await wait()` to wait for the transaction to mined.
* The test compares the counter before and after the transaction to ensure it incremented as expected.

**Run the test**

From your project's root directory, run:

```sh
npx hardhat test
```

**Expected Output**

```sh
  Counter
Counter has been deployed at address 0x7553CB9124f974Ee475E5cE45482F90d5B6076BC
    ✔ should be deployed
Counter.getCount() === 0
    ✔ count should be zero after deployment
    ✔ increment the counter by 1


  2 passing (12ms)
```

{% endstep %}

{% step %}

### Call the contract `decrement()` transaction function

Just below the test block `it("increment the counter by 1", async function () {...}`,

add the following test block:

```ts
it("decrement the counter by 1", async function () {
  // First increment, count becomes 1
  let tx = await counterContract.connect(signers.alice).increment(1);
  await tx.wait();
  // Then decrement, count goes back to 0
  tx = await counterContract.connect(signers.alice).decrement(1);
  await tx.wait();
  const count = await counterContract.getCount();
  expect(count).to.eq(0);
});
```

***

**Run the test**

From your project's root directory, run:

```sh
npx hardhat test
```

**Expected Output**

```sh
  Counter
Counter has been deployed at address 0x7553CB9124f974Ee475E5cE45482F90d5B6076BC
    ✔ should be deployed
Counter.getCount() === 0
    ✔ count should be zero after deployment
    ✔ increment the counter by 1
    ✔ decrement the counter by 1


  2 passing (12ms)
```

{% endstep %}
{% endstepper %}

Now you have successfully written and tested your counter contract. You should have the following files in your project:

* [`contracts/Counter.sol`](https://docs.zama.ai/protocol/examples/basic/fhe-counter#counter.sol) — your Solidity smart contract
* [`test/Counter.ts`](https://docs.zama.ai/protocol/examples/basic/fhe-counter#counter.ts) — your Hardhat test suite written in TypeScript

These files form the foundation of a basic Hardhat-based smart contract project.

## Next step

Now that you've written and tested a basic Solidity smart contract, you're ready to take the next step.

In the [next tutorial](https://docs.zama.org/protocol/solidity-guides/getting-started/quick-start-tutorial/turn_it_into_fhevm), we’ll transform this standard `Counter.sol` contract into `FHECounter.sol`, a trivial FHEVM-compatible version — allowing the counter value to be stored and updated using trivial fully homomorphic encryption.


# 3. Turn it into FHEVM

In this tutorial, you'll learn how to take a basic Solidity smart contract and progressively upgrade it to support Fully Homomorphic Encryption using the FHEVM library by Zama.

Starting with the plain `Counter.sol` contract that you built from the ["Write a simple contract" tutorial](https://docs.zama.org/protocol/solidity-guides/getting-started/quick-start-tutorial/write_a_simple_contract), and step-by-step, you’ll learn how to:

* Replace standard types with encrypted equivalents
* Integrate zero-knowledge proof validation
* Enable encrypted on-chain computation
* Grant permissions for secure off-chain decryption

By the end, you'll have a fully functional smart contract that supports FHE computation.

## Initiate the contract

{% stepper %}
{% step %}

### Create the `FHECounter.sol` file

Navigate to your project’s `contracts` directory:

```sh
cd <your-project-root-directory>/contracts
```

From there, create a new file named `FHECounter.sol`, and copy the following Solidity code into it:

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

/// @title A simple counter contract
contract Counter {
  uint32 private _count;

  /// @notice Returns the current count
  function getCount() external view returns (uint32) {
    return _count;
  }

  /// @notice Increments the counter by a specific value
  function increment(uint32 value) external {
    _count += value;
  }

  /// @notice Decrements the counter by a specific value
  function decrement(uint32 value) external {
    require(_count >= value, "Counter: cannot decrement below zero");
    _count -= value;
  }
}
```

This is a plain `Counter` contract that we’ll use as the starting point for adding FHEVM functionality. We will modify this contract step-by-step to progressively integrate FHEVM capabilities.
{% endstep %}

{% step %}

### Turn `Counter` into `FHECounter`

To begin integrating FHEVM features into your contract, we first need to import the required FHEVM libraries.

**Replace the current header**

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;
```

**With this updated header:**

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
```

These imports:

* **FHE** — the core library to work with FHEVM encrypted types
* **euint32** and **externalEuint32** — encrypted uint32 types used in FHEVM
* **ZamaEthereumConfig** — provides the FHEVM configuration for the Ethereum mainnet or Ethereum Sepolia testnet networks.\
  Inheriting from it enables your contract to use the FHE library

**Replace the current contract declaration:**

```solidity
/// @title A simple counter contract
contract Counter {
```

**With the updated declaration :**

```solidity
/// @title A simple FHE counter contract
contract FHECounter is ZamaEthereumConfig {
```

This change:

* Renames the contract to `FHECounter`
* Inherits from `ZamaEthereumConfig` to enable FHEVM support

{% hint style="warning" %}
This contract must inherit from the `ZamaEthereumConfig` abstract contract; otherwise, it will not be able to execute any FHEVM-related functionality on Sepolia or Hardhat.
{% endhint %}

From your project's root directory, run:

```sh
npx hardhat compile
```

Great! Your smart contract is now compiled and ready to use **FHEVM features.**
{% endstep %}
{% endstepper %}

## Apply FHE functions and types

{% stepper %}
{% step %}

### Comment out the `increment()` and `decrement()` Functions

Before we move forward, let’s comment out the `increment()` and `decrement()` functions in `FHECounter`. We'll replace them later with updated versions that support FHE-encrypted operations.

```solidity
 /// @notice Increments the counter by a specific value
// function increment(uint32 value) external {
//     _count += value;
// }

/// @notice Decrements the counter by a specific value
// function decrement(uint32 value) external {
//     require(_count >= value, "Counter: cannot decrement below zero");
//     _count -= value;
// }
```

{% endstep %}

{% step %}

### Replace `uint32` with the FHEVM `euint32` Type

We’ll now switch from the standard Solidity `uint32` type to the encrypted FHEVM type `euint32`.

This enables private, homomorphic computation on encrypted integers.

**Replace**

```solidity
uint32 _count;
```

and

```solidity
function getCount() external view returns (uint32) {
```

**With :**

```solidity
euint32 _count;
```

and

```solidity
function getCount() external view returns (euint32) {
```

{% endstep %}

{% step %}

### Replace `increment(uint32 value)` with the FHEVM version `increment(externalEuint32 value)`

To support encrypted input, we will update the increment function to accept a value encrypted off-chain.

Instead of using a `uint32`, the new version will accept an `externalEuint32`, which is an encrypted integer produced off-chain and sent to the smart contract.

To ensure the validity of this encrypted value, we also include a second argument:`inputProof`, a bytes array containing a Zero-Knowledge Proof of Knowledge (ZKPoK) that proves two things:

1. The `externalEuint32` was encrypted off-chain by the function caller (`msg.sender`)
2. The `externalEuint32` is bound to the contract (`address(this)`) and can only be processed by it.

**Replace**

```solidity
 /// @notice Increments the counter by a specific value
// function increment(uint32 value) external {
//     _count += value;
// }
```

**With :**

```solidity
/// @notice Increments the counter by a specific value
function increment(externalEuint32 inputEuint32, bytes calldata inputProof) external {
  //     _count += value;
}
```

{% endstep %}

{% step %}

### Convert `externalEuint32` to `euint32`

You cannot directly use `externalEuint32` in FHE operations. To manipulate it with the FHEVM library, you first need to convert it into the native FHE type `euint32`.

This conversion is done using:

```solidity
FHE.fromExternal(inputEuint32, inputProof);
```

This method verifies the zero-knowledge proof and returns a usable encrypted value within the contract.

**Replace**

```solidity
/// @notice Increments the counter by a specific value
function increment(externalEuint32 inputEuint32, bytes calldata inputProof) external {
  //     _count += value;
}
```

**With :**

```solidity
/// @notice Increments the counter by a specific value
function increment(externalEuint32 inputEuint32, bytes calldata inputProof) external {
  euint32 evalue = FHE.fromExternal(inputEuint32, inputProof);
  //     _count += value;
}
```

{% endstep %}

{% step %}

### Convert `_count += value` into its FHEVM equivalent

To perform the update `_count += value` in a Fully Homomorphic way, we use the `FHE.add()` operator. This function allows us to compute the FHE sum of 2 encrypted integers.

**Replace**

```solidity
/// @notice Increments the counter by a specific value
function increment(externalEuint32 inputEuint32, bytes calldata inputProof) external {
  euint32 evalue = FHE.fromExternal(inputEuint32, inputProof);
  //     _count += value;
}
```

**With :**

```solidity
/// @notice Increments the counter by a specific value
function increment(externalEuint32 inputEuint32, bytes calldata inputProof) external {
  euint32 evalue = FHE.fromExternal(inputEuint32, inputProof);
  _count = FHE.add(_count, evalue);
}
```

{% hint style="info" %}
This FHE operation allows the smart contract to process encrypted values without ever decrypting them — a core feature of FHEVM that enables on-chain privacy.
{% endhint %}
{% endstep %}
{% endstepper %}

## Grant FHE Permissions

{% hint style="warning" %}
This step is critical! You must grant FHE permissions to both the contract and the caller to ensure the encrypted `_count` value can be decrypted off-chain by the caller. Without these 2 permissions, the caller will not be able to compute the clear result.
{% endhint %}

To grant FHE permission we will call the `FHE.allow()` function.

#### Replace

```solidity
/// @notice Increments the counter by a specific value
function increment(externalEuint32 inputEuint32, bytes calldata inputProof) external {
  euint32 evalue = FHE.fromExternal(inputEuint32, inputProof);
  _count = FHE.add(_count, evalue);
}
```

#### With :

```solidity
/// @notice Increments the counter by a specific value
function increment(externalEuint32 inputEuint32, bytes calldata inputProof) external {
  euint32 evalue = FHE.fromExternal(inputEuint32, inputProof);
  _count = FHE.add(_count, evalue);

  FHE.allowThis(_count);
  FHE.allow(_count, msg.sender);
}
```

{% hint style="info" %}
We grant **two** FHE permissions here — not just one. In the next part of the tutorial, you'll learn why **both** are necessary.
{% endhint %}

## Convert `decrement()` to its FHEVM equivalent

Just like with the `increment()` migration, we’ll now convert the `decrement()` function to its FHEVM-compatible version.

Replace :

```solidity
/// @notice Decrements the counter by a specific value
function decrement(uint32 value) external {
  require(_count >= value, "Counter: cannot decrement below zero");
  _count -= value;
}
```

with the following :

```solidity
/// @notice Decrements the counter by a specific value
/// @dev This example omits overflow/underflow checks for simplicity and readability.
/// In a production contract, proper range checks should be implemented.
function decrement(externalEuint32 inputEuint32, bytes calldata inputProof) external {
  euint32 encryptedEuint32 = FHE.fromExternal(inputEuint32, inputProof);

  _count = FHE.sub(_count, encryptedEuint32);

  FHE.allowThis(_count);
  FHE.allow(_count, msg.sender);
}
```

{% hint style="warning" %}
The `increment()` and `decrement()` functions do not perform any overflow or underflow checks.
{% endhint %}

## Compile `FHECounter.sol`

From your project's root directory, run:

```sh
npx hardhat compile
```

Congratulations! Your smart contract is now fully **FHEVM-compatible**.

Now you should have the following files in your project:

* [`contracts/FHECounter.sol`](https://docs.zama.ai/protocol/examples/basic/fhe-counter#fhecounter.sol) — your Solidity smart FHEVM contract
* [`test/FHECounter.ts`](https://docs.zama.ai/protocol/examples/basic/fhe-counter#fhecounter.ts) — your FHEVM Hardhat test suite written in TypeScript

In the [next tutorial](https://github.com/zama-ai/fhevm/blob/release/0.11.x/docs/solidity-guides/getting-started/quick-start-tutorial/test_fhevm_contract.md), we’ll move on to the **TypeScript integration**, where you’ll learn how to interact with your newly upgraded FHEVM contract in a test suite.


# 4. Test the FHEVM contract

In this tutorial, you’ll learn how to migrate a standard Hardhat test suite - from `Counter.ts` to its FHEVM-compatible version `FHECounter.ts` — and progressively enhance it to support Fully Homomorphic Encryption using Zama’s FHEVM library.

## Set up the FHEVM testing environment

{% stepper %}
{% step %}

### Create a test script `test/FHECounter.ts`

Go to your project's `test` directory

```sh
cd <your-project-root-directory>/test
```

From there, create a new file named `FHECounter.ts` and copy/paste the following Typescript skeleton code in it.

```ts
import { FHECounter, FHECounter__factory } from "../types";
import { FhevmType } from "@fhevm/hardhat-plugin";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, fhevm } from "hardhat";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("FHECounter")) as FHECounter__factory;
  const fheCounterContract = (await factory.deploy()) as FHECounter;
  const fheCounterContractAddress = await fheCounterContract.getAddress();

  return { fheCounterContract, fheCounterContractAddress };
}

describe("FHECounter", function () {
  let signers: Signers;
  let fheCounterContract: FHECounter;
  let fheCounterContractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  beforeEach(async () => {
    ({ fheCounterContract, fheCounterContractAddress } = await deployFixture());
  });

  it("should be deployed", async function () {
    console.log(`FHECounter has been deployed at address ${fheCounterContractAddress}`);
    // Test the deployed address is valid
    expect(ethers.isAddress(fheCounterContractAddress)).to.eq(true);
  });

  //   it("count should be zero after deployment", async function () {
  //     const count = await counterContract.getCount();
  //     console.log(`Counter.getCount() === ${count}`);
  //     // Expect initial count to be 0 after deployment
  //     expect(count).to.eq(0);
  //   });

  //   it("increment the counter by 1", async function () {
  //     const countBeforeInc = await counterContract.getCount();
  //     const tx = await counterContract.connect(signers.alice).increment(1);
  //     await tx.wait();
  //     const countAfterInc = await counterContract.getCount();
  //     expect(countAfterInc).to.eq(countBeforeInc + 1n);
  //   });

  //   it("decrement the counter by 1", async function () {
  //     // First increment, count becomes 1
  //     let tx = await counterContract.connect(signers.alice).increment();
  //     await tx.wait();
  //     // Then decrement, count goes back to 0
  //     tx = await counterContract.connect(signers.alice).decrement(1);
  //     await tx.wait();
  //     const count = await counterContract.getCount();
  //     expect(count).to.eq(0);
  //   });
});
```

#### What’s Different from `Counter.ts`?

* This test file is structurally similar to the original `Counter.ts`, but it uses the FHEVM-compatible smart contract `FHECounter` instead of the regular `Counter`.

– For clarity, the `Counter` unit tests are included as comments, allowing you to better understand how each part is adapted during the migration to FHEVM.

* While the test logic remains the same, this version is now set up to support encrypted computations via the FHEVM library — enabling tests that manipulate confidential values directly on-chain.
  {% endstep %}

{% step %}

### Run the test `test/FHECounter.ts`

From your project's root directory, run:

```sh
npx hardhat test
```

Output:

```sh
  FHECounter
FHECounter has been deployed at address 0x7553CB9124f974Ee475E5cE45482F90d5B6076BC
    ✔ should be deployed


  1 passing (1ms)
```

Great! Your Hardhat FHEVM test environment is properly setup.
{% endstep %}
{% endstepper %}

## Test functions

Now everything is up and running, you can start testing your contract functions.

{% stepper %}
{% step %}

### Call the contract `getCount()` view function

Replace the commented‐out test for the legacy `Counter` contract:

```ts
//   it("count should be zero after deployment", async function () {
//     const count = await counterContract.getCount();
//     console.log(`Counter.getCount() === ${count}`);
//     // Expect initial count to be 0 after deployment
//     expect(count).to.eq(0);
//   });
```

with its FHEVM equivalent:

```ts
it("encrypted count should be uninitialized after deployment", async function () {
  const encryptedCount = await fheCounterContract.getCount();
  // Expect initial count to be bytes32(0) after deployment,
  // (meaning the encrypted count value is uninitialized)
  expect(encryptedCount).to.eq(ethers.ZeroHash);
});
```

**What’s different?**

– `encryptedCount` is no longer a plain TypeScript number. It is now a hexadecimal string representing a Solidity `bytes32` value, known as an **FHEVM handle**. This handle points to an encrypted FHEVM primitive of type `euint32`, which internally represents an encrypted Solidity `uint32` primitive type.

* `encryptedCount` is equal to `0x0000000000000000000000000000000000000000000000000000000000000000` which means that `encryptedCount` is uninitialized, and does not reference to any encrypted value at this point.

**Run the test**

From your project's root directory, run:

```sh
npx hardhat test
```

**Expected Output**

```sh
  Counter
Counter has been deployed at address 0x7553CB9124f974Ee475E5cE45482F90d5B6076BC
    ✔ should be deployed
    ✔ encrypted count should be uninitialized after deployment


  2 passing (7ms)
```

{% endstep %}

{% step %}

### Setup the `increment()` function unit test

We’ll migrate the `increment()` unit test to FHEVM step by step. To start, let’s handle the value of the counter before the first increment. As explained above, the counter is initially a `bytes32` value equal to zero, meaning the FHEVM `euint32` variable is uninitialized.

We’ll interpret this as if the underlying clear value is 0.

Replace the commented‐out test for the legacy `Counter` contract:

```ts
//   it("increment the counter by 1", async function () {
//     const countBeforeInc = await counterContract.getCount();
//     const tx = await counterContract.connect(signers.alice).increment(1);
//     await tx.wait();
//     const countAfterInc = await counterContract.getCount();
//     expect(countAfterInc).to.eq(countBeforeInc + 1n);
//   });
```

with the following:

```ts
it("increment the counter by 1", async function () {
  const encryptedCountBeforeInc = await fheCounterContract.getCount();
  expect(encryptedCountBeforeInc).to.eq(ethers.ZeroHash);
  const clearCountBeforeInc = 0;

  // const tx = await counterContract.connect(signers.alice).increment(1);
  // await tx.wait();
  // const countAfterInc = await counterContract.getCount();
  // expect(countAfterInc).to.eq(countBeforeInc + 1n);
});
```

{% endstep %}

{% step %}

### Encrypt the `increment()` function argument

The `increment()` function takes a single argument: the value by which the counter should be incremented. In the initial version of `Counter.sol`, this value is a clear `uint32`.

We’ll switch to passing an encrypted value instead, using FHEVM `externalEuint32` primitive type. This allows us to securely increment the counter without revealing the input value on-chain.

{% hint style="info" %}
We are using an `externalEuint32` instead of a regular `euint32`. This tells the FHEVM that the encrypted `uint32` was provided externally (e.g., by a user) and must be verified for integrity and authenticity before it can be used within the contract.
{% endhint %}

Replace :

```ts
it("increment the counter by 1", async function () {
  const encryptedCountBeforeInc = await fheCounterContract.getCount();
  expect(encryptedCountBeforeInc).to.eq(ethers.ZeroHash);
  const clearCountBeforeInc = 0;

  // const tx = await counterContract.connect(signers.alice).increment(1);
  // await tx.wait();
  // const countAfterInc = await counterContract.getCount();
  // expect(countAfterInc).to.eq(countBeforeInc + 1n);
});
```

with the following:

```ts
it("increment the counter by 1", async function () {
  const encryptedCountBeforeInc = await fheCounterContract.getCount();
  expect(encryptedCountBeforeInc).to.eq(ethers.ZeroHash);
  const clearCountBeforeInc = 0;

  // Encrypt constant 1 as a euint32
  const clearOne = 1;
  const encryptedOne = await fhevm
    .createEncryptedInput(fheCounterContractAddress, signers.alice.address)
    .add32(clearOne)
    .encrypt();

  // const tx = await counterContract.connect(signers.alice).increment(1);
  // await tx.wait();
  // const countAfterInc = await counterContract.getCount();
  // expect(countAfterInc).to.eq(countBeforeInc + 1n);
});
```

{% hint style="info" %}
`fhevm.createEncryptedInput(fheCounterContractAddress, signers.alice.address)` creates an encrypted value that is bound to both the contract (`fheCounterContractAddress`) and the user (`signers.alice.address`). This means only Alice can use this encrypted value, and only within the `FHECounter.sol` contract at that specific address. **It cannot be reused by another user or in a different contract, ensuring data confidentiality and binding context-specific encryption.**
{% endhint %}
{% endstep %}

{% step %}

### Call the `increment()` function with the encrypted argument

Now that we have an encrypted argument, we can call the `increment()` function with it.

Below, you’ll notice that the updated `increment()` function now takes **two arguments instead of one.**

This is because the FHEVM requires both:

1. The `externalEuint32` — the encrypted value itself
2. An accompanying **Zero-Knowledge Proof of Knowledge** (`inputProof`) — which verifies that the encrypted input is securely bound to:
   * the caller (Alice, the transaction signer), and
   * the target smart contract (where `increment()` is being executed)

This ensures that the encrypted value cannot be reused in a different context or by a different user, preserving **confidentiality and integrity.**

Replace :

```ts
// const tx = await counterContract.connect(signers.alice).increment(1);
// await tx.wait();
```

with the following:

```ts
const tx = await fheCounterContract.connect(signers.alice).increment(encryptedOne.handles[0], encryptedOne.inputProof);
await tx.wait();
```

At this point the counter has been successfully incremented by 1 using a **Fully Homomorphic Encryption (FHE)**. In the next step, we will retrieve the updated encrypted counter value and decrypt it locally. But before we move on, let’s quickly run the tests to make sure everything is working correctly.

***

**Run the test**

From your project's root directory, run:

```sh
npx hardhat test
```

**Expected Output**

```sh
  FHECounter
FHECounter has been deployed at address 0x7553CB9124f974Ee475E5cE45482F90d5B6076BC
    ✔ should be deployed
    ✔ encrypted count should be uninitialized after deployment
    ✔ increment the counter by 1


  3 passing (7ms)
```

{% endstep %}

{% step %}

### Call the `getCount()` function and Decrypt the value

Now that the counter has been incremented using an encrypted input, it's time to **read the updated encrypted value** from the smart contract and **decrypt it** using the `userDecryptEuint` function provided by the FHEVM Hardhat Plugin.

The `userDecryptEuint` function takes four parameters:

1. **FhevmType**: The integer type of the FHE-encrypted value. In this case, we're using `FhevmType.euint32` because the counter is a `uint32`.
2. **Encrypted handle**: A 32-byte FHEVM handle representing the encrypted value you want to decrypt.
3. **Smart contract address**: The address of the contract that has permission to access the encrypted handle.
4. **User signer**: The signer (e.g., signers.alice) who has permission to access the handle.

{% hint style="info" %}
Note: Permissions to access the FHEVM handle are set on-chain using the `FHE.allow()` Solidity function (see FHECounter.sol).
{% endhint %}

Replace :

```ts
// const countAfterInc = await counterContract.getCount();
// expect(countAfterInc).to.eq(countBeforeInc + 1n);
```

with the following:

```ts
const encryptedCountAfterInc = await fheCounterContract.getCount();
const clearCountAfterInc = await fhevm.userDecryptEuint(
  FhevmType.euint32,
  encryptedCountAfterInc,
  fheCounterContractAddress,
  signers.alice,
);
expect(clearCountAfterInc).to.eq(clearCountBeforeInc + clearOne);
```

***

**Run the test**

From your project's root directory, run:

```sh
npx hardhat test
```

**Expected Output**

```sh
  FHECounter
FHECounter has been deployed at address 0x7553CB9124f974Ee475E5cE45482F90d5B6076BC
    ✔ should be deployed
    ✔ encrypted count should be uninitialized after deployment
    ✔ increment the counter by 1


  3 passing (7ms)
```

{% endstep %}

{% step %}

### Call the contract `decrement()` function

Similarly to the previous test, we’ll now call the `decrement()` function using an encrypted input.

Replace :

```ts
//   it("decrement the counter by 1", async function () {
//     // First increment, count becomes 1
//     let tx = await counterContract.connect(signers.alice).increment();
//     await tx.wait();
//     // Then decrement, count goes back to 0
//     tx = await counterContract.connect(signers.alice).decrement(1);
//     await tx.wait();
//     const count = await counterContract.getCount();
//     expect(count).to.eq(0);
//   });
```

with the following:

```ts
it("decrement the counter by 1", async function () {
  // Encrypt constant 1 as a euint32
  const clearOne = 1;
  const encryptedOne = await fhevm
    .createEncryptedInput(fheCounterContractAddress, signers.alice.address)
    .add32(clearOne)
    .encrypt();

  // First increment by 1, count becomes 1
  let tx = await fheCounterContract.connect(signers.alice).increment(encryptedOne.handles[0], encryptedOne.inputProof);
  await tx.wait();

  // Then decrement by 1, count goes back to 0
  tx = await fheCounterContract.connect(signers.alice).decrement(encryptedOne.handles[0], encryptedOne.inputProof);
  await tx.wait();

  const encryptedCountAfterDec = await fheCounterContract.getCount();
  const clearCountAfterDec = await fhevm.userDecryptEuint(
    FhevmType.euint32,
    encryptedCountAfterDec,
    fheCounterContractAddress,
    signers.alice,
  );

  expect(clearCountAfterDec).to.eq(0);
});
```

***

**Run the test**

From your project's root directory, run:

```sh
npx hardhat test
```

**Expected Output**

```sh
  FHECounter
FHECounter has been deployed at address 0x7553CB9124f974Ee475E5cE45482F90d5B6076BC
    ✔ should be deployed
    ✔ encrypted count should be uninitialized after deployment
    ✔ increment the counter by 1
    ✔ decrement the counter by 1


  4 passing (7ms)
```

{% endstep %}
{% endstepper %}

## Congratulations! You've completed the full tutorial.

You have successfully written and tested your FHEVM-based counter smart contract. By now, your project should include the following files:

* [`contracts/FHECounter.sol`](https://docs.zama.ai/protocol/examples#tab-fhecounter.sol) — your Solidity smart contract
* [`test/FHECounter.ts`](https://docs.zama.ai/protocol/examples#tab-fhecounter.ts) — your Hardhat test suite written in TypeScript

## Next step

If you would like to deploy your project on the testnet, or learn more about using FHEVM Hardhat Plugin, head to [Deploy contracts and run tests](https://docs.zama.org/protocol/solidity-guides/development-guide/hardhat/run_test).


# Contract addresses

These are Sepolia addresses.

| Contract/Service             | Address/Value                              |
| ---------------------------- | ------------------------------------------ |
| FHEVM\_EXECUTOR\_CONTRACT    | 0x92C920834Ec8941d2C77D188936E1f7A6f49c127 |
| ACL\_CONTRACT                | 0xf0Ffdc93b7E186bC2f8CB3dAA75D86d1930A433D |
| HCU\_LIMIT\_CONTRACT         | 0xa10998783c8CF88D886Bc30307e631D6686F0A22 |
| KMS\_VERIFIER\_CONTRACT      | 0xbE0E383937d564D7FF0BC3b46c51f0bF8d5C311A |
| INPUT\_VERIFIER\_CONTRACT    | 0xBBC1fFCdc7C316aAAd72E807D9b0272BE8F84DA0 |
| DECRYPTION\_ADDRESS          | 0x5D8BD78e2ea6bbE41f26dFe9fdaEAa349e077478 |
| INPUT\_VERIFICATION\_ADDRESS | 0x483b9dE06E4E4C7D35CCf5837A1668487406D955 |
| RELAYER\_URL                 | `https://relayer.testnet.zama.org`         |
| GATEWAY\_CHAIN\_ID           | 10901                                      |


# Supported types

This document introduces the encrypted integer types provided by the `FHE` library in FHEVM and explains their usage, including casting, state variable declarations, and type-specific considerations.

## Introduction

The `FHE` library offers a robust type system with encrypted integer types, enabling secure computations on confidential data in smart contracts. These encrypted types are validated both at compile time and runtime to ensure correctness and security.

### Key features of encrypted types

* Encrypted integers function similarly to Solidity’s native integer types, but they operate on **Fully Homomorphic Encryption (FHE)** ciphertexts.
* Arithmetic operations on `e(u)int` types are **unchecked**, meaning they wrap around on overflow. This design choice ensures confidentiality by avoiding the leakage of information through error detection.
* Future versions of the `FHE` library will support encrypted integers with overflow checking, but with the trade-off of exposing limited information about the operands.

{% hint style="info" %}
Encrypted integers with overflow checking will soon be available in the `FHE` library. These will allow reversible arithmetic operations but may reveal some information about the input values.
{% endhint %}

Encrypted integers in FHEVM are represented as FHE ciphertexts, abstracted using ciphertext handles. These types, prefixed with `e` (for example, `euint64`) act as secure wrappers over the ciphertext handles.

## List of encrypted types

The `FHE` library currently supports the following encrypted types:

| Type     | Bit Length | Supported Operators                                                                                                                | Aliases (with supported operators) |
| -------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Ebool    | 2          | and, or, xor, eq, ne, not, select, rand                                                                                            |                                    |
| Euint8   | 8          | add, sub, mul, div, rem, and, or, xor, shl, shr, rotl, rotr, eq, ne, ge, gt, le, lt, min, max, neg, not, select, rand, randBounded |                                    |
| Euint16  | 16         | add, sub, mul, div, rem, and, or, xor, shl, shr, rotl, rotr, eq, ne, ge, gt, le, lt, min, max, neg, not, select, rand, randBounded |                                    |
| Euint32  | 32         | add, sub, mul, div, rem, and, or, xor, shl, shr, rotl, rotr, eq, ne, ge, gt, le, lt, min, max, neg, not, select, rand, randBounded |                                    |
| Euint64  | 64         | add, sub, mul, div, rem, and, or, xor, shl, shr, rotl, rotr, eq, ne, ge, gt, le, lt, min, max, neg, not, select, rand, randBounded |                                    |
| Euint128 | 128        | add, sub, mul, div, rem, and, or, xor, shl, shr, rotl, rotr, eq, ne, ge, gt, le, lt, min, max, neg, not, select, rand, randBounded |                                    |
| Euint160 | 160        |                                                                                                                                    | Eaddress (eq, ne, select)          |
| Euint256 | 256        | and, or, xor, shl, shr, rotl, rotr, eq, ne, neg, not, select, rand, randBounded                                                    |                                    |

{% hint style="info" %}
Division (\`div\`) and remainder (\`rem\`) operations are only supported when the right-hand side (\`rhs\`) operand is a plaintext (non-encrypted) value. Attempting to use an encrypted value as \`rhs\` will result in a panic. This restriction ensures correct and secure computation within the current framework.
{% endhint %}

{% hint style="info" %}
Higher-precision integer types are available in the `TFHE-rs` library and can be added to `fhevm` as needed.
{% endhint %}


# Casting and trivial encryption

This documentation covers the `asEbool`, `asEuintXX`, and `asEaddress` operations provided by the FHE library for working with encrypted data in the FHEVM. These operations are essential for converting between plaintext and encrypted types, as well as handling encrypted inputs.

The operations can be categorized into two main use cases:

1. **Trivial encryption**: Converting plaintext values to encrypted types
2. **Type casting**: Converting between different encrypted types

## 1. Trivial encryption

Trivial encryption simply put is a plain text in a format of a ciphertext.

### Overview

Trivial encryption is the process of converting plaintext values into encrypted types (ciphertexts) compatible with FHE operators. Although the data is in ciphertext format, it remains publicly visible on-chain, making it useful for operations between public and private values.

This type of casting involves converting plaintext (unencrypted) values into their encrypted equivalents, such as:

* `bool` → `ebool`
* `uint` → `euintXX`
* `address` → `eaddress`

{% hint style="info" %}
When doing trivial encryption, the data is made compatible with FHE operations but remains publicly visible on-chain unless explicitly encrypted.
{% endhint %}

#### **Example**

```solidity
euint64 value64 = FHE.asEuint64(7262);  // Trivial encrypt a uint64
ebool valueBool = FHE.asEbool(true);   // Trivial encrypt a boolean
```

## 2. Casting between encrypted types

This type of casting is used to reinterpret or convert one encrypted type into another. For example:

* `euint32` → `euint64`

Casting between encrypted types is often required when working with operations that demand specific sizes or precisions.

> **Important**: When casting between encrypted types:
>
> * Casting from smaller types to larger types (e.g. `euint32` → `euint64`) preserves all information
> * Casting from larger types to smaller types (e.g. `euint64` → `euint32`) will truncate and lose information

The table below summarizes the available casting functions:

| From type | To type  | Function        |
| --------- | -------- | --------------- |
| `euintX`  | `euintX` | `FHE.asEuintXX` |
| `ebool`   | `euintX` | `FHE.asEuintXX` |
| `euintX`  | `ebool`  | `FHE.asEboolXX` |

{% hint style="info" %}
Casting between encrypted types is efficient and often necessary when handling data with differing precision requirements.
{% endhint %}

### **Workflow for encrypted types**

```solidity
// Casting between encrypted types
euint32 value32 = FHE.asEuint32(value64); // Cast to euint32
ebool valueBool = FHE.asEbool(value32);   // Cast to ebool
```

## Overall operation summary

| Casting Type             | Function            | Input Type        | Output Type |
| ------------------------ | ------------------- | ----------------- | ----------- |
| Trivial encryption       | `FHE.asEuintXX(x)`  | `uintX`           | `euintX`    |
|                          | `FHE.asEbool(x)`    | `bool`            | `ebool`     |
|                          | `FHE.asEaddress(x)` | `address`         | `eaddress`  |
| Conversion between types | `FHE.asEuintXX(x)`  | `euintXX`/`ebool` | `euintYY`   |
|                          | `FHE.asEbool(x)`    | `euintXX`         | `ebool`     |



# Generate random numbers

This document explains how to generate cryptographically secure random encrypted numbers fully on-chain using the `FHE` library in fhevm. These numbers are encrypted and remain confidential, enabling privacy-preserving smart contract logic.

## **Key notes on random number generation**

* **On-chain execution**: Random number generation must be executed during a transaction, as it requires the pseudo-random number generator (PRNG) state to be updated on-chain. This operation cannot be performed using the `eth_call` RPC method.
* **Cryptographic security**: The generated random numbers are cryptographically secure and encrypted, ensuring privacy and unpredictability.

{% hint style="info" %}
Random number generation must be performed during transactions, as it requires the pseudo-random number generator (PRNG) state to be mutated on-chain. Therefore, it cannot be executed using the `eth_call` RPC method.
{% endhint %}

## **Basic usage**

The `FHE` library allows you to generate random encrypted numbers of various bit sizes. Below is a list of supported types and their usage:

```solidity
// Generate random encrypted numbers
ebool rb = FHE.randEbool();       // Random encrypted boolean
euint8 r8 = FHE.randEuint8();     // Random 8-bit number
euint16 r16 = FHE.randEuint16();  // Random 16-bit number
euint32 r32 = FHE.randEuint32();  // Random 32-bit number
euint64 r64 = FHE.randEuint64();  // Random 64-bit number
euint128 r128 = FHE.randEuint128(); // Random 128-bit number
euint256 r256 = FHE.randEuint256(); // Random 256-bit number
```

### **Example: Random Boolean**

```solidity
function randomBoolean() public returns (ebool) {
  return FHE.randEbool();
}
```

## **Bounded random numbers**

To generate random numbers within a specific range, you can specify an **upper bound**. The specified upper bound must be a power of 2. The random number will be in the range `[0, upperBound - 1]`.

```solidity
// Generate random numbers with upper bounds
euint8 r8 = FHE.randEuint8(32);      // Random number between 0-31
euint16 r16 = FHE.randEuint16(512);  // Random number between 0-511
euint32 r32 = FHE.randEuint32(65536); // Random number between 0-65535
```

### **Example: Random number with upper bound**

```solidity
function randomBoundedNumber(uint16 upperBound) public returns (euint16) {
  return FHE.randEuint16(upperBound);
}
```

## **Security Considerations**

* **Cryptographic security**:\
  The random numbers are generated using a cryptographically secure pseudo-random number generator (CSPRNG) and remain encrypted until explicitly decrypted.
* **Gas consumption**:\
  Each call to a random number generation function consumes gas. Developers should optimize the use of these functions, especially in gas-sensitive contracts.
* **Privacy guarantee**:\
  Random values are fully encrypted, ensuring they cannot be accessed or predicted by unauthorized parties.


# Encrypted inputs

This document introduces the concept of encrypted inputs in the FHEVM, explaining their role, structure, validation process, and how developers can integrate them into smart contracts and applications.

Encrypted inputs are a core feature of FHEVM, enabling users to push encrypted data onto the blockchain while ensuring data confidentiality and integrity.

## What are encrypted inputs?

Encrypted inputs are data values submitted by users in ciphertext form. These inputs allow sensitive information to remain confidential while still being processed by smart contracts. They are accompanied by **Zero-Knowledge Proofs of Knowledge (ZKPoKs)** to ensure the validity of the encrypted data without revealing the plaintext.

### Key characteristics of encrypted inputs:

1. **Confidentiality**: Data is encrypted using the public FHE key, ensuring that only authorized parties can decrypt or process the values.
2. **Validation via ZKPoKs**: Each encrypted input is accompanied by a proof verifying that the user knows the plaintext value of the ciphertext, preventing replay attacks or misuse.
3. **Efficient packing**: All inputs for a transaction are packed into a single ciphertext in a user-defined order, optimizing the size and generation of the zero-knowledge proof.

## Parameters in encrypted functions

When a function in a smart contract is called, it may accept two types of parameters for encrypted inputs:

1. **`externalEbool`, `externalEaddress`,`externalEuintXX`**: Refers to the index of the encrypted parameter within the proof, representing a specific encrypted input handle.
2. **`bytes`**: Contains the ciphertext and the associated zero-knowledge proof used for validation.

Here’s an example of a Solidity function accepting multiple encrypted parameters:

```solidity
function exampleFunction(
  externalEbool param1,
  externalEuint64 param2,
  externalEuint8 param3,
  bytes calldata inputProof
) public {
  // Function logic here
}
```

In this example, `param1`, `param2`, and `param3` are encrypted inputs for `ebool`, `euint64`, and `euint8` while `inputProof` contains the corresponding ZKPoK to validate their authenticity.

### Input Generation using Hardhat

In the below example, we use Alice's address to create the encrypted inputs and submits the transaction.

```typescript
import { fhevm } from "hardhat";

const input = fhevm.createEncryptedInput(contract.address, signers.alice.address);
input.addBool(canTransfer); // at index 0
input.add64(transferAmount); // at index 1
input.add8(transferType); // at index 2
const encryptedInput = await input.encrypt();

const externalEboolParam1 = encryptedInput.handles[0];
const externalEuint64Param2 = encryptedInput.handles[1];
const externalEuint8Param3 = encryptedInput.handles[2];
const inputProof = encryptedInput.inputProof;

tx = await myContract
  .connect(signers.alice)
  [
    "exampleFunction(bytes32,bytes32,bytes32,bytes)"
  ](signers.bob.address, externalEboolParam1, externalEuint64Param2, externalEuint8Param3, inputProof);

await tx.wait();
```

### Input Order

Developers are free to design the function parameters in any order. There is no required correspondence between the order in which encrypted inputs are constructed in TypeScript and the order of arguments in the Solidity function.

## Validating encrypted inputs

Smart contracts process encrypted inputs by verifying them against the associated zero-knowledge proof. This is done using the `FHE.asEuintXX`, `FHE.asEbool`, or `FHE.asEaddress` functions, which validate the input and convert it into the appropriate encrypted type.

### Example validation

This example demonstrates a function that performs multiple encrypted operations, such as updating a user's encrypted balance and toggling an encrypted boolean flag:

```solidity
function myExample(externalEuint64 encryptedAmount, externalEbool encryptedToggle, bytes calldata inputProof) public {
  // Validate and convert the encrypted inputs
  euint64 amount = FHE.fromExternal(encryptedAmount, inputProof);
  ebool toggleFlag = FHE.fromExternal(encryptedToggle, inputProof);

  // Update the user's encrypted balance
  balances[msg.sender] = FHE.add(balances[msg.sender], amount);

  // Toggle the user's encrypted flag
  userFlags[msg.sender] = FHE.not(toggleFlag);

  // FHE permissions and function logic here
  ...
}

// Function to retrieve a user's encrypted balance
function getEncryptedBalance() public view returns (euint64) {
  return balances[msg.sender];
}

// Function to retrieve a user's encrypted flag
function getEncryptedFlag() public view returns (ebool) {
  return userFlags[msg.sender];
}
```

### Example validation in the `ConfidentialERC20.sol` smart contract

Here’s an example of a smart contract function that verifies an encrypted input before proceeding:

```solidity
function transfer(
  address to,
  externalEuint64 encryptedAmount,
  bytes calldata inputProof
) public {
  // Verify the provided encrypted amount and convert it into an encrypted uint64
  euint64 amount = FHE.fromExternal(encryptedAmount, inputProof);

  // Function logic here, such as transferring funds
  ...
}
```

### How validation works

1. **Input verification**:\
   The `FHE.fromExternal` function ensures that the input is a valid ciphertext with a corresponding ZKPoK.
2. **Type conversion**:\
   The function transforms `externalEbool`, `externalEaddress`, `externalEuintXX` into the appropriate encrypted type (`ebool`, `eaddress`, `euintXX`) for further operations within the contract.

## Best Practices

* **Input packing**: Minimize the size and complexity of zero-knowledge proofs by packing all encrypted inputs into a single ciphertext.
* **Frontend encryption**: Always encrypt inputs using the FHE public key on the client side to ensure data confidentiality.
* **Proof management**: Ensure that the correct zero-knowledge proof is associated with each encrypted input to avoid validation errors.

Encrypted inputs and their validation form the backbone of secure and private interactions in the FHEVM. By leveraging these tools, developers can create robust, privacy-preserving smart contracts without compromising functionality or scalability.

# ACL examples

This page provides detailed instructions and examples on how to use and implement the ACL (Access Control List) in FHEVM. For an overview of ACL concepts and their importance, refer to the [access control list (ACL) overview](https://docs.zama.org/protocol/solidity-guides/smart-contract/acl).

## Controlling access: permanent and transient allowances

The ACL system allows you to define two types of permissions for accessing ciphertexts:

### Permanent allowance

* **Function**: `FHE.allow(ciphertext, address)`
* **Purpose**: Grants persistent access to a ciphertext for a specific address.
* **Storage**: Permissions are saved in a dedicated ACL contract, making them available across transactions.

#### Alternative Solidity syntax

You can also use method-chaining syntax for granting allowances since FHE is a Solidity library.

```solidity
using FHE for *;
ciphertext.allow(address1).allow(address2);
```

This is equivalent to calling `FHE.allow(ciphertext, address1)` followed by `FHE.allow(ciphertext, address2)`.

### Transient allowance

* **Function**: `FHE.allowTransient(ciphertext, address)`
* **Purpose**: Grants temporary access for the duration of a single transaction.
* **Storage**: Permissions are stored in transient storage to save gas costs.
* **Use Case**: Ideal for passing encrypted values between functions or contracts during a transaction.

#### Alternative Solidity syntax

Method chaining is also available for transient allowances since FHE is a Solidity library.

```solidity
using FHE for *;
ciphertext.allowTransient(address1).allowTransient(address2);
```

### Syntactic sugar

* **Function**: `FHE.allowThis(ciphertext)`
* **Equivalent To**: `FHE.allow(ciphertext, address(this))`
* **Purpose**: Simplifies granting permanent access to the current contract for managing ciphertexts.

#### Alternative Solidity syntax

You can also use method-chaining syntax for allowThis since FHE is a Solidity library.

```solidity
using FHE for *;
ciphertext.allowThis();
```

#### Make publicly decryptable

To make a ciphertext publicly decryptable, you can use the `FHE.makePubliclyDecryptable(ciphertext)` function. This grants decryption rights to anyone, which is useful for scenarios where the encrypted value should be accessible by all.

```solidity
// Grant public decryption right to a ciphertext
FHE.makePubliclyDecryptable(ciphertext);

// Or using method syntax:
ciphertext.makePubliclyDecryptable();
```

* **Function**: `FHE.makePubliclyDecryptable(ciphertext)`
* **Purpose**: Makes the ciphertext decryptable by anyone.
* **Use Case**: When you want to publish encrypted results or data.

> You can combine multiple allowance methods (such as `.allow()`, `.allowThis()`, `.allowTransient()`) directly on ciphertext objects to grant access to several addresses or contracts in a single, fluent statement.
>
> **Example**
>
> ```solidity
> // Grant transient access to one address and permanent access to another address
> ciphertext.allowTransient(address1).allow(address2);
>
> // Grant permanent access to the current contract and another address
> ciphertext.allowThis().allow(address1);
> ```

## Best practices

### Verifying sender access

When processing ciphertexts as input, it’s essential to validate that the sender is authorized to interact with the provided encrypted data. Failing to perform this verification can expose the system to inference attacks where malicious actors attempt to deduce private information.

#### Example scenario: Confidential ERC20 attack

Consider an **Confidential ERC20 token**. An attacker controlling two accounts, **Account A** and **Account B**, with 100 tokens in Account A, could exploit the system as follows:

1. The attacker attempts to send the target user's encrypted balance from **Account A** to **Account B**.
2. Observing the transaction outcome, the attacker gains information:
   * **If successful**: The target's balance is equal to or less than 100 tokens.
   * **If failed**: The target's balance exceeds 100 tokens.

This type of attack allows the attacker to infer private balances without explicit access.

To prevent this, always use the `FHE.isSenderAllowed()` function to verify that the sender has legitimate access to the encrypted amount being transferred.

***

#### Example: secure verification

```solidity
function transfer(address to, euint64 encryptedAmount) public {
  // Ensure the sender is authorized to access the encrypted amount
  require(FHE.isSenderAllowed(encryptedAmount), "Unauthorized access to encrypted amount.");

  // Proceed with further logic
  ...
}
```

By enforcing this check, you can safeguard against inference attacks and ensure that encrypted values are only manipulated by authorized entities.

## ACL for user decryption

If a ciphertext can be decrypt by a user, explicit access must be granted to them. Additionally, the user decryption mechanism requires the signature of a public key associated with the contract address. Therefore, a value that needs to be decrypted must be explicitly authorized for both the user and the contract.

Due to the user decryption mechanism, a user signs a public key associated with a specific contract; therefore, the ciphertext also needs to be allowed for the contract.

### Example: Secure Transfer in ConfidentialERC20

```solidity
function transfer(address to, euint64 encryptedAmount) public {
  require(FHE.isSenderAllowed(encryptedAmount), "The caller is not authorized to access this encrypted amount.");
  euint64 amount = FHE.asEuint64(encryptedAmount);
  ebool canTransfer = FHE.le(amount, balances[msg.sender]);

  euint64 newBalanceTo = FHE.add(balances[to], FHE.select(canTransfer, amount, FHE.asEuint64(0)));
  balances[to] = newBalanceTo;
  // Allow this new balance for both the contract and the owner.
  FHE.allowThis(newBalanceTo);
  FHE.allow(newBalanceTo, to);

  euint64 newBalanceFrom = FHE.sub(balances[from], FHE.select(canTransfer, amount, FHE.asEuint64(0)));
  balances[from] = newBalanceFrom;
  // Allow this new balance for both the contract and the owner.
  FHE.allowThis(newBalanceFrom);
  FHE.allow(newBalanceFrom, from);
}
```

By understanding how to grant and verify permissions, you can effectively manage access to encrypted data in your FHEVM smart contracts. For additional context, see the [ACL overview](https://docs.zama.org/protocol/solidity-guides/smart-contract/acl).


# Reorgs handling

This page provides detailed instructions on how to handle reorg risks on Ethereum when using FHEVM.

Since ACL events are propagated from the FHEVM host chain to the [Gateway](https://docs.zama.ai/protocol/protocol/overview/gateway) immediately after being included in a block, dApp developers must take special care when encrypted information is critically important. For example, if an encrypted handle conceals the private key of a Bitcoin wallet holding significant funds, we need to ensure that this information cannot inadvertently leak to the wrong person due to a reorg on the FHEVM host chain. Therefore, it's the responsibility of dApp developers to prevent such scenarios by implementing a two-step ACL authorization process with a timelock between the request and the ACL call.

## Simple example: Handling reorg risk on Ethereum

On Ethereum, a reorg can be up to 95 slots deep in the worst case, so waiting for more than 95 blocks should ensure that a previously sent transaction has been finalized—unless more than 1/3 of the nodes are malicious and willing to lose their stake, which is highly improbable.

❌ **Instead of writing this contract:**

```solidity
contract PrivateKeySale {
  euint256 privateKey;
  bool isAlreadyBought = false;

  constructor(externalEuint256 _privateKey, bytes inputProof) {
    privateKey = FHE.fromExternal(_privateKey, inputProof);
    FHE.allowThis(privateKey);
  }

  function buyPrivateKey() external payable {
    require(msg.value == 1 ether, "Must pay 1 ETH");
    require(!isBought, "Private key already bought");
    isBought = true;
    FHE.allow(encryptedPrivateKey, msg.sender);
  }
}
```

Since the \`privateKey\`\` encrypted variable contains critical information, we don't want to mistakenly leak it for free if a reorg occurs. This could happen in the previous example because we immediately grant authorization to the buyer in the same transaction that processes the sale.

✅ **We recommend writing something like this instead:**

```solidity
contract PrivateKeySale {
  euint256 privateKey;
  bool isAlreadyBought = false;
  uint256 blockWhenBought = 0;
  address buyer;

  constructor(externalEuint256 _privateKey, bytes inputProof) {
    privateKey = FHE.fromExternal(_privateKey, inputProof);
    FHE.allowThis(privateKey);
  }

  function buyPrivateKey() external payable {
    require(msg.value == 1 ether, "Must pay 1 ETH");
    require(!isBought, "Private key already bought");
    isBought = true;
    blockWhenBought = block.number;
    buyer = msg.sender;
  }

  function requestACL() external {
    require(isBought, "Private key has not been bought yet");
    require(block.number > blockWhenBought + 95, "Too early to request ACL, risk of reorg");
    FHE.allow(privateKey, buyer);
  }
}
```

This approach ensures that at least 96 blocks have elapsed between the transaction that purchases the private key and the transaction that authorizes the buyer to decrypt it.

{% hint style="info" %}
This type of contract worsens the user experience by adding a timelock before users can decrypt data, so it should be used sparingly: only when leaked information could be critically important and high-value.
{% endhint %}


# Branching

This document explains how to implement conditional logic (if/else branching) when working with encrypted values in FHEVM. Unlike typical Solidity programming, working with Fully Homomorphic Encryption (FHE) requires specialized methods to handle conditions on encrypted data.

This document covers encrypted branching and how to move from an encrypted condition to a non-encrypted business logic in your smart contract.

## What is confidential branching?

In FHEVM, when you perform [comparison operations](https://docs.zama.org/protocol/solidity-guides/operations#comparison-operations), the result is an encrypted boolean (`ebool`). Since encrypted booleans do not support standard boolean operations like `if` statements or logical operators, conditional logic must be implemented using specialized methods.

To facilitate conditional assignments, FHEVM provides the `FHE.select` function, which acts as a ternary operator for encrypted values.

## **Using `FHE.select` for conditional logic**

The `FHE.select` function enables branching logic by selecting one of two encrypted values based on an encrypted condition (`ebool`). It works as follows:

```solidity
FHE.select(condition, valueIfTrue, valueIfFalse);
```

* **`condition`**: An encrypted boolean (`ebool`) resulting from a comparison.
* **`valueIfTrue`**: The encrypted value to return if the condition is true.
* **`valueIfFalse`**: The encrypted value to return if the condition is false.

## **Example: Auction Bidding Logic**

Here's an example of using conditional logic to update the highest winning number in a guessing game:

```solidity
function bid(externalEuint64 encryptedValue, bytes calldata inputProof) external onlyBeforeEnd {
  // Convert the encrypted input to an encrypted 64-bit integer
  euint64 bid = FHE.asEuint64(encryptedValue, inputProof);

  // Compare the current highest bid with the new bid
  ebool isAbove = FHE.lt(highestBid, bid);

  // Update the highest bid if the new bid is greater
  highestBid = FHE.select(isAbove, bid, highestBid);

  // Allow the contract to use the updated highest bid ciphertext
  FHE.allowThis(highestBid);
}
```

{% hint style="info" %}
This is a simplified example to demonstrate the functionality.
{% endhint %}

### How Does It Work?

* **Comparison**:
  * The `FHE.lt` function compares `highestBid` and `bid`, returning an `ebool` (`isAbove`) that indicates whether the new bid is higher.
* **Selection**:
  * The `FHE.select` function updates `highestBid` to either the new bid or the previous highest bid, based on the encrypted condition `isAbove`.
* **Permission Handling**:
  * After updating `highestBid`, the contract reauthorizes itself to manipulate the updated ciphertext using `FHE.allowThis`.

## Key Considerations

* **Value change behavior:** Each time `FHE.select` assigns a value, a new ciphertext is created, even if the underlying plaintext value remains unchanged. This behavior is inherent to FHE and ensures data confidentiality, but developers should account for it when designing their smart contracts.
* **Gas consumption:** Using `FHE.select` and other encrypted operations incurs additional gas costs compared to traditional Solidity logic. Optimize your code to minimize unnecessary operations.
* **Access control:** Always use appropriate ACL functions (e.g., `FHE.allowThis`, `FHE.allow`) to ensure the updated ciphertexts are authorized for use in future computations or transactions.

***

## How to branch to a non-confidential path?

So far, this section only covered how to do branching using encrypted variables. However, there may be many cases where the "public" contract logic will depend on the outcome from a encrypted path.

To do so, there are only one way to branch from an encrypted path to a non-encrypted path: it requires an off-chain public decryption. Hence, any contract logic that requires moving from an encrypted input to a non-encrypted path always requires an async contract logic.

## **Example: Auction Bidding Logic: Item Release**

Going back to our previous example with the auction bidding logic. Let's assume that the winner of the auction can receive some prize, which is not confidential.

```solidity
bool public isPrizeDistributed;
eaddress internal highestBidder;
euint64 internal highestBid;

function bid(externalEuint64 encryptedValue, bytes calldata inputProof) external onlyBeforeEnd {
  // Convert the encrypted input to an encrypted 64-bit integer
  euint64 bid = FHE.asEuint64(encryptedValue, inputProof);

  // Compare the current highest bid with the new bid
  ebool isAbove = FHE.lt(highestBid, bid);

  // Update the highest bid if the new bid is greater
  highestBid = FHE.select(isAbove, bid, highestBid);

  // Update the highest bidder address if the new bid is greater
  highestBidder = FHE.select(isAbove, FHE.asEaddress(msg.sender), currentBidder));

  // Allow the contract to use the highest bidder address
  FHE.allowThis(highestBidder);

  // Allow the contract to use the updated highest bid ciphertext
  FHE.allowThis(highestBid);
}

function revealWinner() external onlyAfterEnd {
  FHE.makePubliclyDecryptable(highestBidder);
}

function transferPrize(address auctionWinner, bytes calldata decryptionProof) external {
  require(!isPrizeDistributed, "Prize has already been distributed");

  bytes32[] memory cts = new bytes32[](1);
  cts[0] = FHE.toBytes32(highestBidder);

  bytes memory cleartexts = abi.encode(auctionWinner);

  // This FHE call reverts the transaction if:
  // - the decryption proof is invalid.
  // - the provided cleartext (auctionWinner) does not match the cleartext value
  //   that results from the off-chain decryption of the ciphertext (highestBidder).
  // - the decryption proof does not correspond to the specific pairing of
  //   the ciphertext (highestBidder) and the cleartext (auctionWinner).
  FHE.checkSignatures(cts, cleartexts, decryptionProof);

  isPrizeDistributed = true;
  // Business logic to transfer the prize to the auction winner
}
```

{% hint style="info" %}
This is a simplified example to demonstrate the functionality.
{% endhint %}

As you can see the in the above example, the path to move from an encrypted condition to a decrypted business logic must be async and requires an off-chain public decryption to reveal the result of the logic using encrypted variables.

## Summary

* **`FHE.select`** is a powerful tool for conditional logic on encrypted values.
* Encrypted booleans (`ebool`) and values maintain confidentiality, enabling privacy-preserving logic.
* Developers should account for gas costs and ciphertext behavior when designing conditional operations.


# Dealing with branches and conditions

This document explains how to handle branches, loops or conditions when working with Fully Homomorphic Encryption (FHE), specifically when the condition / index is encrypted.

## Breaking a loop

❌ In FHE, it is not possible to break a loop based on an encrypted condition. For example, this would not work:

```solidity
euint8 maxValue = FHE.asEuint(6); // Could be a value between 0 and 10
euint8 x = FHE.asEuint(0);
// some code
while(FHE.lt(x, maxValue)){
    x = FHE.add(x, 2);
}
```

If your code logic requires looping on an encrypted boolean condition, we highly suggest to try to replace it by a finite loop with an appropriate constant maximum number of steps and use `FHE.select` inside the loop.

## Suggested approach

✅ For example, the previous code could maybe be replaced by the following snippet:

```solidity
euint8 maxValue = FHE.asEuint(6); // Could be a value between 0 and 10
euint8 x;
// some code
for (uint32 i = 0; i < 10; i++) {
    euint8 toAdd = FHE.select(FHE.lt(x, maxValue), 2, 0);
    x = FHE.add(x, toAdd);
}
```

In this snippet, we perform 10 iterations, adding 4 to `x` in each iteration as long as the iteration count is less than `maxValue`. If the iteration count exceeds `maxValue`, we add 0 instead for the remaining iterations because we can't break the loop.

## Best practices

### Obfuscate branching

The previous paragraph emphasized that branch logic should rely as much as possible on `FHE.select` instead of decryptions. It hides effectively which branch has been executed.

However, this is sometimes not enough. Enhancing the privacy of smart contracts often requires revisiting your application's logic.

For example, if implementing a simple AMM for two encrypted ERC20 tokens based on a linear constant function, it is recommended to not only hide the amounts being swapped, but also the token which is swapped in a pair.

✅ Here is a very simplified example implementation, we suppose here that the rate between tokenA and tokenB is constant and equals to 1:

```solidity
// typically either encryptedAmountAIn or encryptedAmountBIn is an encrypted null value
// ideally, the user already owns some amounts of both tokens and has pre-approved the AMM on both tokens
function swapTokensForTokens(
  externalEuint32 encryptedAmountAIn,
  externalEuint32 encryptedAmountBIn,
  bytes calldata inputProof
) external {
  euint32 encryptedAmountA = FHE.asEuint32(encryptedAmountAIn, inputProof); // even if amount is null, do a transfer to obfuscate trade direction
  euint32 encryptedAmountB = FHE.asEuint32(encryptedAmountBIn, inputProof); // even if amount is null, do a transfer to obfuscate trade direction

  // send tokens from user to AMM contract
  FHE.allowTransient(encryptedAmountA, tokenA);
  IConfidentialERC20(tokenA).transferFrom(msg.sender, address(this), encryptedAmountA);

  FHE.allowTransient(encryptedAmountB, tokenB);
  IConfidentialERC20(tokenB).transferFrom(msg.sender, address(this), encryptedAmountB);

  // send tokens from AMM contract to user
  // Price of tokenA in tokenB is constant and equal to 1, so we just swap the encrypted amounts here
  FHE.allowTransient(encryptedAmountB, tokenA);
  IConfidentialERC20(tokenA).transfer(msg.sender, encryptedAmountB);

  FHE.allowTransient(encryptedAmountA, tokenB);
  IConfidentialERC20(tokenB).transferFrom(msg.sender, address(this), encryptedAmountA);
}
```

Notice that to preserve confidentiality, we had to make two inputs transfers on both tokens from the user to the AMM contract, and similarly two output transfers from the AMM to the user, even if technically most of the times it will make sense that one of the user inputs `encryptedAmountAIn` or `encryptedAmountBIn` is actually an encrypted zero.

This is different from a classical non-confidential AMM with regular ERC20 tokens: in this case, the user would need to just do one input transfer to the AMM on the token being sold, and receive only one output transfer from the AMM on the token being bought.

### Avoid using encrypted indexes

Using encrypted indexes to pick an element from an array without revealing it is not very efficient, because you would still need to loop on all the indexes to preserve confidentiality.

However, there are plans to make this kind of operation much more efficient in the future, by adding specialized operators for arrays.

For instance, imagine you have an encrypted array called `encArray` and you want to update an encrypted value `x` to match an item from this list, `encArray[i]`, *without* disclosing which item you're choosing.

❌ You must loop over all the indexes and check equality homomorphically, however this pattern is very expensive in gas and should be avoided whenever possible.

```solidity
euint32 x;
euint32[] encArray;

function setXwithEncryptedIndex(externalEuint32 encryptedIndex, bytes calldata inputProof) public {
    euint32 index = FHE.asEuint32(encryptedIndex, inputProof);
    for (uint32 i = 0; i < encArray.length; i++) {
        ebool isEqual = FHE.eq(index, i);
        x = FHE.select(isEqual, encArray[i], x);
    }
    FHE.allowThis(x);
}
```


# Error handling

This document explains how to handle errors effectively in FHEVM smart contracts. Since transactions involving encrypted data do not automatically revert when conditions are not met, developers need alternative mechanisms to communicate errors to users.

## **Challenges in error handling**

In the context of encrypted data:

1. **No automatic reversion**: Transactions do not revert if a condition fails, making it challenging to notify users of issues like insufficient funds or invalid inputs.
2. **Limited feedback**: Encrypted computations lack direct mechanisms for exposing failure reasons while maintaining confidentiality.

## **Recommended approach: Error logging with a handler**

To address these challenges, implement an **error handler** that records the most recent error for each user. This allows dApps or frontends to query error states and provide appropriate feedback to users.

### **Example implementation**

The following contract snippet demonstrates how to implement and use an error handler:

```solidity
struct LastError {
  euint8 error;      // Encrypted error code
  uint timestamp;    // Timestamp of the error
}

// Define error codes
euint8 internal NO_ERROR;
euint8 internal NOT_ENOUGH_FUNDS;

constructor() {
  NO_ERROR = FHE.asEuint8(0);           // Code 0: No error
  NOT_ENOUGH_FUNDS = FHE.asEuint8(1);   // Code 1: Insufficient funds
}

// Store the last error for each address
mapping(address => LastError) private _lastErrors;

// Event to notify about an error state change
event ErrorChanged(address indexed user);

/**
 * @dev Set the last error for a specific address.
 * @param error Encrypted error code.
 * @param addr Address of the user.
 */
function setLastError(euint8 error, address addr) private {
  _lastErrors[addr] = LastError(error, block.timestamp);
  emit ErrorChanged(addr);
}

/**
 * @dev Internal transfer function with error handling.
 * @param from Sender's address.
 * @param to Recipient's address.
 * @param amount Encrypted transfer amount.
 */
function _transfer(address from, address to, euint32 amount) internal {
  // Check if the sender has enough balance to transfer
  ebool canTransfer = FHE.le(amount, balances[from]);

  // Log the error state: NO_ERROR or NOT_ENOUGH_FUNDS
  setLastError(FHE.select(canTransfer, NO_ERROR, NOT_ENOUGH_FUNDS), msg.sender);

  // Perform the transfer operation conditionally
  balances[to] = FHE.add(balances[to], FHE.select(canTransfer, amount, FHE.asEuint32(0)));
  FHE.allowThis(balances[to]);
  FHE.allow(balances[to], to);

  balances[from] = FHE.sub(balances[from], FHE.select(canTransfer, amount, FHE.asEuint32(0)));
  FHE.allowThis(balances[from]);
  FHE.allow(balances[from], from);
}
```

## **How It Works**

1. **Define error codes**:
   * `NO_ERROR`: Indicates a successful operation.
   * `NOT_ENOUGH_FUNDS`: Indicates insufficient balance for a transfer.
2. **Record errors**:
   * Use the `setLastError` function to log the latest error for a specific address along with the current timestamp.
   * Emit the `ErrorChanged` event to notify external systems (e.g., dApps) about the error state change.
3. **Conditional updates**:
   * Use the `FHE.select` function to update balances and log errors based on the transfer condition (`canTransfer`).
4. **Frontend integration**:
   * The dApp can query `_lastErrors` for a user’s most recent error and display appropriate feedback, such as "Insufficient funds" or "Transaction successful."

## **Example error query**

The frontend or another contract can query the `_lastErrors` mapping to retrieve error details:

```solidity
/**
 * @dev Get the last error for a specific address.
 * @param user Address of the user.
 * @return error Encrypted error code.
 * @return timestamp Timestamp of the error.
 */
function getLastError(address user) public view returns (euint8 error, uint timestamp) {
  LastError memory lastError = _lastErrors[user];
  return (lastError.error, lastError.timestamp);
}
```

## **Benefits of this approach**

1. **User feedback**:
   * Provides actionable error messages without compromising the confidentiality of encrypted computations.
2. **Scalable error tracking**:
   * Logs errors per user, making it easy to identify and debug specific issues.
3. **Event-driven notifications**:
   * Enables frontends to react to errors in real time via the `ErrorChanged` event.

By implementing error handlers as demonstrated, developers can ensure a seamless user experience while maintaining the privacy and integrity of encrypted data operations.


# Decryption

## Public Decryption

This section explains how to handle public decryption in FHEVM. Public decryption allows plaintext data to be accessed when required for contract logic or user presentation, ensuring confidentiality is maintained throughout the process.

Public decryption is essential in two primary cases:

1. **Smart contract logic**: A contract requires plaintext values for computations or decision-making.
2. **User interaction**: Plaintext data needs to be revealed to all users, such as revealing the decision of the vote.

### Overview

Public decryption of a confidential on-chain result is designed as an asynchronous three-steps process that splits the work between the blockchain (on-chain) and off-chain execution environments.

**Step 1: On-Chain Setup - Enabling Permanent Public Access**

This step is executed by the smart contract using the FHE Solidity library to signal that a specific confidential result is ready to be revealed.

* **FHE Solidity Library Function:** `FHE.makePubliclyDecryptable`
* **Action:** The contract sets the ciphertext handle's status as publicly decryptable, **globally and permanently** authorizing any entity to request its off-chain cleartext value.
* **Result:** The ciphertext is now accessible to any entity, which can request its decryption from the Zama off-chain Relayer.

**Step 2: Off-chain Decryption - Decryption and Proof Generation**

This step can be executed by any off-chain client using the Relayer SDK.

* **Relayer SDK Function:** `FhevmInstance.publicDecrypt`
* **Action:** The off-chain client submits the ciphertext handle to the Zama Relayer's Key Management System (KMS).
* **Result:** The Zama Relayer returns three items:
  1. The cleartext (the decrypted value).
  2. The ABI-encoding of that cleartext.
  3. A Decryption Proof (a byte array of signatures and metadata) that serves as a cryptographic guarantee that the cleartext is the authentic, unmodified result of the decryption performed by the KMS.

**Step 3: On-Chain Verification - Submit and Guarantee Authenticity**

This final step is executed on-chain by the contrat using the FHE Solidity library with the proof generated off-chain to ensure the cleartext submitted to the contract is trustworthy.

* **FHE Solidity Library Function:** `FHE.checkSignatures`
* **Action:** The caller submits the cleartext and decryption proof back to a contract function. The contract calls `FHE.checkSignatures`, which reverts the transaction if the proof is invalid or does not match the cleartext/ciphertext pair.
* **Result:** The receiving contract gains a cryptographic guarantee that the submitted cleartext is the authentic decrypted value of the original ciphertext. The contract can then securely execute its business logic (e.g., reveal a vote, transfer funds, update state).

### Tutorial

This tutorial provides a deep dive into the three-step asynchronous public decryption process required to finalize a confidential on-chain computation by publicly revealing its result.

The Solidity contract provided below, `FooBarContract`, is used to model this entire workflow. The contract's main function `runFooBarConfidentialLogic` simulates the execution of a complex confidential computation (e.g., calculating a winner or a final price) that results in 2 encrypted final values (ciphertexts) `_encryptedFoo` and `_encryptedBar`.

Then, in order to finalize the workflow, the `FooBarContract` needs the decrypted clear values of both `_encryptedFoo` and `_encryptedBar` to decide whether to trigger some finalization logic (e.g. reveal a vote, transfer funds). The `FooBarContract`'s function `_runFooBarClearBusinessLogicFinalization` simulates this step. Since the FHEVM prevents direct on-chain decryption, the process must shift to an off-chain decryption phase, which presents a challenge: ***How can the\*\*\*\* ****`FooBarContract`**** ****trust that the cleartext submitted back to the chain is the authentic, unmodified result of the decryption of both**** ****`_encryptedFoo`**** ****and**** ****`_encryptedBar`****?***

This is where the off-chain `publicDecrypt` function and the on-chain `checkSignatures` function come into play.

#### The Solidity Contract

```solidity
pragma solidity ^0.8.24;

import "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract FooBarContract is ZamaEthereumConfig {
  ebool _encryptedFoo;
  euint8 _encryptedBar;
  bool _clearFoo;
  uint8 _clearBar;
  bool _isFinalized;

  event ClearFooBarRequested(ebool encryptedFoo, euint8 encryptedBar);

  constructor() {}

  function _isFooBarConfidentialLogicExecuted() private returns (bool) {
    return FHE.isInitialized(_encryptedFoo) && FHE.isInitialized(_encryptedBar);
  }

  modifier whenConfidentialLogicExecuted() {
    require(_isFooBarConfidentialLogicExecuted(), "foo confidential logic not yet executed!")
    _;
  }

  function runFooBarConfidentialLogic() external {
    require(!_isFooBarConfidentialLogicExecuted(), "foobar confidential logic already executed!")
    _encryptedFoo = FHE.randEbool();
    _encryptedBar = FHE.randEuint8();
  }

  function getEncryptedFoo() public whenConfidentialLogicExecuted returns (ebool) {
    return _encryptedFoo;
  }

  function getEncryptedBar() public whenConfidentialLogicExecuted returns (euint8) {
    return _encryptedBar;
  }

  function requestClearFooBar() external whenConfidentialLogicExecuted {
    FHE.makePubliclyDecryptable(_encryptedFoo);
    FHE.makePubliclyDecryptable(_encryptedBar);

    emit ClearFooBarRequested(_encryptedFoo, _encryptedBar);
  }

  function finalizeClearFooBar(bool clearFoo, uint8 clearBar, bytes memory publicDecryptionProof) external whenConfidentialLogicExecuted {
    require(!_isFinalized, "foo is already revealed");

    // ⚠️ Crucial Ordering Constraint
    // ==============================
    // The decryption proof is cryptographically bound to the specific ORDER of handles.
    // A proof computed for `[efoo, ebar]` will be different
    // from a proof computed for `[ebar, efoo]`.
    //
    // Here we expect a proof computed for `[efoo, ebar]`
    //
    bytes32[] memory ciphertextEfooEbar = new bytes32[](2);
    ciphertextEfooEbar[0] = FHE.toBytes32(_encryptedFoo);
    ciphertextEfooEbar[1] = FHE.toBytes32(_encryptedBar);

    // ⚠️ Once again, the order is critical to compute the ABI encoded array of clear values
    // The order must match the order in ciphertextEfooEbar: (efoo, ebar)
    bytes memory abiClearFooClearBar = abi.encode(clearFoo, clearBar);
    FHE.checkSignatures(ciphertextEfooEbar, abiClearFooClearBar, publicDecryptionProof);

    _isFinalized = true;

    _runFooBarClearBusinessLogicFinalization();
  }

  function _runFooBarClearBusinessLogicFinalization() private {
    // Business logic starts here.
    // Transfer ERC20, releave price or winner etc.
  }
}
```

{% stepper %}
{% step %}

### Run On-Chain Confidential Logic

We first execute the on-chain confidential logic using a TypeScript client. This simulates the initial phase of the confidential computation.

```typescript
const tx = await contract.runFooBarConfidentialLogic();
await tx.wait();
```

{% endstep %}

{% step %}

### Run On-Chain Request Clear Values

With the confidential logic complete, the next step is to execute the on-chain function that requests and enables public decryption of the computed encrypted values `_encryptedFoo` and `_encryptedBar`. In a production scenario, we might use a Solidity event to notify the off-chain client that the necessary encrypted values are ready for off-chain public decryption.

```typescript
const tx = await contract.requestClearFooBar();
const txReceipt = await tx.wait();
const { efoo, ebar } = parseClearFooBarRequestedEvent(contract, txReceipt);
```

{% endstep %}

{% step %}

### Run Off-Chain Public Decryption

Now that the ciphertexts are marked as publicly decryptable, we call the off-chain function `publicDecrypt` using the `relayer-sdk`. This fetches the clear values along with the Zama KMS decryption proof required for the final on-chain verification.

{% hint style="warning" %}
**Crucial Ordering Constraint:** The decryption proof is cryptographically bound to the specific order of handles passed in the input array. The proof computed for `[efoo, ebar]` is different from the proof computed for `[ebar, efoo]`.
{% endhint %}

```typescript
const instance: FhevmInstance = await createInstance();
const results: PublicDecryptResults = await instance.publicDecrypt([efoo, ebar]);
const clearFoo = results.values[efoo];
const clearBar = results.values[ebar];
// Warning! The decryption proof is computed for [efoo, ebar], NOT [ebar, efoo]!
const decryptionProof: `0x${string}` = results.decryptionProof;
```

{% endstep %}

{% step %}

### Run On-Chain

On the client side, we have computed all the clear values and, crucially, obtained the associated decryption proof. We can now securely move on to the final step: sending this data on-chain to trigger verification and final business logic simulated in the `_runFooBarClearBusinessLogicFinalization` contract function. If verification succeeds, the contract securely executes the `_runFooBarClearBusinessLogicFinalization` (e.g., transfers funds, publishes the vote result, etc.), completing the full confidential workflow.

```typescript
const tx = await contract.finalizeClearFooBar(clearFoo, clearBar, results.decryptionProof);
const txReceipt = await tx.wait();
```

{% endstep %}
{% endstepper %}

## Public Decryption On-Chain & Off-Chain API

#### On-chain `FHE.makePubliclyDecryptable` function

The contract sets the ciphertext handle's status as publicly decryptable, globally and permanently authorizing any entity to request its off-chain cleartext value. Note the calling contract must have ACL permission to access the handle in the first place.

```solidity
function makePubliclyDecryptable(ebool value) internal;
function makePubliclyDecryptable(euint8 value) internal;
function makePubliclyDecryptable(euint16 value) internal;
...
function makePubliclyDecryptable(euint256 value) internal;
```

**Function arguments**

**Function return**

This function has no return value

#### Off-chain relayer-sdk `publicDecrypt` function

The relayer-sdk `publicDecrypt` function is defined as follow:

```typescript
export type PublicDecryptResults = {
  clearValues: Record<`0x${string}`, bigint | boolean | `0x${string}`>;
  abiEncodedClearValues: `0x${string}`;
  decryptionProof: `0x${string}`;
};
export type FhevmInstance = {
  //...
  publicDecrypt: (handles: (string | Uint8Array)[]) => Promise<PublicDecryptResults>;
  //...
};
```

**Function arguments**

| Argument  | Description                                                                | Constraints                                                                                          |
| --------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `handles` | The list of ciphertext handles (represented as bytes32 values) to decrypt. | These handles must correspond to ciphertexts that have been marked as publicly decryptable on-chain. |

**Function return type `PublicDecryptResults`**

The function returns an object containing the three essential components required for the final on-chain verification in Step 3 of the public decryption workflow:

| Property                | Type                                                        | Description                                                                                                                            | On-Chain usage                                                                  |
| ----------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `clearValues`           | `Record<`0x${string}`, bigint \| boolean \|` 0x${string}`>` | An object mapping each input ciphertext handle to its raw decrypted cleartext value.                                                   | N/A                                                                             |
| `abiEncodedClearValues` | `0x${string}`                                               | The ABI-encoded byte string of all decrypted cleartext values, preserving the exact order of the input handles list.                   | `abiEncodedCleartexts` argument when calling the on-chain `FHE.checkSignatures` |
| `decryptionProof`       | `0x${string}`                                               | A byte array containing the KMS cryptographic signatures and necessary metadata that proves the decryption was legitimately performed. | `decryptionProof` argument when calling the on-chain `FHE.checkSignatures`      |

#### On-chain `FHE.checkSignatures` function

```solidity
function checkSignatures(bytes32[] memory handlesList, bytes memory abiEncodedCleartexts, bytes memory decryptionProof) internal
```

**Function arguments**

| Argument               | Description                                                                                                                                                                     | Constraint                                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `handlesList`          | The list of ciphertext handles (represented as bytes32 values) whose decryption is being verified.                                                                              | Must contain the exact same number of elements as the cleartext values in abiEncodedCleartexts.                                                |
| `abiEncodedCleartexts` | The ABI encoding of the decrypted cleartext values associated with the handles. (Use abi.encode to prepare this argument.)                                                      | Order is critical: The i-th value in this encoding must be the cleartext that corresponds to the i-th handle in handlesList. Types must match. |
| `decryptionProof`      | A byte array containing the KMS cryptographic signatures and necessary metadata that prove the off-chain decryption was performed by the authorized Zama Key Management System. | This proof is generated by the Zama KMS and is obtained via the `relayer-sdk.publicDecrypt` function.                                          |

**Function return**

This function has no return value and simply reverts if the proof verification failed.

{% hint style="warning" %}
Notice that the callback should always verify the signatures and implement a replay protection mechanism (see below).
{% endhint %}


# Write FHEVM tests in Hardhat

In this section, you'll find everything you need to set up a new [Hardhat](https://hardhat.org) project and start developing FHEVM smart contracts from scratch using the [FHEVM Hardhat Plugin](https://www.npmjs.com/package/@fhevm/hardhat-plugin)

### Enabling the FHEVM Hardhat Plugin in your Hardhat project

Like any Hardhat plugin, the [FHEVM Hardhat Plugin](https://www.npmjs.com/package/@fhevm/hardhat-plugin) must be enabled by adding the following `import` statement to your `hardhat.config.ts` file:

```typescript
import "@fhevm/hardhat-plugin";
```

{% hint style="warning" %}
Without this import, the Hardhat FHEVM API will **not** be available in your Hardhat runtime environment (HRE).
{% endhint %}

### Accessing the Hardhat FHEVM API

The plugin extends the standard [Hardhat Runtime Environment](https://hardhat.org/hardhat-runner/docs/advanced/hardhat-runtime-environment) (or `hre` in short) with the new `fhevm` Hardhat module.

You can access it in either of the following ways:

```typescript
import { fhevm } from "hardhat";
```

or

```typescript
import * as hre from "hardhat";

// Then access: hre.fhevm
```

### Encrypting Values Using the Hardhat FHEVM API

Suppose the FHEVM smart contract you want to test has a function called `foo` that takes an encrypted `uint32` value as input. The Solidity function `foo` should be declared as follows:

```solidity
function foo(externalEunit32 value, bytes calldata memory inputProof);
```

Where:

* `externalEunit32 value` : is a `bytes32` representing the encrypted `uint32`
* `bytes calldata memory inputProof` : is a `bytes` array representing the zero-knowledge proof of knowledge that validates the encryption

To compute these arguments in TypeScript, you need:

* The **address of the target smart contract**
* The **signer’s address** (i.e., the account sending the transaction)

{% stepper %}
{% step %}
**Create a new encryted input**

```ts
// use the `fhevm` API module from the Hardhat Runtime Environment
const input = fhevm.createEncryptedInput(contractAddress, signers.alice.address);
```

{% endstep %}

{% step %}
**Add the value you want to encrypt.**

```ts
input.add32(12345);
```

{% endstep %}

{% step %}
**Perform local encryption.**

```ts
const encryptedInputs = await input.encrypt();
```

{% endstep %}

{% step %}
**Call the Solidity function**

```ts
const externalUint32Value = encryptedInputs.handles[0];
const inputProof = encryptedInputs.proof;

const tx = await input.foo(externalUint32Value, inputProof);
await tx.wait();
```

{% endstep %}
{% endstepper %}

#### Encryption examples

* [Basic encryption examples](https://docs.zama.ai/protocol/examples/basic/encryption)
* [FHECounter](https://docs.zama.ai/protocol/examples#an-fhe-counter)

### Decrypting values using the Hardhat FHEVM API

Suppose user **Alice** wants to decrypt a `euint32` value that is stored in a smart contract exposing the following Solidity `view` function:

```solidity
function getEncryptedUint32Value() public view returns (euint32) { returns _encryptedUint32Value; }
```

{% hint style="warning" %}
For simplicity, we assume that both Alice’s account and the target smart contract already have the necessary FHE permissions to decrypt this value. For a detailed explanation of how FHE permissions work, see the [`initializeUint32()`](https://docs.zama.ai/protocol/examples/basic/decryption/fhe-decrypt-single-value#tab-decryptsinglevalue.sol) function in [DecryptSingleValue.sol](https://docs.zama.ai/protocol/examples/basic/decryption/fhe-decrypt-single-value#tab-decryptsinglevalue.sol).
{% endhint %}

{% stepper %}
{% step %}
**Retrieve the encrypted value (a `bytes32` handle) from the smart contract:**

```ts
const encryptedUint32Value = await contract.getEncryptedUint32Value();
```

{% endstep %}

{% step %}
**Perform the decryption using the FHEVM API:**

```ts
const clearUint32Value = await fhevm.userDecryptEuint(
  FhevmType.euint32, // Encrypted type (must match the Solidity type)
  encryptedUint32Value, // bytes32 handle Alice wants to decrypt
  contractAddress, // Target contract address
  signers.alice, // Alice’s wallet
);
```

{% hint style="warning" %}
If either the target smart contract or the user does **NOT** have FHE permissions, then the decryption call will fail!
{% endhint %}
{% endstep %}
{% endstepper %}

#### Supported Decryption Types

Use the appropriate function for each encrypted data type:

| Type       | Function                         |
| ---------- | -------------------------------- |
| `euintXXX` | `fhevm.userDecryptEuint(...)`    |
| `ebool`    | `fhevm.userDecryptEbool(...)`    |
| `eaddress` | `fhevm.userDecryptEaddress(...)` |

#### Decryption examples

* [Basic decryption examples](https://docs.zama.ai/protocol/examples/basic/decryption)
* [FHECounter](https://docs.zama.ai/protocol/examples#an-fhe-counter)




# Deploy contracts and run tests

In this section, you'll find everything you need to test your FHEVM smart contracts in your [Hardhat](https://hardhat.org) project.

### FHEVM Runtime Modes

The FHEVM Hardhat plugin provides three **FHEVM runtime modes** tailored for different stages of contract development and testing. Each mode offers a trade-off between speed, encryption, and persistence.

1. The **Hardhat (In-Memory)** default network: 🧪 *Uses mock encryption.* Ideal for regular tests, CI test coverage, and fast feedback during early contract development. No real encryption is used.
2. The **Hardhat Node (Local Server)** network: 🧪 *Uses mock encryption.* Ideal when you need persistent state - for example, when testing frontend interactions, simulating user flows, or validating deployments in a realistic local environment. Still uses mock encryption.
3. The **Sepolia Testnet** network: 🔐 *Uses real encryption.* Use this mode once your contract logic is stable and validated locally. This is the only mode that runs on the full FHEVM stack with **real encrypted values**. It simulates real-world production conditions but is slower and requires Sepolia ETH.

{% hint style="success" %}
**Zama Testnet** is not a blockchain itself. It is a protocol that enables you to run confidential smart contracts on existing blockchains (such as Ethereum, Base, and others) with the support of encrypted types. See the [FHE on blockchain](https://docs.zama.ai/protocol/protocol/overview) guide to learn more about the protocol architecture.

Currently, **Zama Protocol** is available on the **Sepolia Testnet**. Support for additional chains will be added in the future. [See the roadmap↗](https://docs.zama.ai/protocol/zama-protocol-litepaper#roadmap)
{% endhint %}

#### Summary

| Mode              | Encryption         | Persistent | Chain     | Speed        | Usage                                             |
| ----------------- | ------------------ | ---------- | --------- | ------------ | ------------------------------------------------- |
| Hardhat (default) | 🧪 Mock            | ❌ No       | In-Memory | ⚡⚡ Very Fast | Fast local testing and coverage                   |
| Hardhat Node      | 🧪 Mock            | ✅ Yes      | Server    | ⚡ Fast       | Frontend integration and local persistent testing |
| Sepolia Testnet   | 🔐 Real Encryption | ✅ Yes      | Server    | 🐢 Slow      | Full-stack validation with real encrypted data    |

### The FHEVM Hardhat Template

To demonstrate the three available testing modes, we'll use the [fhevm-hardhat-template](https://github.com/zama-ai/fhevm-hardhat-template), which comes with the FHEVM Hardhat Plugin pre-installed, a basic `FHECounter` smart contract, and ready-to-use tasks for interacting with a deployed instance of this contract.

### Run on Hardhat (default)

To run your tests in-memory using FHEVM mock values, simply run the following:

```sh
npx hardhat test --network hardhat
```

### Run on Hardhat Node

You can also run your tests against a local Hardhat node, allowing you to deploy contract instances and interact with them in a persistent environment.

{% stepper %}
{% step %}
**Launch the Hardhat Node server:**

* Open a new terminal window.
* From the root project directory, run the following:

```sh
npx hardhat node
```

{% endstep %}

{% step %}
**Run your test suite (optional):**

From the root project directory:

```sh
npx hardhat test --network localhost
```

{% endstep %}

{% step %}
**Deploy the `FHECounter` smart contract on Hardhat Node**

From the root project directory:

```sh
npx hardhat deploy --network localhost
```

Check the deployed contract FHEVM configuration:

```sh
npx hardhat fhevm check-fhevm-compatibility --network localhost --address <deployed contract address>
```

{% endstep %}

{% step %}
**Interact with the deployed `FHECounter` smart contract**

From the root project directory:

1. Decrypt the current counter value:

```sh
npx hardhat --network localhost task:decrypt-count
```

2. Increment the counter by 1:

```sh
npx hardhat --network localhost task:increment --value 1
```

3. Decrypt the new counter value:

```sh
npx hardhat --network localhost task:decrypt-count
```

{% endstep %}
{% endstepper %}

### Run on Sepolia Ethereum Testnet

To test your FHEVM smart contract using real encrypted values, you can run your tests on the Sepolia Testnet.

{% stepper %}
{% step %}
**Rebuild the project for Sepolia**

From the root project directory:

```sh
npx hardhat clean
npx hardhat compile --network sepolia
```

{% endstep %}

{% step %}
**Deploy the `FHECounter` smart contract on Sepolia**

```sh
npx hardhat deploy --network sepolia
```

{% endstep %}

{% step %}
**Check the deployed `FHECounter` contract FHEVM configuration**

From the root project directory:

```sh
npx hardhat fhevm check-fhevm-compatibility --network sepolia --address <deployed contract address>
```

If an internal exception is raised, it likely means the contract was not properly compiled for the Sepolia network.
{% endstep %}

{% step %}
**Interact with the deployed `FHECounter` contract**

From the root project directory:

1. Decrypt the current counter value (⏳ wait...):

```sh
npx hardhat --network sepolia task:decrypt-count
```

2. Increment the counter by 1 (⏳ wait...):

```sh
npx hardhat --network sepolia task:increment --value 1
```

3. Decrypt the new counter value (⏳ wait...):

```sh
npx hardhat --network sepolia task:decrypt-count
```

{% endstep %}
{% endstepper %}



# Write FHEVM-enabled Hardhat Tasks

In this section, you'll learn how to write a custom FHEVM Hardhat task.

Writing tasks is a gas-efficient and flexible way to test your FHEVM smart contracts on the Sepolia network. Creating a custom task is straightforward.

## Prerequisite

* You should be familiar with Hardhat tasks. If you're new to them, refer to the [Hardhat Tasks official documentation](https://hardhat.org/hardhat-runner/docs/guides/tasks#writing-tasks).
* You should have already **completed** the [FHEVM Tutorial](https://docs.zama.ai/protocol/solidity-guides/getting-started/setup).
* This page provides a step-by-step walkthrough of the `task:decrypt-count` tasks included in the file [tasks/FHECounter.ts](https://github.com/zama-ai/fhevm-hardhat-template/blob/main/tasks/FHECounter.ts) file, located in the [fhevm-hardhat-template](https://github.com/zama-ai/fhevm-hardhat-template) repository.

{% stepper %}
{% step %}

## A Basic Hardhat Task.

Let’s start with a simple example: fetching the current counter value from a basic `Counter.sol` contract.

If you're already familiar with Hardhat and custom tasks, the TypeScript code below should look familiar and be easy to follow:

```ts
task("task:get-count", "Calls the getCount() function of Counter Contract")
  .addOptionalParam("address", "Optionally specify the Counter contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const CounterDeployement = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("Counter");
    console.log(`Counter: ${CounterDeployement.address}`);

    const counterContract = await ethers.getContractAt("Counter", CounterDeployement.address);

    const clearCount = await counterContract.getCount();

    console.log(`Clear count    : ${clearCount}`);
});
```

Now, let’s modify this task to work with FHEVM encrypted values.
{% endstep %}

{% step %}

## Comment Out Existing Logic and rename

First, comment out the existing logic so we can incrementally add the necessary changes for FHEVM integration.

```ts
task("task:get-count", "Calls the getCount() function of Counter Contract")
  .addOptionalParam("address", "Optionally specify the Counter contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    // const { ethers, deployments } = hre;

    // const CounterDeployement = taskArguments.address
    //   ? { address: taskArguments.address }
    //   : await deployments.get("Counter");
    // console.log(`Counter: ${CounterDeployement.address}`);

    // const counterContract = await ethers.getContractAt("Counter", CounterDeployement.address);

    // const clearCount = await counterContract.getCount();

    // console.log(`Clear count    : ${clearCount}`);
});
```

Next, rename the task by replacing:

```ts
task("task:get-count", "Calls the getCount() function of Counter Contract")
```

With:

```ts
task("task:decrypt-count", "Calls the getCount() function of Counter Contract")
```

This updates the task name from `task:get-count` to `task:decrypt-count`, reflecting that it now includes decryption logic for FHE-encrypted values.
{% endstep %}

{% step %}

## Initialize FHEVM CLI API

Replace the line:

```ts
    // const { ethers, deployments } = hre;
```

With:

```ts
    const { ethers, deployments, fhevm } = hre;

    await fhevm.initializeCLIApi();
```

{% hint style="warning" %}
Calling `initializeCLIApi()` is essential. Unlike built-in Hardhat tasks like `test` or `compile`, which automatically initialize the FHEVM runtime environment, custom tasks require you to call this function explicitly. **Make sure to call it at the very beginning of your task** to ensure the environment is properly set up.
{% endhint %}
{% endstep %}

{% step %}

## Call the view function `getCount` from the FHECounter contract

Replace the following commented-out lines:

```ts
    // const CounterDeployement = taskArguments.address
    //   ? { address: taskArguments.address }
    //   : await deployments.get("Counter");
    // console.log(`Counter: ${CounterDeployement.address}`);

    // const counterContract = await ethers.getContractAt("Counter", CounterDeployement.address);

    // const clearCount = await counterContract.getCount();
```

With the FHEVM equivalent:

```ts
    const FHECounterDeployement = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("FHECounter");
    console.log(`FHECounter: ${FHECounterDeployement.address}`);

    const fheCounterContract = await ethers.getContractAt("FHECounter", FHECounterDeployement.address);

    const encryptedCount = await fheCounterContract.getCount();
    if (encryptedCount === ethers.ZeroHash) {
      console.log(`encrypted count: ${encryptedCount}`);
      console.log("clear count    : 0");
      return;
    }
```

Here, `encryptedCount` is an FHE-encrypted `euint32` primitive. To retrieve the actual value, we need to decrypt it in the next step.
{% endstep %}

{% step %}

## Decrypt the encrypted count value.

Now replace the following commented-out line:

```ts
    // console.log(`Clear count    : ${clearCount}`);
```

With the decryption logic:

```ts
    const signers = await ethers.getSigners();
    const clearCount = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedCount,
      FHECounterDeployement.address,
      signers[0],
    );
    console.log(`Encrypted count: ${encryptedCount}`);
    console.log(`Clear count    : ${clearCount}`);
```

At this point, your custom Hardhat task is fully configured to work with FHE-encrypted values and ready to run!
{% endstep %}

{% step %}

## Step 6: Run your custom task using Hardhat Node

**Start the Local Hardhat Node:**

* Open a new terminal window.
* From the root project directory, run the following:

```sh
npx hardhat node
```

**Deploy the FHECounter smart contract on the local Hardhat Node**

```sh
npx hardhat deploy --network localhost
```

**Run your custom task**

```sh
npx hardhat task:decrypt-count --network localhost
```

{% endstep %}

{% step %}

## Step 7: Run your custom task using Sepolia

**Deploy the FHECounter smart contract on Sepolia Testnet (if not already deployed)**

```sh
npx hardhat deploy --network sepolia
```

**Execute your custom task**

```sh
npx hardhat task:decrypt-count --network sepolia
```

{% endstep %}
{% endstepper %}



# How to Transform Your Smart Contract into a FHEVM Smart Contract?

This short guide will walk you through converting a standard Solidity contract into one that leverages Fully Homomorphic Encryption (FHE) using FHEVM. This approach lets you develop your contract logic as usual, then adapt it to support encrypted computation for privacy.

For this guide, we will focus on a voting contract example.

***

## 1. Start with a Standard Solidity Contract

Begin by writing your voting contract in Solidity as you normally would. Focus on implementing the core logic and functionality.

```solidity
// Standard Solidity voting contract example
pragma solidity ^0.8.0;

contract SimpleVoting {
    mapping(address => bool) public hasVoted;
    uint64 public yesVotes;
    uint64 public noVotes;
    uint256 public voteDeadline;

    function vote(bool support) public {
        require(block.timestamp <= voteDeadline, "Too late to vote");
        require(!hasVoted[msg.sender], "Already voted");
        hasVoted[msg.sender] = true;

        if (support) {
            yesVotes += 1;
        } else {
            noVotes += 1;
        }
    }

    function getResults() public view returns (uint64, uint64) {
        return (yesVotes, noVotes);
    }
}
```

***

## 2. Identify Sensitive Data and Operations

Review your contract and determine which variables, functions, or computations require privacy. In this example, the vote counts (`yesVotes`, `noVotes`) and individual votes should be encrypted.

***

## 3. Integrate FHEVM and update your business logic accordingly.

Replace standard data types and operations with their FHEVM equivalents for the identified sensitive parts. Use encrypted types and FHEVM library functions to perform computations on encrypted data.

```solidity
pragma solidity ^0.8.0;

import "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract EncryptedSimpleVoting is ZamaEthereumConfig {
    enum VotingStatus {
        Open,
        DecryptionInProgress,
        ResultsDecrypted
    }
    mapping(address => bool) public hasVoted;

    VotingStatus public status;

    uint64 public decryptedYesVotes;
    uint64 public decryptedNoVotes;

    uint256 public voteDeadline;

    euint64 private encryptedYesVotes;
    euint64 private encryptedNoVotes;

    constructor() {
        encryptedYesVotes = FHE.asEuint64(0);
        encryptedNoVotes = FHE.asEuint64(0);

        FHE.allowThis(encryptedYesVotes);
        FHE.allowThis(encryptedNoVotes);
    }

    function vote(externalEbool support, bytes memory inputProof) public {
        require(block.timestamp <= voteDeadline, "Too late to vote");
        require(!hasVoted[msg.sender], "Already voted");
        hasVoted[msg.sender] = true;
        ebool isSupport = FHE.fromExternal(support, inputProof);
        encryptedYesVotes = FHE.select(isSupport, FHE.add(encryptedYesVotes, 1), encryptedYesVotes);
        encryptedNoVotes = FHE.select(isSupport, encryptedNoVotes, FHE.add(encryptedNoVotes, 1));
        FHE.allowThis(encryptedYesVotes);
        FHE.allowThis(encryptedNoVotes);
        
    }

    function requestVoteDecryption() public {
        require(block.timestamp > voteDeadline, "Voting is not finished");
        bytes32[] memory cts = new bytes32[](2);
        cts[0] = FHE.toBytes32(encryptedYesVotes);
        cts[1] = FHE.toBytes32(encryptedNoVotes);
        uint256 requestId = FHE.requestDecryption(cts, this.callbackDecryptVotes.selector);
        status = VotingStatus.DecryptionInProgress;
    }

    function callbackDecryptVotes(uint256 requestId, bytes memory cleartexts, bytes memory decryptionProof) public {
        FHE.checkSignatures(requestId, cleartexts, decryptionProof);

        (uint64 yesVotes, uint64 noVotes) = abi.decode(cleartexts, (uint64, uint64));
        decryptedYesVotes = yesVotes;
        decryptedNoVotes = noVotes;
        status = VotingStatus.ResultsDecrypted;
    }

    function getResults() public view returns (uint64, uint64) {
        require(status == VotingStatus.ResultsDecrypted, "Results were not decrypted");
        return (
            decryptedYesVotes,
            decryptedNoVotes
        );
    }
}
```

Adjust your contract’s code to accept and return encrypted data where necessary. This may involve changing function parameters and return types to work with ciphertexts instead of plaintext values, as shown above.

* The `vote` function now has two parameters: `support` and `inputProof`.
* The `getResults` can only be called after the decryption occurred. Otherwise, the decrypted results are not visible to anyone.

However, it is far from being the main change. As this example illustrates, working with FHEVM often requires re-architecting the original logic to support privacy.

In the updated code, the logic becomes async; results are hidden until a request (to the oracle) explicitely has to be made to decrypt publically the vote results.

## Conclusion

As this short guide showed, integrating with FHEVM not only requires integration with the FHEVM stack, it also requires refactoring your business logic to support mechanism to swift between encrypted and non-encrypted components of the logic.
