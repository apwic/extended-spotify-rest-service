const soap = require("../soap.common");
const { parseStringPromise } = require("xml2js");

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
              const subs = result["S:Envelope"]["S:Body"][0]["ns2:getListSubcriptionResponse"][0].return;
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