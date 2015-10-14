# loopback-co-generator

This demo project shows how to use co & ES6 generator to avoid javascript callback hell while developing a API server with Database.
<ul>
<li>LoopBack API server</li>
<li>Co, ES6 Generator</li>
<li>Thunkify / ES6 Promise</li>
<li>Typescript</li>
</ul>

###scripts
```javascript
#install dependencies
npm install

#run server
npm start

#browse http://localhost:3000/api/people/getFriend?id=1

#test data
[
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
]
```
