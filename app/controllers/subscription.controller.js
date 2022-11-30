const soap = require("../soap.common");
const { parseStringPromise } = require("xml2js");
const { subsListParser, updateSubsParser } = require("../utils/soapParser");

exports.getSubscriptionList = async(req, res) => {
  try {
    const envelope = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                          <Body>
                              <getListSubcription xmlns="http://controllers/"/>
                          </Body>
                      </Envelope>`;
    return await soap.post("/subscription", envelope)
                      .then((response) => {
                        return parseStringPromise(response.data);
                      })
                      .then((result) => {
                        // TODO: PARSER FOR XML
                        const subs = subsListParser(result);
                        return res.status(200).send({
                          subscription: subs
                        });
                      });
  } catch (err) {
    return res.status(500).send({
      message: err.message
    });
  }
}

exports.updateSubscription = async(req, res) => {
  try {
    const envelope = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                          <Body>
                              <updateStatus xmlns="http://controllers/">
                                  <arg0 xmlns="">${req.body.creatorId}</arg0>
                                  <arg1 xmlns="">${req.body.subscriberId}</arg1>
                                  <arg2 xmlns="">${req.body.status}</arg2>
                              </updateStatus>
                          </Body>
                      </Envelope>`;
    return await soap.post("/subscription", envelope)
                      .then((response) => {
                        return parseStringPromise(response.data);
                      })
                      .then((result) => {
                        const msg = updateSubsParser(result);
                        if (msg) {
                          return res.status(200).send({
                            message: "Update subscription successfully"
                          })
                        } else {
                          return res.status(500).send({
                            message: "Undefined error from server"
                          })
                        }
                      });
  } catch (err) {
    return res.status(500).send({
      message: err.message
    });
  }
}