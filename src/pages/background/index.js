import "./shortcut";
import Storage from "../../shared/storage_api";

const storage = {
  settings: {
    homepage: false
  }
};
const calls = [
    Storage.local.set(storage)
];


Promise.all(calls).then(response => {
  Storage.local.get(null).then(storage => {
    console.log(storage);
  });
  Storage.local.getBytesInUse(null).then(bytes => {
    console.log('bytes in use :', bytes);
  });
});