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
