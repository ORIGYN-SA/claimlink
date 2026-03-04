import { Buffer } from "buffer";
import type { Neuron, DissolveState } from "../../interfaces/ogy";
import {
  formatTimestampToYearsDifference,
  getCurrentTimestampSeconds,
  formatTimestampToYears,
} from "@shared/utils/dates";

import { divideBy1e8, roundAndFormatLocale } from "@shared/utils/numbers";

export const getIsDissolving = (dissolveState: DissolveState) => {
  if (
    "DissolveDelaySeconds" in dissolveState &&
    "WhenDissolvedTimestampSeconds" in dissolveState &&
    dissolveState.DissolveDelaySeconds !== undefined &&
    Number(dissolveState.DissolveDelaySeconds) !== 0
  )
    return false;
  return true;
};

export const parseNeuronsOGY = (neurons: Array<Neuron>) => {
  const currentTimestampSeconds = getCurrentTimestampSeconds();

  const data = neurons.map((neuron) => {
    const dissolveState = Array.isArray(neuron.dissolve_state)
      ? neuron.dissolve_state[0]
      : neuron.dissolve_state;

    const stakedMaturityEquivalent = Array.isArray(
      neuron.staked_maturity_e8s_equivalent
    )
      ? neuron.staked_maturity_e8s_equivalent[0]
      : neuron.staked_maturity_e8s_equivalent;

    const id = Array.isArray(neuron.id) && neuron.id[0]
      ? Buffer.from(neuron.id[0].id).toString("hex")
      : neuron.id;

    let dissolve_delay = "0 years";
    let dissolving = false;

    if (dissolveState) {
      dissolving = getIsDissolving(dissolveState);

      if (dissolving && "DissolveDelaySeconds" in dissolveState) {
        dissolve_delay = formatTimestampToYearsDifference(
          currentTimestampSeconds + Number(dissolveState.DissolveDelaySeconds)
        );
      } else if (!dissolving && "WhenDissolvedTimestampSeconds" in dissolveState) {
        dissolve_delay = formatTimestampToYears(
          Number(dissolveState.WhenDissolvedTimestampSeconds) -
            currentTimestampSeconds
        );
      }
    }

    const staked_amount = divideBy1e8(
      Number(neuron.cached_neuron_stake_e8s || 0)
    );
    const staked_maturity = divideBy1e8(
      Number(stakedMaturityEquivalent != null ? stakedMaturityEquivalent : 0)
    );

    return {
      id,
      dissolving,
      dissolve_delay,
      staked_amount,
      staked_maturity,
      // eslint-disable-next-line
    } as any;
  });

  const totalStakedAmount = data.reduce(
    (acc, cur) => acc + cur.staked_amount,
    0
  );
  return {
    totalStakedAmount: {
      number: totalStakedAmount,
      string: roundAndFormatLocale({ number: totalStakedAmount }),
    },
    neurons: data,
  };
};
