import axios from "axios";

const basic_get = (url, params) => {
  return axios.get(url, {params: params})
      .then(response => {
        return response.data;
      })
      .catch(err => {
        throw err;
      });
};

const basic_post = (url, params) => {
  return axios.post(url, params)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        throw err.response.data;
      });
};

const api = {
  getUserInformation: () => {
    return basic_get('/api/v1/common/GetMyInformation');
  },
  getProfiles: () => {
    return basic_get('/api/rest/GetProfilesAndApps');
  },
  getAppConnectionInformation: ({app_id}) => {
    return basic_get('/api/v1/dashboard/GetConnection', {
      app_id: app_id
    });
  },
  getClearbitLogo: ({hostname}) => {
    const src = "https://logo.clearbit.com/" + hostname;
    console.log('clearbit call', src);
    return axios.get(src).then(response => {
      return src;
    }).catch(err => {
      throw err.response.data;
    })
  },
  dashboard: {
    getApp: ({app_id}) => {
      return basic_get('/api/v1/dashboard/GetApp', {
        app_id: app_id
      });
    },
    getAppPassword: ({app_id}) => {
     return basic_get('/api/v1/dashboard/GetAppPassword', {
       app_id: app_id
     }).then(response => {
       return decipher(response.password);
     });
    }
  },
  catalog: {
    getWebsites: () => {
      return basic_get('/api/v1/catalog/GetWebsites');
    },
    getWebsiteConnection: ({website_id}) => {
      return basic_get('/api/v1/catalog/GetWebsiteConnection', {
        website_id: website_id
      });
    }
  },
  updates: {
    send: ({url, account_information}) => {
      return basic_post('/api/v1/updates', {
        url: url,
        account_information: account_information
      });
    }
  }
};

export default api;