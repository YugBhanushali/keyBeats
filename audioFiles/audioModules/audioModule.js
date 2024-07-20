const { alpaca } = require("./alpaca.js");
const { alpsblue } = require("./alpsblue.js");
const { boxnavy } = require("./boxnavy.js");
const { buckling } = require("./buckling.js");
const { cream } = require("./cream.js");
const { holypanda } = require("./holypanda.js");
const { inkblack } = require("./inkblack.js");
const { inkred } = require("./inkred.js");
const { mxblack } = require("./mxblack.js");
const { mxblue } = require("./mxblue.js");
const { mxbrown } = require("./mxbrown.js");
const { topre } = require("./topre.js");
const { turquoise } = require("./turquoise.js");

module.exports.keySounds = [
  cream,
  holypanda,
  alpaca,
  turquoise,
  inkblack,
  inkred,
  mxblack,
  mxbrown,
  mxblue,
  boxnavy,
  buckling,
  alpsblue,
  topre,
];

// import { cream } from './cream';
//
// import('./alpaca').then(alpaca => {keySounds.push(alpaca)});
// import('./alpsblue').then(alpsblue => {keySounds.push(alpsblue)});
// import('./boxnavy').then(boxnavy => {keySounds.push(boxnavy)});
// import('./buckling').then(buckling => {keySounds.push(buckling)});
// // import('./cream').then(cream => {keySounds.push(cream)});
// import('./holypanda').then(holypanda => {keySounds.push(holypanda)});
// import('./inkblack').then(inkblack => {keySounds.push(inkblack)});
// import('./inkred').then(inkred => {keySounds.push(inkred)});
// import('./mxblack').then(mxblack => {keySounds.push(mxblack)});
// import('./mxblue').then(mxblue => {keySounds.push(mxblue)});
// import('./mxbrown').then(mxbrown => {keySounds.push(mxbrown)});
// import('./topre').then(topre => {keySounds.push(topre)});
// import('./turquoise').then(turquoise => {keySounds.push(turquoise)});
//
// export const keySounds = [
//   cream
// ]

// sadly you can't import in the middle of a file
// let audiofolder = "./../../assets/audiofolder";
// let switchfolders = ["holypanda"];
// let switches = ["SPACE", "CTRL", "GENERIC"];
// let keySounds = {};
//
// for (let type in switchfolders) {
//   keySounds[switchfolders[type]] = {
//     press: {},
//     release: {},
//   };
//   for (let item in switches) {
//     import pressSound from `${audiofolder}/${switchfolder}/press/${switches[item]}.mp3`;
//     keySounds[switchfolders[type]].press[switches[item]] = pressSound;
//
//     import releaseSound from `${audiofolder}/${switchfolder}/release/${switches[item]}.mp3`;
//     keySounds.release[switches[item]] = pressSound;
//   }
// }
