//Modules
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
const SteamTotp = require('steam-totp');
const SteamUser = require('steam-user');

//Config directory
const config = require('./config.json');

//New instances
var community = new SteamCommunity();
var client = new SteamUser();
var manager = new TradeOfferManager({
	"steam": client,
	"community": community,
	"language": "en"
});

//Custom callouts
var Status = "Status : ";
var trade = "Trade : ";
var Alert = "Alert : ";
var Confirm = "Confirmation : ";
var error = "ERROR : ";

//Keep things simple
function acceptOffer(offer) {
	offer.accept((err) => {
		if (err) {
			console.log(error + err.message)
		}else{
			community.acceptConfirmationForObject(config.identity_secret, offer.id, function(err){
				if(err){
					console.log(error + err.message)
				}else{
					console.log(Confirm + "Confirmation for offer #" + offer.id + " has been accepted!")
				}
			})
		}
	})
}

function declineOffer(offer) {
	offer.decline((err) => {
		if (err) {
			console.log(error + err.message)
		}
	})
}

var hb = JSON.parse("{\"token\":\"" +  config.bptf_token + "\", \"automatic\": \"sell\"}")
function heartbeat() {
	request.post({
		url: 'https://backpack.tf/api/aux/heartbeat/v1?token=' + config.bptf_token,
		form: hb
	}, (err, httpResponse, body) => {
		if (err) {
			console.log(error + err.message)
		}
	})
}
setInterval(heartbeat, 180000);

//Check if required things are there
if (config.username == 0) {
	console.log('Username is not inputted, to use the bot you have to put your username at config.json');
	process.exit(1);
};
if (config.password == 0) {
	console.log('Password is not inputted, to use the bot you have to put your password at config.json');
	process.exit(1);
};
if (config.shared_secret == 0) {
	console.log('Shared secret is not inputted, you have to type the steam guard code');
};
if (config.identity_secret == 0) {
	console.log('Identity secret is not inputted, you have to confirm the trade by yourself');
};

//Login
client.logOn({
	accountName: config.username,
	password: config.password,
	twoFactorCode: SteamTotp.generateAuthCode(config.shared_secret),
	rememberPassword: true
});
console.log('Logging in to Steam......');

client.on('loggedOn', () => {
	console.log('Logged on to Steam as ' + config.username);
	
	client.setPersona(SteamUser.Steam.EPersonaState.Online);
	if (config.idle == 0) {
		console.log('No idling in progress, set a game\'s id at config')
	} else {
		client.gamesPlayed(config.idle);
		console.log('Started idling game with id ' + config.idle)
	};
	console.log("Everything is ready ! The bot is now doing its work")
});

function isCraftWeapon(item){
	function Tags0(item) {
		if (item.tags[0].name != "Unique") {
			return false
		}
	}
	
	function Tags(item) {
		if (item.tags[1].name != "Primary weapon" && item.tags[1].name != "Secondary weapon" && item.tags[1].name != "Melee weapon" && item.tags[1].name != "Primary PDA" && item.tags[1].name != "Secondary PDA") {
			return false
		}
	}

	function craftable(item) {
		var descriptionLength = item.descriptions.length;
		for (i = 0; i < descriptionLength; i++) {
			if (item.descriptions[i].value === "( Not Usable in Crafting )") {
				return false
			}
		}
	}
	
	function sTokens(item){
		if(item.market_hash_name == "Slot Token - PDA2" || item.market_hash_name == "Slot Token - Secondary" || item.market_hash_name == "Slot Token - Melee" || item.market_hash_name == "Slot Token - Primary"){
			return false
		}
	}
	
	var x = Tags(item)
	var xx = Tags0(item)
	var xxx = craftable(item)
	var xxxx = sTokens(item)
	
	if (x == false || xx == false || xxx == false || xxxx == false) {
		return false
	}
	return true
}
