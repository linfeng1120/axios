global.sendJson = (res, code, msg, data = null) => {
  res.json({
    meta: {
      state: code,
      msg: msg
    },
    data: data
  })
}