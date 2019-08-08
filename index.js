const express = require('express')
const path = require('path')
const overwatch = require('overwatch-api')
const PORT = process.env.PORT || 5000
const parser = require('body-parser')
const ow = require('overwatch-stats-api');
const leaderBoard = require('./top10Players');

console.log(leaderBoard);

express()
  .use(parser())
  .use(express.static(path.join(__dirname, 'public')))


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

  .post('/stats', async (req, res) => {
    let tag = req.body.username;
    let platform = req.body.platform; 
    console.log(tag, platform);

    //doesnt work with getherostats but works with basic info
    try {
      const mostPlayed = await ow.getMostPlayed(tag, platform);
      const results = await ow.getHeroStats(tag, platform);
      const stats = {};
      
      const mP = mostPlayed.competitive;
        const findMostPlayed = () => {
        let greatest = ':';
        let final = [];
        for(let hero in mP){

          let curTime = mP[hero].time.split(':');
          let greatestTime = greatest.split(':');

          if(curTime.length > greatestTime.length){
            final = [];
            greatest = mP[hero].time;
            final.push(hero, mP[hero])

          }else if(greatestTime.length === curTime.length){
            //[ '10', '12' ] [ '0', '0' ]
            for(i=0; i<greatestTime; i++){
              
              if(greatestTime[i] < curTime[i]){
                final = [];
                greatest = mP[hero].time;
                final.push(hero, mP[hero])
              }
            }
          }
        }
        return final;
      }

      stats['averageStats'] = results.competitive.overall.average;
      stats['MostPlayed'] = findMostPlayed();
      
      console.log(stats);
      res.send(stats);
    } 
    
    catch(error) {
      console.log(error);
    }
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
