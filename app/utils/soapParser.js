const basicParser = (xml) => {
  return xml["S:Envelope"]["S:Body"][0];
}

const subsListParser = (subs) => {
  let parsed = basicParser(subs)["ns2:getListSubcriptionResponse"][0].return;

  for (let i = 0; i < parsed.length; i++) {
    parsed[i].creatorId = (parsed[i].creatorId)[0];
    parsed[i].creatorName = (parsed[i].creatorName)[0];
    parsed[i].status = (parsed[i].status)[0];
    parsed[i].subscriberId = (parsed[i].subscriberId)[0];
    parsed[i].subscriberName = (parsed[i].subscriberName)[0];
  }

  return parsed;
}

const updateSubsParser = (msg) => {
  return basicParser(msg)['ns2:updateStatusResponse'][0];
}

module.exports = { subsListParser, updateSubsParser };