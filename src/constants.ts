import { CharacterNFT } from "./types/character";

const CONTRACT_ADDRESS: string = '0x1D33fc00b70AE9ab5B338CBeEA9f660122Cfb69b';


const transformCharacterData = (characterData: CharacterNFT) => {
	return {
		name: characterData.name,
		imageURI: characterData.imageURI,
		hp: characterData.hp.toNumber(),
		maxHp: characterData.maxHp.toNumber(),
		attackDamage: characterData.attackDamage.toNumber(),
	};
};
export { CONTRACT_ADDRESS, transformCharacterData };