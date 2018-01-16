export const showScrapingChromeOverlay = ({tabId}) => {
  return {
    type: 'SHOW_SCRAPING_CHROME_OVERLAY',
    payload: {
      tabId: tabId
    }
  }
};

export const deleteScrapingChromeOverlay = ({tabId}) => {
  return {
    type: 'DELETE_SCRAPING_CHROME_OVERLAY',
    payload: {
      tabId: tabId
    }
  }
};