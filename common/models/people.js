"use strict";
const co = require("co");
const thunkify = require("thunkify");
module.exports = (PeopleModel) => {
    const find = (id) => {
        return new Promise((resolve, reject) => {
            PeopleModel.findById(id, (err, instance) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(instance);
                }
            });
        });
    };
    PeopleModel.findById = thunkify(PeopleModel.findById);
    PeopleModel.create = thunkify(PeopleModel.create);
    PeopleModel.getFriend = (id, cb) => {
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
        co(function* () {
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
            const targetOfPromise = yield find(id);
            const friendOfPromise = yield find(targetOfPromise.fid);
            console.info(targetOfPromise, friendOfPromise);
            const target = yield PeopleModel.findById(id);
            const friend = yield PeopleModel.findById(target.fid);
            cb(null, friend);
        }).catch((error) => {
            cb(null, error);
        });
    };
    PeopleModel.remoteMethod("getFriend", {
        http: { path: "/getFriend", verb: "get" },
        accepts: { arg: "id", type: "number", http: { source: "query" } },
        returns: { arg: "name", type: "string" }
    });
};
//# sourceMappingURL=people.js.map