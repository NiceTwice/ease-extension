const connectSimpleAccount = async ({websiteData, current_tab}) => {
  if (websiteData.website.sso === 'Google')
    return connectGoogle({
      websiteData: websiteData,
      current_tab: current_tab
    });
  let count = 0;
  current_connections.forEach(item => {
    if (item === websiteData.website.website_name)
      count++;
  });
  if (count > 1)
    throw 'Connection on this website is already running';
  const websiteName = !!websiteData.website.sso ? websiteData.website.sso : websiteData.website_name;
  const hostname = getUrl(websiteData.website.loginUrl).hostname;

  let checkAlreadyLogged;
  let tab = current_tab;
  await removeHostnameCookies({
    url: websiteData.website.loginUrl
  });
  await setHostnameCookies({
    hostname: hostname,
    url: websiteData.website.loginUrl,
    login: websiteData.user.login
  });
  tab = await TabActions.goto({tabId: tab.id}, {url: websiteData.website.home});
  store.dispatch(InitialiseConnectionOverlay({
    tabId: tab.id,
    websiteName: websiteName
  }));
  /*  const isConnected = await isAccountConnected({
      websiteName: hostname,
      account: websiteData.user
    });*/
  console.log('checkAlreadyLogged');
  const checkLogged = await reflect(execActionList(tab.id, websiteData.website.checkAlreadyLogged, websiteData.user));
  checkAlreadyLogged = !checkLogged.error;
  if (/*isConnected &&*/ checkAlreadyLogged) {
    await setSimpleAccountConnected({
      websiteName: hostname,
      account: websiteData.user,
      website: websiteData.website
    });
    return tab;
  }
  /*  if (checkAlreadyLogged) {
      console.log('deconnection');
      try {
        await execActionList(tab.id, websiteData.website.logout.todo, websiteData.user);
        tab = await TabActions.goto({tabId: tab.id}, {url: websiteData.website.home});
      } catch (e) {
        store.dispatch(DeleteConnectionOverlay({
          tabId: tab.id
        }));
        throw e;
      }
    }*/
  console.log('connection');
  try {
    store.dispatch(SetFirstConnection({
      tabId: tab.id,
      first_connection: true
    }));
    await execActionList(tab.id, websiteData.website.connect.todo, websiteData.user);
    console.log('wait loading');
    await Tabs.waitLoading(tab.id);
    console.log('wait loading finished');
  } catch (e){
    store.dispatch(DeleteConnectionOverlay({
      tabId: tab.id
    }));
    throw e;
  }
  console.log('connection worked');
  await setSimpleAccountConnected({
    websiteName: hostname,
    account: websiteData.user,
    website: websiteData.website
  });
  await saveTabCookies({
    hostname: hostname,
    url: websiteData.website.loginUrl,
    login: websiteData.user.login
  });
  console.log('save tab cookies finished');
  pollingCookies({
    tabId: tab.id,
    url: websiteData.website.loginUrl,
    hostname: hostname,
    login: websiteData.user.login
  });
  return tab;
};

