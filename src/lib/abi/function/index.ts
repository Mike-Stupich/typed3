import * as abi from 'ethereumjs-abi';
import { makeArgHandlers } from './coders';

import { decodeArguments, decodeReturnValue, encodeArguments } from './coders';

export const FunctionFactory = (
  abiFunc: IAbiFunction,
  outputMappings: IFuncOutputMappings = []
) => {
  const { inputs, outputs, name } = abiFunc;
  const argHandlers = makeArgHandlers(inputs);
  const inputTypes = inputs.map(({ type }) => type);
  const outputTypes = outputs.map(({ type }) => type);
  const inputNames = inputs.map(({ name }) => name);
  const outputNames: string[] = outputs.map(
    ({ name }, i) => outputMappings[i] || name || `${i}`
  );
  const methodSelector = abi.methodID(name, inputTypes).toString('hex');

  const augmentedFunc: IAugmentedAbiFunction = {
    abi: abiFunc,
    argHandlers,
    derived: {
      inputNames,
      inputTypes,
      outputNames,
      outputTypes
    },
    methodSelector
  };

  return {
    decodeArguments: args => decodeArguments(args, augmentedFunc),
    decodeReturnValue: ret => decodeReturnValue(ret, augmentedFunc),
    encodeArguments: args => encodeArguments(args, augmentedFunc)
  };
};