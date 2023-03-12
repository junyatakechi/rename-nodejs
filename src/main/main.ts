// マルチ環境変数ファイル
const dotenv = require("dotenv");
dotenv.config({override: true});
if(process.env.MODE){
  console.log("MODE:", process.env.MODE);
  dotenv.config({path: `.env.${process.env.MODE}`, override: true});
}

//
const main = async function(){
    console.log("Hello World.");
}
main();