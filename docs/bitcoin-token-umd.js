!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("bitcoinsource"),require("axios")):"function"==typeof define&&define.amd?define(["exports","bitcoinsource","axios"],e):e((t["bitcoin-token-umd"]=t["bitcoin-token-umd"]||{},t["bitcoin-token-umd"].js={}),t.BitcoinSource,t.axios)}(this,function(t,e,n){"use strict";e=e&&e.hasOwnProperty("default")?e.default:e,n=n&&n.hasOwnProperty("default")?n.default:n;var s={BITCOIN_NETWORK:"testnet",BLOCK_EXPLORER_URL:"https://tbch.blockdozer.com/api",MIN_SATOSHI_AMOUNT:546,MIN_NON_DUST_AMOUNT:2750,UN_P2SH_URL:"http://localhost:3000",DEFAULT_FEE:2e3};e.versionGuard=(()=>!0),e.Networks.defaultNetwork=e.Networks[s.BITCOIN_NETWORK];class r{constructor(t){this.kind=t}toJSON(){return{}}}class a extends Error{constructor(t,e,...n){super(...n),this.name="Error",this.message=t+(e?`: ${e}`:""),Error.captureStackTrace&&Error.captureStackTrace(this,a)}}function i(t){return{writable:!0,value:t}}function o(t){return Buffer.from(t)}function u(t){return t.toString()}function c(t,e,{[t]:n,...s}){return{[e]:n,...s}}const d=async t=>{try{return(await t).data}catch(t){if(t.response){const{status:e,statusText:n,data:s}=t.response,{method:r,url:i}=t.response.config||{method:"unknown",url:"unknown"},o=t.response.config.data,u=s.error||(-1!==s.indexOf("Code:")?s:n);throw new a(`\nCommunication Error\n\nstatus\t${e} ${n}\nmessage\t${u}\nrequest\t${r} ${i}${o?`\ndata\t${o}`:""}`)}throw new a("Communication error","Service unavailable.")}},h=async(t,e=s.BLOCK_EXPLORER_URL)=>d(n.get(`${e}${t}`)),p=async(t,e,r=s.BLOCK_EXPLORER_URL)=>d(n.post(`${r}${t}`,e)),l=async t=>{const{balanceSat:e,unconfirmedBalanceSat:n}=await(async t=>h(`/addr/${t.toString()}`))(t);return e+n},m=async t=>{return c("txid","txId",await p("/tx/send",{rawtx:t.toString()}))},w=async t=>{return(await h(`/rawtx/${t}`)).rawtx},g=async t=>{const e=t.toString();return(t=>t.filter((t,e,n)=>n.findIndex(e=>e.txId===t.txId&&e.vout===t.vout)===e))((await h(`/addr/${e}/utxo`)).map(t=>c("txid","txId",t))).map(t=>(t.spent=!1,t))},f=async t=>{const e=await(async t=>h(`/tx/${t}`))(t.txId),n=e.vout[t.outputNumber],s=n.scriptPubKey.addresses[0],{txId:r}=t,a=t.outputNumber,i=parseFloat(n.value),o=1e8*i,u=e.blockheight,{confirmations:c}=e,d=!!n.spentTxId;return{address:s,txId:r,vout:a,scriptPubKey:n.scriptPubKey.hex,amount:i,satoshis:o,height:u,confirmations:c,spent:d}},y=async t=>p("/",t,s.UN_P2SH_URL),S=async t=>h(`/un-p2sh/${t}`,s.UN_P2SH_URL),b=async t=>h(`/txos/${t}`,s.UN_P2SH_URL),O=async(t,e)=>p("/txos/set-spent/",{txId:t,vOut:e},s.UN_P2SH_URL),{PublicKey:P,Transaction:x}=e;class I extends r{constructor(t,e,n){super("script"),this.publicKeys=e||[],this.data=t||[],this.amount=n||s.MIN_NON_DUST_AMOUNT}getData(t){return this.data[t]}getSerializeData(){return Object.entries(this.data).reduce((t,e)=>t.concat(e),[]).map(o)}setSerializedData(t){const e=t.map(u),n={};for(let t=0;t<e.length;t+=2)n[e[t]]=e[t+1];this.data=n}static fromMultiSigScriptHashInput(t){const e=t.redeemScript||A.redeemScriptFromP2shScript(A.fromBuffer(t._scriptBuffer));return this.fromRedeemScript(e)}static fromRedeemScript(t){const e=new this({},t.getPublicKeys().map(t=>new P(t)),s.MIN_SATOSHI_AMOUNT),{chunks:n}=t,r=n.slice(4,n.length).filter((t,e)=>e%2==0).map(t=>t.buf);return e.setSerializedData(r),e}toJSON(){return{kind:"script",data:this.data,publicKeys:this.publicKeys.map(t=>t.toString()),amount:this.amount}}static isJSON(t){return t.data&&t.publicKeys&&t.amount}static fromJSON(t){const e=t.publicKeys.map(t=>new P(t));return new this(t.data,e,t.amount)}}const{PublicKey:D,Address:K,Transaction:N}=e;class k extends r{constructor(t,e){super("pkh"),this.address=t,this.amount=e}static fromPublicKeyHashInput(t){const{output:e}=t;return new this(e.script.toAddress(),e.satoshis)}toJSON(){return{kind:"pkh",address:this.address.toString(),amount:this.amount}}static isJSON(t){return t.address&&t.amount}static fromJSON(t){return new this(new K(t.address),t.amount)}}class _ extends r{constructor(t){super("return"),this.data=t||""}getData(){return this.data}toJSON(){return{kind:"return",data:this.data}}static isJSON(t){return!!t.data}static fromJSON(t){return new this(t.data)}}const{Address:M,PublicKey:T,Signature:v,Script:E,Opcode:U}=e;class A extends E{static outputScriptFromScriptOutputData(t){const{publicKeys:e}=t,n=t.getSerializeData(),s=new A;return s.add("OP_1"),e.forEach(t=>s.add(t.toBuffer())),s.add(`OP_${e.length}`),s.add("OP_CHECKMULTISIG"),n.forEach(t=>s.add(t).add("OP_DROP")),s}getPublicKeys(){let t=1;const e=[];for(;this.chunks[t].buf;)e.push(new T(this.chunks[t].buf)),t+=1;return e}static inputScriptFromScriptOutputData(t,e,n,s){const r=new A;return n.forEach(t=>{r.add(t)}),r.add(s),r}isDbDataScript(){return!(!(this.chunks.length>=5&&this.chunks[0].opcodenum===U.OP_1&&this.chunks[1].buf)||20!==this.chunks[1].buf.length&&33!==this.chunks[1].buf.length||this.chunks[2].opcodenum!==U.OP_1||this.chunks[3].opcodenum!==U.OP_CHECKMULTISIG||!this.chunks[4].buf||this.chunks[5].opcodenum!==U.OP_DROP)}static isP2shScript(t){return!(3!==t.chunks.length||t.chunks[0].opcodenum!==U.OP_0||!t.chunks[1].buf||!t.chunks[2].buf)}static redeemScriptFromP2shScript(t){if(!this.isP2shScript(t))throw new Error("not a p2sh script");const e=new E(t.chunks[2].buf),n=new A;return n.chunks=e.chunks,n}toOutputData(t=s.MIN_SATOSHI_AMOUNT){if(this.isDbDataScript()){const t=new I({},[new T(this.chunks[1].buf)],s.MIN_SATOSHI_AMOUNT),e=this.chunks.slice(4,this.chunks.length).filter((t,e)=>e%2==0).map(t=>t.buf);return t.setSerializedData(e),t}if(this.isPublicKeyHashOut()){const e=new M(this.getData());return new k(e,t)}if(this.isDataOut())return new _(this.getData().toString());throw new Error("unknown script type")}}const{PublicKey:H,Address:R}=e;class J extends r{constructor(t){super("change"),this.address=t}toJSON(){return{kind:"change",address:this.address.toString()}}static isJSON(t){return t.address}static fromJSON(t){return new this(new R(t.address))}}class ${static fromJSON(t){if(I.isJSON(t))return I.fromJSON(t);if(k.isJSON(t))return k.fromJSON(t);if(J.isJSON(t))return J.fromJSON(t);if(_.isJSON(t))return _.fromJSON(t);throw new Error(`unrecognized json ${JSON.stringify(t)}`)}}const{Transaction:W,PublicKey:F,Address:B,BN:L,Script:C,encoding:j}=e,{Output:z,Input:q}=W,{MultiSigScriptHash:G}=q,{BufferReader:V}=j;class X extends W{constructor(t){super(t),this._outputData=[],Object.defineProperty(this,"to",i(this._to)),Object.defineProperty(this,"from",i(this._from))}get dataInputs(){return this.inputs.map(t=>{if("MultiSigScriptHashInput"===t.constructor.name)return I.fromMultiSigScriptHashInput(t);if("PublicKeyHashInput"===t.constructor.name)return k.fromPublicKeyHashInput(t);if("Input"===t.constructor.name){const e=new C(t._scriptBuffer),n=new A;if(n.chunks=e.chunks,n.isPublicKeyHashIn())return new k(n.toAddress(),0);if(A.isP2shScript(n)){const t=A.redeemScriptFromP2shScript(n);return I.fromRedeemScript(t)}}throw new Error(`unknown script class ${t.constructor.name}`)})}set dataInputs(t){throw Error("dataTransaction.dataInputs cannot be set directly, use dataTransaction.from or dataTransaction.fromScriptOutput")}get inputsWithData(){return this.inputs.filter((t,e)=>"ScriptOutputData"===this.dataInputs[e].constructor.name)}fromMultiSig(t,e,n){const s=t.map(t=>c("txId","txid",t));return super.from(s,e,n)}_from(t){const e=c("txId","txid",t);return super.from(e)}fromScriptOutput(t,e){const n=A.outputScriptFromScriptOutputData(e),s=new G({output:new z({script:new A(t.scriptPubKey),satoshis:Math.round(t.satoshis)}),prevTxId:t.txId,outputIndex:t.vout,script:new A},e.publicKeys,1,null,n);return this.addInput(s),this}get outputData(){if(!this._outputData.length)throw new Error("dataTransaction.outputData is not initialized. Call dataTransaction.fetchDataOuptuts() first.");return this._outputData}set outputData(t){throw Error("dataTransaction.dataInputs cannot be set directly, use dataTransaction.toOutputData")}get outputsWithData(){return this.outputs.filter((t,e)=>"ScriptOutputData"===this.outputData[e].constructor.name)}change(t){const e=this.outputs.length;return super.change(t),this.outputs.length>e&&this._outputData.push(new J(t)),this}toChangeOutput(t){const e=this.outputs.length;return super.change(t.address),this.outputs.length>e&&this._outputData.push(t),this}toPkhOutput(t){return super.to(t.address,t.amount),this._outputData.push(t),this}toScriptOutput(t){const e=A.outputScriptFromScriptOutputData(t),n=A.buildScriptHashOut(e),s=new z({script:n,satoshis:t.amount});return this.addOutput(s),this._outputData.push(t),this}toReturnOutput(t){return this.addData(t.data),this._outputData.push(t),this}_to(t){switch(t.constructor.name){case"ChangeOutputData":return this.toChangeOutput(t);case"ReturnOutputData":return this.toReturnOutput(t);case"ScriptOutputData":return this.toScriptOutput(t);case"PkhOutputData":return this.toPkhOutput(t);default:throw new Error("Unsupported output kind")}}async fetchOutputData(){if(this._outputData.length)return this._outputData;const t=this.getTxId(),e=await S(t);return this._outputData=e.map($.fromJSON),this._outputData}getTxId(){return new V(this._getHash()).readReverse().toString("hex")}static async fromTxId(t){const e=await w(t),n=new X;return await n.fromString(e),n}}const{Mnemonic:Q,HDPrivateKey:Y,PrivateKey:Z,PublicKey:tt,Address:et}=e;class nt{constructor(t){this.mnemonic=t||new Q,this.path="",this.hdPrivateKey=this.mnemonic.toHDPrivateKey(this.path,s.BITCOIN_NETWORK)}static getRandomMnemonic(){return(new Q).toString()}static fromMnemonic(t){return new nt(t)}getMnemonic(){return this.mnemonic}getPath(){return this.path}derive(t=0,e=!1){const n=new nt(this.mnemonic);return n.path=`${this.path}${this.path.length?"/":""}${t}${e?"'":""}`,n.hdPrivateKey=this.hdPrivateKey.derive(t,e),n}static getHdPrivateKey(){return new Y}getPrivateKey(){return this.hdPrivateKey.privateKey}getPublicKey(){return this.hdPrivateKey.publicKey}getAddress(){return this.address=this.address||this.getPublicKey().toAddress(),this.address}async getBalance(){const t=this.getAddress();return l(t.toString())}async getUtxosFromAddress(t,e){const n=await g(t.toString());for(let t=n.length-1;t>0;t-=1){const e=Math.floor(Math.random()*(t+1)),s=n[t];n[t]=n[e],n[e]=s}let s=0;const r=[];let a=0;for(;s<e&&a<n.length;)r.push(n[a]),s+=n[a].satoshis,a+=1;if(s<e)throw new Error(`Insufficient balance in address ${t.toString()}`);return r}async getUtxos(t){const e=this.getAddress();return this.getUtxosFromAddress(e,t)}async getTokenUtxos(){const t=this.getPublicKey(),e=await b(t.toString());return Promise.all(e.map(async t=>{const e=await X.fromTxId(t.txId),n=(await e.fetchOutputData())[t.vOut];if(n){const s=A.outputScriptFromScriptOutputData(n),r=A.buildScriptHashOut(s),a=e.outputs[t.vOut].satoshis;return{txId:t.txId,vout:t.vOut,scriptPubKey:r,amount:Math.round(a/1e8),satoshis:a,amountSat:a,outputData:n}}return null}))}async sendTransaction(t,e=!1){const{txId:n}=await m(t);if(e){const e=JSON.stringify(t.outputData.map(t=>t.toJSON()));await y({txId:n,outputData:e})}return{txId:n}}async send(t,e){const n=new X,r=e||this.getAddress(),a=s.DEFAULT_FEE,i=this.getPrivateKey(),o=t.reduce((t,e)=>t+parseInt(e.amount||0,10),0);return(await this.getUtxos(o+a)).forEach(n.from.bind(n)),t.forEach(n.to.bind(n)),n.change(r),n.sign(i),this.sendTransaction(n)}async sendAll(t){const e=await this.getBalance(),n=s.DEFAULT_FEE;if(e>n){const s=new k(t,e-n);return this.send([s])}throw new Error("Insufficient funds to send payment.")}}class st{constructor(t){this.wallet=t||new nt}static fromMnemonic(t){return new this(new nt(t))}async put(t){return this.update([],t)}async get(t){return Promise.all(t.map(async({txId:t,outputNumber:e})=>{const n=await X.fromTxId(t);return await n.fetchOutputData(),n.outputData[e]}))}async update(t,e){const n=new X;await Promise.all(t.map(async t=>{const e=await f(t),s=await S(e.txId),r=I.fromJSON(s[e.vout]);n.fromScriptOutput(e,r),await O(e.txId,e.vout)})),(await this.wallet.getUtxos(s.DEFAULT_FEE+e.length*s.MIN_NON_DUST_AMOUNT)).forEach(n.from.bind(n)),e.forEach(n.to.bind(n)),n.change(this.wallet.getAddress()),n.sign(this.wallet.getPrivateKey());const{txId:r}=await this.wallet.sendTransaction(n,!0);return[...Array(e.length).keys()].map(t=>({txId:r,outputNumber:t}))}}class rt{constructor(t){this.db=t||new st}static fromMnemonic(t){return new this(st.fromMnemonic(t))}async init(t){const e=Object.getPrototypeOf(async()=>{}).constructor;Object.entries(t).forEach(([t,n])=>{this[t]=new e(`"use strict"; return ${n}`).bind(this)()})}async create(t){const e=new I(t,[this.db.wallet.getPublicKey()]);return this.id=(await this.db.put([e]))[0],this.id}join(t){this.id=t}async getTokenUtxos(){const t=this.db.wallet.getPublicKey(),e=await b(t.toString()),n=(await Promise.all(e.map(async t=>{const e=await X.fromTxId(t.txId);return await e.fetchOutputData(),Object.assign({transaction:e},t)}))).filter(t=>t.transaction.outputData[t.vOut]),s=await((t,e)=>Promise.all(t.map(t=>e(t))).then(e=>t.filter(t=>e.shift())))(n,(async t=>this.isValid(t.transaction.hash)).bind(this));return Promise.all(s.map(async t=>{const e=t.transaction.outputData[t.vOut],n=A.outputScriptFromScriptOutputData(e),s=A.buildScriptHashOut(n),r=t.transaction.outputs[t.vOut].satoshis;return{txId:t.txId,vout:t.vOut,scriptPubKey:s,amount:Math.round(r/1e8),satoshis:r,amountSat:r,outputData:e}}))}async send(t,e){const n=await this.getTokenUtxos();let s=0;const r=n.filter(async e=>{const n=s<t,{txId:r,vout:a,outputData:i}=e,{balance:o}=i.data;return s+=o?parseInt(o,10):0,await O(r,a),n}).map(t=>({txId:t.txId,outputNumber:t.vout}));if(s<t)throw new Error("Insufficient token funds");const a=new I({balance:t.toString(10)},[e]),i=s-t,o=this.db.wallet.getPublicKey(),u=new I({balance:i.toString(10)},[o]);return this.db.update(r,[a,u])}async getBalance(){const t=await this.getTokenUtxos();return(await Promise.all(t.map(async t=>{const e=await S(t.txId),{publicKeys:n,data:s}=e[t.vout],r=new I(s,n).getData("balance");return r?parseInt(r,10):0}))).reduce((t,e)=>t+e,0)}async isValid(t){const e=await X.fromTxId(t);return await e.fetchOutputData(),this.isIssuance(e)?this.id.txId===e.getTxId():!!this.isTransfer(e)&&Promise.all(e.inputsWithData.map(async t=>this.isValid(t.prevTxId.toString("hex")))).then(t=>t.every(t=>t))}isIssuance(t){return 0===t.inputsWithData.length&&1===t.outputsWithData.length}isTransfer(t){return t.inputsWithData.length>=1}}const{Mnemonic:at}=e;class it{constructor(t){const e=t?new at(t):new at;this.wallet=new nt(e)}static getRandomMnemonic(){return nt.getRandomMnemonic().toString()}static fromMnemonic(t){return new this(t)}getMnemonic(){return this.wallet.getMnemonic().toString()}getPath(){return this.wallet.path}getPrivateKey(){return this.wallet.getPrivateKey().toString()}getPublicKey(){return this.wallet.getPublicKey().toString()}getAddress(t){const e=t||"legacy";if(!["legacy","bitpay","cashaddr"].includes(e))throw new Error("second parameter in wallet.getAddress must be 'legacy', 'bitpay', or 'cashaddr'");return this.wallet.getAddress().toString(e)}async getBalance(){return this.wallet.getBalance()}derive(t=0,e=!1){const n=new it,s=this.wallet.derive(t,e);return n.wallet=s,n}async send(t,e,n){const s=$.fromJSON({amount:t,address:e});return this.wallet.send([s],n)}async transaction(t,e){const n=t.map($.fromJSON);return this.wallet.send(n,e)}static fromHdPrivateKey(){throw new Error("\nwallet.fromHdPrivateKey is not supported anymore. Use wallet.fromMnemonic instead.\n\nFor example:\nconst mnemonic = Wallet.getRandomMnemonic()\nconst wallet = wallet.fromMnemonic(mnemonic)\n    ")}}const{Mnemonic:ot}=e;class ut{constructor(t){this.db=new st(t?t.wallet:null)}static fromMnemonic(t){const e=new ot(t),n=new this;return n.db=st.fromMnemonic(e),n}getWallet(){const t=this.db.wallet.getMnemonic();return it.fromMnemonic(t.toString())}toScriptOutputData(t){return I.fromJSON({kind:"script",publicKeys:t.owners||[this.getWallet().getPublicKey().toString()],data:t.data||{},amount:t.amount||s.MIN_NON_DUST_AMOUNT})}async return(t){const e=new _(t),{txId:n}=await this.db.wallet.send([e]);return{txId:n,outputNumber:0}}async put(t,e,n){const s={data:t,owners:e,amount:n},r=this.toScriptOutputData(s);return(await this.db.put([r]))[0]}async get(t){const e=c("publicKeys","owners",(await this.db.get([t]))[0].toJSON());return delete e.kind,e}async update(t,e,n,r=s.MIN_NON_DUST_AMOUNT){const a={data:e,owners:n,amount:r},i=this.toScriptOutputData(a);return(await this.db.update([t],[i]))[0]}async transaction(t){const e=t.map(t=>t.outputId),n=t.map(this.toScriptOutputData.bind(this));return this.db.update(e,n)}getMnemonic(){throw new Error("db.getMnemonic does not exist. Use db.getWallet().getMnemonic() instead.")}getPrivateKey(){throw new Error("db.getPrivateKey does not exist. Use db.getWallet().getPrivateKey() instead.")}getPublicKey(){throw new Error("db.getPublicKey does not exist. Use db.getWallet().getPublicKey() instead.")}getAddress(){throw new Error("db.getAddress does not exist. Use db.getWallet().getAddress() instead.")}static fromHdPrivateKey(){throw new Error("\ndb.fromHdPrivateKey is not supported anymore. Use db.fromMnemonic instead.\n\nFor example:\nconst mnemonic = Wallet.getRandomMnemonic()\nconst db = Db.fromMnemonic(mnemonic)\n    ")}}const{PublicKey:ct,Mnemonic:dt}=e;t.Token=class{constructor(t){this.token=new rt(t?t.db:null)}static fromMnemonic(t){const e=new dt(t),n=new this;return n.token=rt.fromMnemonic(e),n}getWallet(){const t=this.token.db.wallet.getMnemonic();return it.fromMnemonic(t.toString())}getDb(){const t=this.token.db.wallet.getMnemonic();return ut.fromMnemonic(t.toString())}async create(t){return this.token.create(t)}join(t){return this.token.join(t)}async send(t,e){const n=ct.fromString(e);return this.token.send(t,n)}async getBalance(){return this.token.getBalance()}getMnemonic(){throw new Error("token.getMnemonic does not exist. Use token.getWallet().getMnemonic() instead.")}getPrivateKey(){throw new Error("token.getPrivateKey does not exist. Use token.getWallet().getPrivateKey() instead.")}getPublicKey(){throw new Error("token.getPublicKey does not exist. Use token.getWallet().getPublicKey() instead.")}getAddress(){throw new Error("token.getAddress does not exist. Use token.getWallet().getAddress() instead.")}static fromHdPrivateKey(){throw new Error("\ntoken.fromHdPrivateKey is not supported anymore. Use token.fromMnemonic instead.\n\nFor example:\nconst mnemonic = Wallet.getRandomMnemonic()\nconst token = Token.fromMnemonic(mnemonic)\n    ")}},t.Db=ut,t.Wallet=it,Object.defineProperty(t,"__esModule",{value:!0})});
