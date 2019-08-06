const express = require('express')
const path = require('path')
const overwatch = require('overwatch-api')
const PORT = process.env.PORT || 5000
const parser = require('body-parser')
// const ow = require('overwatch-stats-api');
const overSmash = require('oversmash');
const ow = oversmash();

express()
  .use(parser())
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .post('/overwatch', (req, res) => {
    console.log(req.body);
    let platform = req.body.platform;
    let region = req.body.origin;
    let tag = req.body.username;
    
    overwatch.getProfile(platform, region, tag, (err, results) => {
        if (err) console.error(err);
        else {
            console.log(results);
            res.send(results);
        }
    });
  })

  // .post('/basicStats', async(req, res) => {
  //   let platform = req.body.platform;
  //   let tag = req.body.username;

  //   const basicStats = await ow.getBasicInfo(tag, platform);
  //   res.send(basicStats);
  // })

  .post('/stats', (req, res) => {
    // let tag = req.body.username;

    ow.player('dafran-21192').then(player => {
      res.send(player);
    })

  })

  .get('/OWLLiveMatch', (req, res) => {
    
    overwatch.owl.getLiveMatch((err, matchInfo) => {
      if(err) { console.log(err); }
      else { res.send(matchInfo); }
    })
  })
  .get('/OWLStandings', (req, res) => {

    overwatch.owl.getStandings((err, standings) => {
      if(err) { console.log(err); }
      else { res.send(standings); }
    })
  })





  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
