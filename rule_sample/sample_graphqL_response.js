const subs = require('./subs.json')

const rewriters = [{
  name: 'CheckBasket',
  rewriteResponse: function (bodyJSON) {
    bodyJSON.data.basket.items[0].product.substitutions = subs
  }
},
{
  name: 'GetFavourites',
  rewriteResponse: function (bodyJSON) {
    bodyJSON.data.favourites.productItems[0].substitutions = subs
  }
}]

const GRAPHQL_ENDPOINT_URL = 'URL HERE';

module.exports = {
  summary: 'a rule to edit GraphQL query responses',
  *beforeSendResponse(requestDetail, responseDetail) {
    if (requestDetail.url === GRAPHQL_ENDPOINT_URL) {
      const body = requestDetail.requestData.toString()
      const newResponse = responseDetail.response;
      const regex = /query ([^(]*)\(/g;
      const matches = regex.exec(body)
      if (matches != null) {
        const queryName = matches[1]
        for (const rewriter of rewriters) {
          if (queryName === rewriter.name) {
            const responseJSON = JSON.parse(newResponse.body)
            rewriter.rewriteResponse(responseJSON)
            newResponse.body = JSON.stringify(responseJSON)
          }
        }
      }
      return { response: newResponse }
    }
  },
};
