import ip from 'ip';

require('file-loader?emitFile=false!./network-monitor.html'); // eslint-disable-line
require.context('../locales', true, /network-monitor\.json/) // eslint-disable-line

module.exports = function(RED) { // eslint-disable-line
  function NetworkMonitorNode(config) {
    RED.nodes.createNode(this, config);

    const interval = config.interval || 3000;
    const network = {
      ip: { address: '' },
    };

    const poll = () => {
      const addr = ip.address();

      if (addr && network.ip.address !== addr) {
        network.ip.address = addr;
        this.status({
          fill: 'green',
          shape: 'dot',
          text: `IP: ${network.ip.address}`,
        });
        this.send({
          action: 'set',
          network: {
            ip: { address: network.ip.address },
          },
        });
      } else if (network.ip.address && !addr) {
        this.send({
          action: 'clear',
          network: {
            ip: { address: network.ip.address },
          },
        });
        network.ip.address = '';
      }
    };

    const poller = setInterval(poll, interval);

    this.on('close', () => {
      clearInterval(poller);
    });
  }

  RED.nodes.registerType('network-monitor', NetworkMonitorNode);
};
