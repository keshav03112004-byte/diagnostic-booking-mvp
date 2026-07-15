const generateOrderId = () => {
  const date = new Date();
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DBK${ymd}${rand}`;
};

const DEFAULT_SERVICEABLE_PINCODES = [
  '122001', '122002', '122003', '122004', '122005', '122006', '122007', '122008',
  '122009', '122010', '122011', '122015', '122016', '122017', '122018', '110001',
  '110002', '110003', '110016', '110017', '110019', '110020', '110025', '110048',
  '560001', '560034', '560037', '560038', '560066', '560100',
];

let serviceablePincodes = [...DEFAULT_SERVICEABLE_PINCODES];

const setServiceablePincodes = (list) => {
  if (Array.isArray(list) && list.length) {
    serviceablePincodes = list.map((p) => String(p).trim()).filter(Boolean);
  }
};

const getServiceablePincodes = () => serviceablePincodes;

const isPincodeServiceable = (pincode) =>
  serviceablePincodes.includes(String(pincode).trim());

module.exports = {
  generateOrderId,
  isPincodeServiceable,
  setServiceablePincodes,
  getServiceablePincodes,
  DEFAULT_SERVICEABLE_PINCODES,
  // backwards-compatible export
  SERVICEABLE_PINCODES: DEFAULT_SERVICEABLE_PINCODES,
};
