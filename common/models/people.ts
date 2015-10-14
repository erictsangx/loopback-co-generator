"use strict";

const co = require("co");
const thunkify = require("thunkify");

module.exports = (PeopleModel: IModel) => {

    /*
     ES6 Promise
     */
    const find = (id: number) => {
        return new Promise((resolve: Function, reject: Function)=> {
            PeopleModel.findById(id, (err: Error, instance: IPeople) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(instance);
                }
            });
        });
    };

    /*
     thunkify
     */
    PeopleModel.findById = thunkify(PeopleModel.findById);
    PeopleModel.create = thunkify(PeopleModel.create);

    PeopleModel.getFriend = (id: number, cb: Function) => {

        /*
         traditional callback hell
         */
        //PeopleModel.findById(id, (errA: Error, instanceA: IPeople)=> {
        //    if (errA) {
        //        throw errA;
        //    }
        //    else {
        //        PeopleModel.findById(instanceA.fid, (errB: Error, instanceB: IPeople)=> {
        //            if (errB) {
        //                throw errB;
        //            }
        //            else {
        //                cb(null, instanceB);
        //            }
        //        });
        //    }
        //});

        co(function*(): IterableIterator<any> {
            //create test data
            yield PeopleModel.create([
                {
                    id: 1,
                    name: "Alice",
                    fid: 2
                },
                {
                    id: 2,
                    name: "Eric",
                    fid: 1
                }
            ]);

            ////with promise
            const targetOfPromise = yield find(id);
            const friendOfPromise = yield find(targetOfPromise.fid);
            console.info(targetOfPromise, friendOfPromise);

            ////with thunkify
            const target = yield PeopleModel.findById(id);
            const friend = yield PeopleModel.findById(target.fid);
            cb(null, friend);
        }).catch((error: Error) => {
            cb(null, error);
        });

    };

    PeopleModel.remoteMethod(
        "getFriend",
        {
            http: {path: "/getFriend", verb: "get"},
            accepts: {arg: "id", type: "number", http: {source: "query"}},
            returns: {arg: "name", type: "string"}
        }
    );
};
