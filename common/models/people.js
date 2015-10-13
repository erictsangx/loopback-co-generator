"use strict";
const co = require("co");
const thunkify = require("thunkify");

module.exports = (People) => {

    /*
     traditional callback hell
     */
    //People.findById(id, (err, instance)=> {
    //    if (err) {
    //        throw err;
    //    }
    //    else {
    //        People.findById(instance.fid, (err, instance)=> {
    //            if (err) {
    //                throw err;
    //            }
    //            else {
    //                cb(null, instance);
    //            }
    //        });
    //    }
    //});

    /*
     thunkify
     */
    People.findById = thunkify(People.findById);
    People.create = thunkify(People.create);

    /*
     ES6 Promise
     */
    const find = (id)=> {
        return new Promise((resolve, reject)=> {
            People.findById(id, (err, instance) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(instance);
                }
            });
        });
    };

    People.getFriend = (id, cb) => {
        co(function*() {
            //create test data
            yield People.create([
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

            //with promise
            const targetOfPromise = yield find(id);
            const friendOfPromise = yield find(targetOfPromise.fid);
            console.info(targetOfPromise, friendOfPromise);

            //with thunkify
            const target = yield People.findById(id);
            const friend = yield People.findById(target.fid);

            cb(null, friend);
        }).catch((error) => {
            cb(null, error);
        });

    };

    People.remoteMethod(
        "getFriend",
        {
            http: {path: "/getFriend", verb: "get"},
            accepts: {arg: "id", type: "number", http: {source: "query"}},
            returns: {arg: "name", type: "string"}
        }
    );
};
