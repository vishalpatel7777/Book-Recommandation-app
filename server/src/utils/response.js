const ok = (res, data, message = 'Success') =>
  res.status(200).json({ status: 'success', message, data });

const created = (res, data, message = 'Created') =>
  res.status(201).json({ status: 'success', message, data });

const fail = (res, message, status = 400) =>
  res.status(status).json({ status: 'error', message });

module.exports = { ok, created, fail };
