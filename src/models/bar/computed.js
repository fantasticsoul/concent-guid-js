import { defComputed } from 'concent';

/**
 * @param {*} param0 
 * @return {string}
 */
export function firstNameSecretAward({firstNameSecretAward:newVal}){
  return newVal.join(',');
}

export const fullName = {
  fn:(newState)=>{
     // any key of ['firstName', 'lastName'] value changed will trigger this computed function
    return `${newState.firstName}_${newState.lastName}`;
  },
  // with dependency collection in concent v2, you needn't pass depKeys explicitly
  // depKeys: ['firstName', 'lastName'],
}

// 2rd writing way
export const fullName2 = defComputed((newState)=>{
  return `${newState.firstName}_${newState.lastName}`;
})