var vktoken = require('vk-token-FIXED')
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

vktoken.getAccessToken('login', 'password', function(error, token, response){
  switch (token) {
    case 'notoken':
      console.log('Bad login or password');
      process.exit()
      break;
    case 'need_code':
      rl.question('Enter code: ', (code) => {
        vktoken.twoStep(response, code, function(token, error){
          console.log('Your token is a ' + token);
          process.exit()
        })
      })
      break;
    default:
      // I get token!
      console.log(token);
      process.exit()
  }
})
