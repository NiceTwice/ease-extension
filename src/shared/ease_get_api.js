import axios from "axios";

const basic_get = (url, params) => {
  return axios.get(url, {params: params})
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
  catalog: {
    getWebsites: () => {
      return basic_get('/api/v1/catalog/GetWebsites');
    }
  }
};

export default api;