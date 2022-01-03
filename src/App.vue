<template>
	<div class="app">
		<div class="container">
			<div class="header-container">
				<p class="header gradient-text">
					⚔️ Wizarding World Metaverse Slayer ⚔️
				</p>
				<p class="sub-text">
					Welcome to Hogwarts. Let's team up to protect the Wizarding World!
				</p>

				<!-- Scenario #1: Not connected to app - show connect to wallet btn -->
				<div v-if="!currentAccount">
					<div class="connect-wallet-container">
						<img
							src="https://assets.teenvogue.com/photos/5797bd21c487ee73046be961/master/pass/1giphy.gif"
							alt="Harry Potter Gif"
						/>
						<button
							class="cta-button connect-wallet-button"
							@click.prevent="connectWalletAction"
						>
							Connect Wallet To Get Started
						</button>
					</div>
				</div>

				<div
					v-else-if="currentAccount && Object.keys(characterNFT).length == 0"
				>
					<SelectCharacter @on-character-mint="onCharacterMint" />
				</div>
				<div v-else-if="currentAccount && Object.keys(characterNFT).length > 0">
					<Arena :characterNFT="characterNFT" />
				</div>

				<div v-else>Error</div>
			</div>
			<div class="footer-container">
				<img
					alt="Twitter Logo"
					class="twitter-logo"
					src="./assets/twitter-logo.svg"
				/>
				<a
					class="footer-text"
					href="TWITTER_LINK"
					target="_blank"
					rel="noreferrer"
					>built with {{ TWITTER_HANDLE }}</a
				>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, watchEffect } from "vue";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "./constants";

// Vetur has to be OK with importing json modules
// https://stackoverflow.com/a/67285537/11075176
import myEpicGame from "./utils/MyEpicGame.json";

import SelectCharacter from "./components/SelectCharacter.vue";
import Arena from "./components/Arena.vue";
import { CharacterNFT } from "./types/character";

declare let window: any;

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

export default defineComponent({
	name: "App",
	components: {
		SelectCharacter,
		Arena,
	},

	setup() {
		// For displaying
		let currentAccount = ref(null);
		let characterNFT = ref({});
		let isLoading = ref(false);

		// Alternative for async code to run in created, not mounted
		// https://stackoverflow.com/a/67525124/11075176
		onMounted(async () => {
			await connectToWallet();
		});

		// If wallet is connected - check if wallet has NFT by calling smart contract
		watchEffect(async () => {
			if (!currentAccount.value) {
				console.log("no current account");
				return;
			}

			console.log(
				"Checking for Character NFT on address:",
				currentAccount.value
			);

			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const gameContract = new ethers.Contract(
				CONTRACT_ADDRESS,
				myEpicGame.abi,
				signer
			);

			const txn = await gameContract.checkIfUserHasNFT();
			if (txn.name) {
				console.log("User has Character NFT");
				console.log(txn);
				characterNFT.value = transformCharacterData(txn);
			} else {
				console.log("No character NFT found!");
			}

			/*
			 * Once we are done with all the fetching, set loading state to false
			 */
			// setIsLoading(false);
		});

		const connectToWallet = async () => {
			// Check if wallet is connected
			const { ethereum } = window;
			if (!ethereum) {
				alert("Get MetaMask!");
				return;
			}

			console.log("We have the ethereum object", ethereum);

			// Check if we're authorized to access the user's wallet
			const accounts = await ethereum.request({ method: "eth_accounts" });

			// User can have multiple authorized accounts, we grab the first one if its there!
			if (accounts.length !== 0) {
				const account = accounts[0];
				console.log("Found an authorized account:", account);
				currentAccount.value = account;
			} else {
				console.log("No authorized account found");
				// setIsLoading(false);
			}
		};

		// Explicitly connect to wallet upon btn press
		const connectWalletAction = async () => {
			try {
				const { ethereum } = window;

				if (!ethereum) {
					alert("Get MetaMask!");
					return;
				}

				// Fancy method to request access to account.
				const accounts = await ethereum.request({
					method: "eth_requestAccounts",
				});

				// Boom! This should print out public address once we authorize Metamask.
				console.log("Connected", accounts[0]);
				currentAccount.value = accounts[0];
			} catch (error) {
				console.log(error);
			}
		};

		// If user has NFT, show Arena to fight the Boss

		// If user has just minted NFT
		const onCharacterMint = (newCharNFT: CharacterNFT) => {
			characterNFT.value = newCharNFT;
		};

		// const goals = ref([]);

		// let blockchain = {};
		// blockchain.ethers = ethers;
		return {
			TWITTER_LINK,
			TWITTER_HANDLE,

			isLoading,

			currentAccount,
			characterNFT,

			connectWalletAction,
		};
	},
});
</script>

<style>
#app {
	height: 100vh;
	background-color: #0d1116;
	text-align: center;

	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.container {
	height: 100%;
	background-color: #0d1116;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.header-container {
	padding-top: 30px;
}

.header {
	margin: 0;
	font-size: 50px;
	font-weight: bold;
	color: white;
}

.sub-text {
	font-size: 25px;
	color: white;
}

.content-container {
	background-color: #a200d6;
}

.cta-button {
	height: 45px;
	border: 0;
	width: auto;
	padding-left: 40px;
	padding-right: 40px;
	border-radius: 5px;
	cursor: pointer;
	font-size: 16px;
	font-weight: bold;
	color: white;
}

.connect-wallet-container {
	display: flex;
	flex-direction: column;
	margin: auto;
	max-width: 550px;
}

.connect-wallet-container img {
	padding-bottom: 20px;
}

.connect-wallet-button {
	background-image: linear-gradient(
		to right,
		#ff8177 0%,
		#ff867a 0%,
		#ff8c7f 21%,
		#f99185 52%,
		#cf556c 78%,
		#b12a5b 100%
	);
	background-size: 200% 200%;
	animation: gradient-animation 4s ease infinite;
}

.mint-button {
	background: -webkit-linear-gradient(left, #a200d6, #ff6fdf);
	background-size: 200% 200%;
	animation: gradient-animation 4s ease infinite;
	margin-right: 15px;
}

.opensea-button {
	background-color: rgb(32, 129, 226);
}

.mint-count {
	color: white;
	font-size: 18px;
	font-weight: bold;
}

.footer-container {
	display: flex;
	justify-content: center;
	align-items: center;
	padding-bottom: 30px;
}

.twitter-logo {
	width: 35px;
	height: 35px;
}

.footer-text {
	color: white;
	font-size: 16px;
	font-weight: bold;
}

/* KeyFrames */
@-webkit-keyframes gradient-animation {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}
@-moz-keyframes gradient-animation {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}
@keyframes gradient-animation {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}
</style>
