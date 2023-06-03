import rawCardData from './cards.json'
import { AppDataSource } from './data-source';
import { DrawnCard } from './entity/DrawnCard';
import { IsNull } from 'typeorm';
import campaignController from './CampaignController';
import { Campaign } from './entity/Campaign';
import { Client } from 'discord.js';

class CardsManager {
    private readonly cardsData: CardData[] = []
    private drawnCardRepo = AppDataSource.getRepository(DrawnCard)

    constructor() {
        const rcd = rawCardData as RawCardData
        for(let cardId in rcd) {
            this.cardsData.push({
                id: cardId,
                type: rcd[cardId].type === "good" ? CardType.Good : CardType.Bad,
                effect: rcd[cardId].effect,
                drawn: false
            })
        }
        campaignController.onCampaignChange(() => this.updateDrawnCards())
    }

    public async updateDrawnCards(): Promise<void> {
        const drawnCards = await this.drawnCardRepo.find({
            select: {
                cardId: true
            },
            where: {
                campaign: {
                    active: true
                },
                usedAt: IsNull()
            }
        })
        const drawnSet = new Set(drawnCards.map(card => card.cardId))
        this.cardsData.forEach(cardData => cardData.drawn = drawnSet.has(cardData.id))
    }

    public async drawCard(type: CardType, whom: string, client: Client): Promise<CardData> {
        const pickable = this.cardsData.filter(card => card.type === type && !card.drawn)
        const picked = pickable.length ? pickable[Math.floor(Math.random() * pickable.length)] : undefined
        if(!picked) throw "No cards available"
        picked.drawn = true

        const drawnCard = new DrawnCard()
        drawnCard.cardId = picked.id
        drawnCard.campaign = await campaignController.getActive(client) as Campaign
        drawnCard.holder = whom
        await this.drawnCardRepo.save(drawnCard)

        return picked
    }

    public async getCardsFor(whom: string): Promise<CardData[]> {
        const drawnCards = await this.drawnCardRepo.find({
            select: {
                cardId: true
            },
            where: {
                campaign: {
                    active: true
                },
                usedAt: IsNull(),
                holder: whom
            }
        })
        const handSet = new Set(drawnCards.map(card => card.cardId))
        return this.cardsData.filter(card => handSet.has(card.id))
    }

    async useCard(cardId: string, whom: string): Promise<boolean> {
        const card = this.cardsData.find(card => card.id === cardId)
        if(!card) return false
        const drawnCard = await this.drawnCardRepo.findOneBy({
            campaign: {
                active: true
            },
            usedAt: IsNull(),
            holder: whom,
            cardId: cardId
        })
        if(!drawnCard) return false
        await this.drawnCardRepo.update({ id: drawnCard.id }, {usedAt: () => "NOW()"})
        card.drawn = false
        return true
    }
}

interface RawCardData {
    [id: string]: {
        type: string,
        effect: string
    }
}

interface CardData {
    id: string,
    type: CardType,
    effect: string,
    drawn: boolean
}

export enum CardType {
    Good,
    Bad
}

const cardsManager = new CardsManager()
export default cardsManager;
