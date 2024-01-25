import Plausible from 'plausible-tracker'

export let trackEvent = () => console.debug('tracking not configured');

function sendEvent(
  eventName,
  data,
  options
) {
  const isLocalhost =
    /^localhost$|^127(?:\.[0-9]+){0,2}\.[0-9]+$|^(?:0*:)*?:?0*1$/.test(
      location.hostname
    ) || location.protocol === 'file:';

  if (!data.trackLocalhost && isLocalhost) {
    return console.warn(
      '[Plausible] Ignoring event because website is running locally'
    );
  }

  try {
    if (window.localStorage.plausible_ignore === 'true') {
      return console.warn(
        '[Plausible] Ignoring event because "plausible_ignore" is set to "true" in localStorage'
      );
    }
  } catch (e) {
    null;
  }

  const payload = {
    n: eventName,
    u: data.url,
    d: data.domain,
    r: data.referrer,
    w: data.deviceWidth,
    h: data.hashMode ? 1 : 0,
    p: options && options.props ? JSON.stringify(options.props) : undefined,
  };

  navigator.sendBeacon(`${data.apiHost}/api/event`, JSON.stringify(payload));
}

function trackClick(event) {
  trackEvent('Outbound Link: Click', { props: { url: this.href } });
}

if (window.PLAUSIBLE) {

  const config = {
    hashMode: false,
    trackLocalhost: false,
    url: location.href,
    domain: location.hostname,
    referrer: document.referrer || null,
    deviceWidth: window.innerWidth,
    apiHost: 'https://plausible.io',
    ...window.PLAUSIBLE,
  };

  const { enableAutoPageviews } = Plausible(config);

  trackEvent = (eventName, options, eventData) => sendEvent(eventName, { ...config, ...eventData }, options);

  enableAutoPageviews();

  // eslint-disable-next-line functional/prefer-readonly-type
  const tracked = new Set();


  function addNode(node) {
    if (node instanceof HTMLAnchorElement) {
      if (node.host !== location.host) {
        node.addEventListener('click', trackClick);
        tracked.add(node);
      }
    } /* istanbul ignore next */ else if ('querySelectorAll' in node) {
      node.querySelectorAll('a').forEach(addNode);
    }
  }

  function removeNode(node) {
    if (node instanceof HTMLAnchorElement) {
      node.removeEventListener('click', trackClick);
      tracked.delete(node);
    } /* istanbul ignore next */ else if ('querySelectorAll' in node) {
      node.querySelectorAll('a').forEach(removeNode);
    }
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes') {
        // Handle changed href
        removeNode(mutation.target);
        addNode(mutation.target);
      } /* istanbul ignore next */ else if (mutation.type === 'childList') {
        // Handle added nodes
        mutation.addedNodes.forEach(addNode);
        // Handle removed nodes
        mutation.removedNodes.forEach(removeNode);
      }
    });
  });

  // Track existing nodes
  document.querySelectorAll('a').forEach(addNode);

  // Observe mutations
  observer.observe(document, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['href'],
  });
}
