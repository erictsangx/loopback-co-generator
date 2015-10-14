interface IRemoteMethodConfig {
    accepts: {arg: string; type: string; http?: {source: string}};
    returns: {arg: string; type: string};
    http: {path: string; verb: string};
}

interface IModel {
    create(obj: IPeople[]): void;
    findById(id: number, cb: Function): void;
    findById(id: number): IPeople;
    getFriend(id: number, cb: Function): void;
    remoteMethod(url: string, config: IRemoteMethodConfig): void;
}

interface IPeople {
    id: number;
    name: string;
    fid: number;
}
