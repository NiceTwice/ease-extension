import Runtime from "../../shared/runtime_api";

const api = {
  getTabId: () => {
    return Runtime.sendMessage(null,{type: 'getTabId'}, null);
  }
};

export default api;