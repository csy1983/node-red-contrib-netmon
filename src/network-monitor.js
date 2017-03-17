import ip from 'ip';

require('file-loader?emitFile=false!./network-monitor.html'); // eslint-disable-line
require.context('../locales', true, /network-monitor\.json/) // eslint-disable-line

module.exports = function(RED) { // eslint-disable-line
  function NetworkMonitorNode(config) {
    RED.nodes.createNode(this, config);

    const interval = config.interval || 3;
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
          data: {
            ip: { address: network.ip.address },
          },
        });
      } else if (network.ip.address && !addr) {
        this.status({
          fill: 'yellow',
          shape: 'dot',
          text: 'IP address is not set',
        });
        this.send({
          action: 'clear',
          data: {
            ip: { address: network.ip.address },
          },
        });
        network.ip.address = '';
      }
    };

    const poller = setInterval(poll, interval * 1000);

    this.on('close', () => {
      clearInterval(poller);
    });
  }

  RED.nodes.registerType('netmon', NetworkMonitorNode);
};
