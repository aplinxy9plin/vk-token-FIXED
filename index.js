var vktoken = require('vk-token-FIXED')
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

vktoken.getAccessToken('', '', function(error, token){
  rl.question('Enter code: ', (code) => {
    vktoken.twoStep(token, code, function(){
      console.log(token);
      console.log(code);
    })
  })
})
//vktoken.test()
