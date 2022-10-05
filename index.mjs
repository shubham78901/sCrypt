// use npm install node-fetch before importing fetch 
// and change this file extension to .mjs 
import fetch from "node-fetch";

// whatsonchain api for a given transaction_id 
let url_api = 'https://api.whatsonchain.com/v1/bsv/test/tx/hash/';
let txn_id = 'c3a3bb1cefd8be279334e5c3573e243e9253e9dedf0ee613d669896ded1a8ecd';
fetch_api(url_api + txn_id);
let prev_tx = "";

// converts hex to ascii string
function hex2a(hexx){
    var hex = hexx.toString();
    var str = '';
    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

// finds string s in the array 
function check(s){
    return s == "OP_RETURN";
}

// extracts hex from the json
function json_parse(out){

    // extract the asm from the json
    let txn_asm = out.vout[0].scriptPubKey.asm;

    // split the asm string into array of strings
    let arr = txn_asm.split(" ");

    // The hex of our uploaded_data (row)
    let ln = arr.findIndex(check);
    let txn_hex = arr[ln + 2];

    // convert the hex to ascii string
    let ans = hex2a(txn_hex);
    console.log(ans);

    // backtracks to the previous transaction_id
    arr = ans.split(",");
    let prev_txn_arr = arr[arr.length - 1].split(" ");
    prev_tx = prev_txn_arr[prev_txn_arr.length - 1];
    if(prev_tx.length == 64) fetch_api(url_api + prev_tx)
}

// fetches the json file using the api
function fetch_api(url){
    fetch(url)
    .then(res => res.json())
    .then(out => json_parse(out))
    .catch(err => { console.log("Failed to fetch api") })
}