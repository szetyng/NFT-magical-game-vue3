import { BigNumber } from "@ethersproject/bignumber";

interface keyable {
	[key: string]: any
}

interface CharacterNFT {
	name: string,
	imageURI: string,
	hp: BigNumber,
	maxHp: BigNumber,
	attackDamage: BigNumber
}

export type { CharacterNFT, keyable }