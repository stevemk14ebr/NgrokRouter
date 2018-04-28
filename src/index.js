import express from 'express';
import rp from 'request-promise-native';
const app = express();
const port = 3000;

app.get('/', async (request, response) => {

  // make a request to ngrok api, xml response
  try {
    let ngrokRsp = await rp.get({uri: 'http://localhost:4040/api/tunnels', resolveWithFullResponse: true});
    if(ngrokRsp.statusCode != 200 || !ngrokRsp.body) {
      response.status(500).send('Ngrok api response not ok');
    }

    let jsonBody = JSON.parse(ngrokRsp.body);

    let tunnels = jsonBody.tunnels;
    if(!tunnels)
      throw "tunnels is null";

    let tunnelMap = [];
    for(let i = 0; i < tunnels.length; i++) {
      tunnelMap[i] = {name: tunnels[i].name, url: tunnels[i].public_url};
    }

    response.send(tunnelMap);
  }catch(err){
    response.status(500).send('Internal error: ' + err);
  }
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});
