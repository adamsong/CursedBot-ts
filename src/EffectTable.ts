import * as fs from 'fs';

export class EffectTable {
    private static _instance: EffectTable;
    private readonly table: string[];

    private constructor() {
        let fileContent = fs.readFileSync("table.csv", 'utf8');
        let table: string[] = [];
        for(let line of fileContent.split("\n")) {
            let data = line.split(/,(.*)/);
            table[+data[0]] = data[1];
        }
        this.table = table;
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    public translate(id: number): string {
        return this.table[id];
    }
}
