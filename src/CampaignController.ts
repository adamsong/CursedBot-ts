import { AppDataSource } from './data-source';
import { Campaign } from './entity/Campaign';

interface Callback {
    (): any
}

class CampaignController {
    private campaignRepo = AppDataSource.getRepository(Campaign);
    private nameCache: string[] = []
    private _hasActive: boolean = false

    private callbacks: Callback[] = []

    public onCampaignChange(callback: Callback) {
        this.callbacks.push(callback)
    }

    private async campaignChangeEvent() {
        await Promise.all(this.callbacks.map(callback => Promise.resolve(callback())))
    }

    public initCache() {
        this.campaignRepo.find().then(data => {
            this.nameCache = data.map(datum => datum.name)
            this._hasActive = !!data.find(datum => datum.active)
            if(this._hasActive) {
                this.campaignChangeEvent().then()
            }
        })
    }

    public hasActive() {
        return this._hasActive;
    }

    public getActive(): Promise<Campaign | null> {
        if(this.hasActive()) {
            return this.campaignRepo.findOneBy({active: true})
        }
        return new Promise((resolve, _) => resolve(null))
    }

    public async addCampaign(name: string): Promise<boolean> {
        if(await this.campaignRepo.findOneBy({
            name: name
        })) {
            return false
        }
        const campaign = new Campaign();
        campaign.name = name
        campaign.active = true

        const lastActive = await this.getActive()
        const toSave = [campaign]
        if(lastActive) {
            lastActive.active = false
            toSave.push(lastActive)
        }
        await this.campaignRepo.save(toSave);
        this.nameCache.push(name)
        this._hasActive = true
        await this.campaignChangeEvent()
        return true
    }

    public async deleteCampaign(name: string): Promise<boolean> {
        const campaign = await this.campaignRepo.findOneBy({ name: name })
        if(!campaign) return false
        await this.campaignRepo.remove(campaign)
        this.nameCache.splice(this.nameCache.indexOf(name), 1)
        this._hasActive = false
        return true
    }

    public async selectCampaign(name: string): Promise<string | null> {
        const [prev, next] = await Promise.all([this.getActive(), this.campaignRepo.findOneBy({name: name})])
        if(!next) return `Cannot find campaign ${name}`
        if(next.active) return `${name} is already the selected campaign`
        next.active = true
        const toSave = [next]
        if(prev) {
            prev.active = false
            toSave.push(prev)
        }
        await this.campaignRepo.save(toSave)
        this._hasActive = true
        await this.campaignChangeEvent()
        return null
    }

    public async clearCampaign(): Promise<void> {
        await this.campaignRepo.update({ active: true }, { active: false })
        this._hasActive = false
        await this.campaignChangeEvent()
    }

    public getNames(filter: string = "", limit: number = -1): string[] {
        return this.nameCache.filter((value, i) => value.startsWith(filter) && (limit == -1 || i < limit))
    }

}
const campaignController = new CampaignController();
export default campaignController;
