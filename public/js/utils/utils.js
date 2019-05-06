function updateUrlParams(key, value) {
  const params = window.location.search;
  const newParams = {};

  if (params) {
    const paramsArr = params.split("?")[1].split("&").map(p => p.split("="));
    paramsArr.forEach(param => newParams[param[0]] = param[1]);
  }

  // add/update param
  newParams[key] = value;

  let newParamsString = "";
  Object.keys(newParams).forEach(key => {
    newParamsString += `${key}=${newParams[key]}&`;
  });

  // update url without reloading page
  const basePath = window.location.origin + window.location.pathname;
  history.pushState({}, "", `${basePath}?${newParamsString.slice(0, -1)}`);
}

function removeUrlParams(keysToRemove) {
  if (!window.location.search) return;
  console.log("keysToRemove", keysToRemove)
  const currentParams = {};
  const paramsArr = window.location.search.split("?")[1].split("&").map(p => p.split("="));
  paramsArr.forEach(param => currentParams[param[0]] = param[1]);

  console.log('currentParams', currentParams)

  const newParams = {};

  console.log('newParams', newParams)

  let newParamsString = "";
  Object.keys(newParams).forEach(key => {
    newParamsString += `${key}=${newParams[key]}&`;
  });

  // update url without reloading page
  const basePath = window.location.origin + window.location.pathname;
  history.pushState({}, "", `${basePath}?${newParamsString.slice(0, -1)}`);
}

function xhrReq(action, url, data = {}, successCB = null, errorCB = null) {
  const errorCodes = [500, 400, 401];
  const request = new XMLHttpRequest();
  request.open(action, url, true);
  request.onreadystatechange = () => {
    if (request.readyState === 4 && errorCodes.includes(request.status)) {
      if (errorCB) errorCB(request);
    } else if (request.readyState === 4) {
      if (successCB) successCB(request);
    }
  };
  request.setRequestHeader('Content-Type', 'application/json')
  request.send(data);
}

export {
  removeUrlParams,
  updateUrlParams,
  xhrReq,
}
