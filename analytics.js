export default {
  track(event, props) {
    // Lightweight analytics shim — replace with Segment/Amplitude/etc.
    try {
      console.log('[Analytics]', event, props || {});
    } catch (e) {
      // ignore
    }
  }
};
