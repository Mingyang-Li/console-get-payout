import { ApiPromise, WsProvider } from '@polkadot/api';
import {ActiveEraInfo, Balance, EraIndex, Exposure } from "@polkadot/types/interfaces";
import {Option} from "@polkadot/types";

async function main () {
  const wsProvider = new WsProvider('wss://rpc.polkadot.io');
  const api = await ApiPromise.create({provider: wsProvider});
  // console.log(api.events.staking.EraPayout.meta.size.valueOf());
  // console.log(api.events.staking.EraPayout.meta.toHuman());
  // console.log(api.events.staking.EraPayout.meta.hash.registry);
  // const payoutData = (await api.query.system.account(blockHash)).consumers.toHuman()
  // const payoutData = await api.rpc.state.queryStorage.toString()
  const era = 387;
  const blockHeight = 0;

  //get active era number
  const [activeEra] = await api.queryMulti<[Option<ActiveEraInfo>, Option<EraIndex>]>([
    api.query.staking.activeEra,
]);

  if (activeEra.isEmpty) return;
  const validators = await api.query.session.validators();
  const exposureInfos = await api.query.staking.erasStakers.multi<Exposure>(
    validators.map(validator => [activeEra.unwrap().index, validator])
  );
  console.table(exposureInfos);
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});