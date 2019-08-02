const express = require('express')
const path = require('path')
const overwatch = require('overwatch-api')
const PORT = process.env.PORT || 5000
const parser = require('body-parser')

express()
  .use(parser())
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .post('/overwatch', (req, res) => {
    console.log(req.body);
    const platform = req.body.platform;
    const region = req.body.origin;
    const tag = req.body.username;
    
    overwatch.getProfile(platform, region, tag, (err, results) => {
        if (err) console.error(err);
        else {
            console.log(results);
            res.send(results);
        }
    });

})
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
