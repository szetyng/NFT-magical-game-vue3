<template>
	<div>
		<div class="select-character-container">
			<h2>Mint Your Magical Hero. Choose wisely.</h2>
			<div class="character-grid" v-if="characters.length > 0">
				<!-- renderCharacters -->
				<div
					v-for="character in characters"
					:key="character.name"
					class="character-item"
				>
					<div class="name-container">
						<p>{{ character.name }}</p>
					</div>
					<img :src="character.imageURI" alt="character.name" />
					<button type="button" class="character-mint-button">
						Mint {{ character.name }}
					</button>
				</div>
			</div>

			<div class="loading" v-if="mintingCharacter">
				<div className="indicator">
					<!-- <LoadingIndicator /> -->
					<p>Minting In Progress...</p>
				</div>
				<img
					src="https://assets.teenvogue.com/photos/5720dd41eaac112050c31678/5:2/w_600,h_240,c_limit/harrypotter.gif"
					alt="Minting loading indicator"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watchEffect } from "vue";
import { ethers } from "ethers";

import { CONTRACT_ADDRESS, transformCharacterData } from "../constants";
import { CharacterNFT } from "../types/character";

import myEpicGame from "../utils/MyEpicGame.json";

declare let window: any;

export default defineComponent({
	name: "SelectCharacter",
	setup() {
		let gameContract = ref();
		let characters = ref([]);
		let mintingCharacter = ref(false);

		onMounted(() => {
			console.log("getting game contract");
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const gameContractLocal = new ethers.Contract(
					CONTRACT_ADDRESS,
					myEpicGame.abi,
					signer
				);
				console.log("game contract");
				console.log(gameContractLocal);

				// This is the big difference. Set our gameContract in state.
				gameContract.value = gameContractLocal;
			} else {
				console.log("Ethereum object not found");
			}
		});

		watchEffect(async () => {
			try {
				console.log("Getting contract characters to mint");

				// Call contract to get all mint-able characters
				const charactersTxn =
					await gameContract.value.getAllDefaultCharacters();
				console.log("charactersTxn:", charactersTxn);

				// Go through all of our characters and transform the data
				const charactersLocal = charactersTxn.map(
					(characterData: CharacterNFT) => transformCharacterData(characterData)
				);

				// Set all mint-able characters in state -> will be displayedin template
				characters.value = charactersLocal;
			} catch (error) {
				console.error("Something went wrong fetching characters:", error);
			}
		});

		return {
			characters,
			mintingCharacter,
		};
	},
});
</script>


<style scoped>
.select-character-container {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	color: white;
}

.select-character-container .character-grid {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
	grid-template-rows: repeat(auto-fit, minmax(300px, 1fr));
	grid-row-gap: 15px;
}

.character-grid .character-item {
	display: flex;
	flex-direction: column;
	position: relative;
	justify-self: center;
	align-self: center;
}

.character-item img {
	height: 300px;
	width: 350px;
	border-radius: 10px;
	object-fit: cover;
}

.character-item .name-container {
	position: absolute;
	background-color: #838383;
	border-radius: 5px;
	margin: 10px;
}

.character-item .name-container p {
	margin: 0;
	padding: 5px 10px 5px 10px;
	font-weight: bold;
}

.character-item .character-mint-button {
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 40px;
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	border: none;
	cursor: pointer;
	background-color: rgb(32, 129, 226);
	color: white;
	font-weight: bold;
	font-size: 16px;
}

.select-character-container .loading {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 75px;
}

.select-character-container .loading .indicator {
	display: flex;
}

.select-character-container .loading .indicator p {
	font-weight: bold;
	font-size: 28px;
	padding-left: 5px;
}

.select-character-container .loading img {
	width: 450px;
	padding-top: 25px;
}
</style>