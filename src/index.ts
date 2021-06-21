import { ApiPromise } from '@polkadot/api';

// initialise via static create
const api = (async () => {
    await ApiPromise.create();
})

// make a call to retrieve the current network head
console.log(typeof api);