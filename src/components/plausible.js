import Plausible from 'plausible-tracker'

export let track = () => console.debug('tracking not configured')

if (window.PLAUSIBLE_ENABLED) {
    const options = {
        domain: window.PLAUSIBLE_DOMAIN || null,
    }
    const { enableAutoPageviews, trackEvent, enableAutoOutboundTracking } = Plausible(options);

    track = trackEvent;

    enableAutoPageviews();
    enableAutoOutboundTracking();
}
