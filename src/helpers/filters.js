import Vue from 'vue';

Vue.filter('toMinutes', (seconds) => {
  if (!seconds) return '';
  const format = (val) => `0${val}`.slice(-2);
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds / 3600) % 24);
  const minutes = Math.floor((seconds % 3600) / 60);
  const parts = [minutes, Math.floor(seconds % 60)];

  if (hours > 0) {
    parts.unshift(hours);
  }

  if (days > 0) {
    let returnMsg = `${days} day${days > 1 ? 's' : ''}`;
    if (hours) {
      returnMsg += ` ${hours} hr${hours > 1 ? 's' : ''}`;
    }
    return returnMsg;
  }

  return parts.map(format).join(':');
});

Vue.filter('toSingleUnitTime', (seconds) => {
  if (!seconds) return '';
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds / 3600) % 24);
  const minutes = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hours${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''}`;
  return `${s} second${s > 1 ? 's' : ''}`;
});

Vue.filter('toSingleUnitTimeShort', (seconds) => {
  if (!seconds) return '';
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds / 3600) % 24);
  const minutes = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${s}s`;
});

Vue.filter('fullTime', (seconds) => {
  if (!seconds) return '';
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds / 3600) % 24);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? `${d}d ` : '';
  const hDisplay = d === 0 && seconds <= 3600 ? '' : `${h}h `;
  const mDisplay = `${m}m `;
  const sDisplay = `${s}s `;

  return dDisplay + hDisplay + mDisplay + sDisplay;
});

Vue.filter('shorten', (value) => {
  if (value.length <= 9) return value;
  return `${value.substring(0, 9)}...`;
});

Vue.filter('numberFormat', (num) => {
  if (!num) return 0;
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
});

Vue.filter('numberWithOrdinal', (num) => {
  if (!num) return false;
  const s = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return num + (s[(v - 20) % 10] || s[v] || s[0]);
});
