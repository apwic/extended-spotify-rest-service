const basicParser = (xml) => {
  return xml["S:Envelope"]["S:Body"][0];
}

const subsListParser = (subs) => {
  let parsed = basicParser(subs)["ns2:getListSubcriptionResponse"][0].return;

  if(parsed !== undefined){
    for (let i = 0; i < parsed.length; i++) {
      parsed[i].creatorId = (parsed[i].creatorId)[0];
      parsed[i].creatorName = (parsed[i].creatorName)[0];
      parsed[i].status = (parsed[i].status)[0];
      parsed[i].subscriberId = (parsed[i].subscriberId)[0];
      parsed[i].subscriberName = (parsed[i].subscriberName)[0];
    }
    return parsed;
  } else {
    return [];
  }

}

const subsBySubsIdParser = (subs) => {
  let parsed = basicParser(subs)["ns2:getSubscriptionBySubsIdResponse"][0].return;

  if (parsed !== undefined) {
    for (let i = 0; i < parsed.length; i++) {
      parsed[i].creatorId = (parsed[i].creatorId)[0];
      parsed[i].creatorName = (parsed[i].creatorName)[0];
      parsed[i].status = (parsed[i].status)[0];
      parsed[i].subscriberId = (parsed[i].subscriberId)[0];
      parsed[i].subscriberName = (parsed[i].subscriberName)[0];
    }
    return parsed;
  } else {
    return [];
  }
}

const isSubbedParser = (subs) => {
  return basicParser(subs)["ns2:checkStatusResponse"][0].return[0];
}

const updateSubsParser = (msg) => {
  return basicParser(msg)['ns2:updateStatusResponse'][0];
}

module.exports = { subsListParser, subsBySubsIdParser, updateSubsParser, isSubbedParser };