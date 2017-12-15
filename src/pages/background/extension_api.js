/*
return array of objects like {url: '', title: ''}
 */
export const getTopSites = () => {
  return new Promise((resolve, reject) => {
    browser.topSites.get((sites) => {
      resolve(sites);
    });
  });
};