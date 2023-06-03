import { AppDataSource } from './data-source';
import { Campaign } from './entity/Campaign';
import { Client } from 'discord.js';

interface Callback {
    (client: Client): any
}

class CampaignController {
    private campaignRepo = AppDataSource.getRepository(Campaign);
    private nameCache: string[] = []

    private callbacks: Callback[] = []

    public onCampaignChange(callback: Callback) {
        this.callbacks.push(callback)
    }

    private async campaignChangeEvent(client: Client) {
        await Promise.all(this.callbacks.map(callback => Promise.resolve(callback(client))))
    }

    public initCache(client: Client) {
        this.campaignRepo.find().then(data => {
            this.nameCache = data.map(datum => datum.name)
            if(!data.find(datum => datum.active)) {
                this.oneShot(false, client).then()
            } else {
                this.campaignChangeEvent(client).then()
            }
        })
    }

    public async getActive(client: Client): Promise<Campaign> {
        const repo = await this.campaignRepo.findOneBy({active: true})
        if(repo) return repo
        await this.oneShot(false, client)
        return await this.campaignRepo.findOneBy({active: true}) as Campaign
    }

    public async addCampaign(name: string, client: Client): Promise<boolean> {
        if(await this.campaignRepo.findOneBy({
            name: name
        })) {
            return false
        }
        const campaign = new Campaign();
        campaign.name = name
        campaign.active = true

        const lastActive= await this.campaignRepo.findOneBy({active: true})
        const toSave = [campaign]
        if(lastActive) {
            lastActive.active = false
            toSave.push(lastActive)
        }
        await this.campaignRepo.save(toSave);
        this.nameCache.push(name)
        await this.campaignChangeEvent(client)
        return true
    }

    public async deleteCampaign(name: string, client: Client, replace: boolean = true): Promise<boolean> {
        const campaign = await this.campaignRepo.findOneBy({ name: name })
        if(!campaign) return false
        await this.campaignRepo.remove(campaign)
        this.nameCache.splice(this.nameCache.indexOf(name), 1)
        if(replace) {
            await this.oneShot(false, client)
        } else {
            await this.campaignChangeEvent(client)
        }
        return true
    }

    public async selectCampaign(name: string, client: Client): Promise<string | null> {
        const [prev, next] = await Promise.all([await this.campaignRepo.findOneBy({active: true}), this.campaignRepo.findOneBy({name: name})])
        if(!next) return `Cannot find campaign ${name}`
        if(next.active) return `${name} is already the selected campaign`
        next.active = true
        const toSave = [next]
        if(prev) {
            prev.active = false
            toSave.push(prev)
        }
        await this.campaignRepo.save(toSave)
        await this.campaignChangeEvent(client)
        return null
    }

    public async oneShot(clear: boolean, client: Client): Promise<void> {
        if(clear) {
            await this.deleteCampaign("<ONE SHOT>", client, false)
            await this.addCampaign("<ONE SHOT>", client)
        } else {
            console.log("Looking for one shot")
            const oneshot= await this.campaignRepo.findOneBy({name: "<ONE SHOT>"})
            console.log(`Oneshot is ${!!oneshot}`)
            if(oneshot) {
                console.log(`Oneshot is active? ${oneshot.active}`)
                if(oneshot.active) return
                console.log(`Selecting oneshot`)
                await this.selectCampaign("<ONE SHOT>", client)
            } else {
                console.log(`Creating oneshot`)
                await this.addCampaign("<ONE SHOT>", client)
            }
        }
    }

    public getNames(filter: string = "", limit: number = -1): string[] {
        return this.nameCache.filter((value, i) => value.startsWith(filter) && (limit == -1 || i < limit) && value !== "<ONE SHOT>")
    }

}
const campaignController = new CampaignController();
export default campaignController;