const connectLogWithAccount = async ({details, current_tab}) => {
  console.log('start logwith connect');
  const logwith = details[1];
  const primaryAccount = details[0];
  let count = 0;
  current_connections.forEach(item => {
    if (item === logwith.website.website_name)
      count++;
  });
  if (count > 1)
    throw 'Connection on this website is already running';
  let url = getUrl(logwith.website.loginUrl);
  const isPrimaryAccountConnected = await isAccountConnected({
    websiteName: getUrl(primaryAccount.website.loginUrl).hostname,
    account: primaryAccount.user
  });
  console.log('primary account connected ?', isPrimaryAccountConnected);
  await ContentSettings.popups.set({
    primaryPattern: `${url.protocol}//${url.hostname}/*`,
    setting: "allow"
  });
  let tab = current_tab;
  await removeHostnameCookies({
    url: logwith.website.loginUrl
  });
  await setLogwithHostnameCookies({
    hostname: url.hostname,
    logwith_name: logwith.logWith,
    url: logwith.website.loginUrl,
    login: primaryAccount.user.login
  });
  console.log('finish setting cookies');
  console.log('finish setting overlay');
  tab = await TabActions.goto({tabId: tab.id}, {url: logwith.website.home});
  store.dispatch(InitialiseConnectionOverlay({
    tabId: tab.id,
    websiteName: logwith.website_name
  }));
  console.log('finish create tab');
  const checkAlreadyLogged = !(await reflect(execActionList(tab.id, logwith.website.checkAlreadyLogged))).error;
  console.log('finish checkAlreadyLogged', checkAlreadyLogged);
  if (/*isConnected &&*/ checkAlreadyLogged) {
    await setLogwithAccountConnected({
      websiteName: url.hostname,
      logwithName: logwith.logWith,
      account: details[0].user,
      website: logwith.website
    });
    store.dispatch(DeleteConnectionOverlay({
      tabId: tab.id
    }));
    console.log('return');
    return tab;
  }
  else if (isPrimaryAccountConnected){
    try {
      store.dispatch(SetFirstConnection({
        tabId: tab.id,
        first_connection: true
      }));
      await execActionList(tab.id, logwith.website[logwith.logWith].todo);
    } catch (e) {
      store.dispatch(DeleteConnectionOverlay({
        tabId: tab.id
      }));
      throw e;
    }
  }
  else if (!isPrimaryAccountConnected){
    console.log('account not connected');
    tab = await connectSimpleAccount({websiteData: details[0], current_tab: tab});
    console.log('account connction finished');
    tab = await TabActions['goto']({tabId: tab.id}, {url: logwith.website.home});
    console.log('goto finished');
    try {
      store.dispatch(SetFirstConnection({
        tabId: tab.id,
        first_connection: true
      }));
      await execActionList(tab.id, logwith.website[logwith.logWith].todo);
      console.log('exec action for connection finished');
    } catch (e) {
      console.log('error', e);
      store.dispatch(DeleteConnectionOverlay({
        tabId: tab.id
      }));
      throw e;
    }
  }
  console.log('connection');
  console.log('connection worked');
  await setLogwithAccountConnected({
    websiteName: url.hostname,
    logwithName: logwith.logWith,
    account: details[0].user,
    website: logwith.website
  });
  console.log('set log with account connected finished');
  store.dispatch(DeleteConnectionOverlay({
    tabId: tab.id
  }));
  await Tabs.waitReload(tab.id);
  console.log('wait loading finished');
  await saveLogwithTabCookies({
    url: logwith.website.loginUrl,
    hostname: url.hostname,
    logwith_name: logwith.logWith,
    login: primaryAccount.user.login
  });
  console.log('save logwith tab cookies finished');
  return tab;
};

const test_connection = async ({websiteData, current_tab}) => {
  const websiteName = !!websiteData.website.sso ? websiteData.website.sso : websiteData.website_name;
  const hostname = getUrl(websiteData.website.home).hostname;

  if (websiteData.website.sso === 'Google')
    return connectGoogle({
      websiteData: websiteData,
      current_tab: current_tab
    });
//  let checkAlreadyLogged;
  let tab = current_tab;
  await removeHostnameCookies({
    url: websiteData.website.loginUrl
  });
  tab = await TabActions.goto({tabId: tab.id}, {url: websiteData.website.home});
  store.dispatch(InitialiseConnectionOverlay({
    tabId: tab.id,
    websiteName: websiteName
  }));
  /*  console.log('checkAlreadyLogged');
      const checkLogged = await reflect(execActionList(tab.id, websiteData.website.checkAlreadyLogged, websiteData.user));
    checkAlreadyLogged = !checkLogged.error;
    if (checkAlreadyLogged) {
      console.log('deconnection');
      try {
        await execActionList(tab.id, websiteData.website.logout.todo, websiteData.user);
        tab = await TabActions.goto({tabId: tab.id}, {url: websiteData.website.home});
      } catch (e) {
        store.dispatch(DeleteConnectionOverlay({
          tabId: tab.id
        }));
        throw e;
      }
    }*/
  console.log('connection');
  try {
    await execActionList(tab.id, websiteData.website.connect.todo, websiteData.user);
    await Tabs.waitLoading(tab.id);
  } catch (e){
    store.dispatch(DeleteConnectionOverlay({
      tabId: tab.id
    }));
    throw e;
  }
  await saveTabCookies({
    hostname: hostname,
    url: websiteData.website.loginUrl,
    login: websiteData.user.login
  });
  console.log('connection worked');
  await setSimpleAccountConnected({
    websiteName: hostname,
    account: websiteData.user,
    website: websiteData.website});
  return tab;
};
