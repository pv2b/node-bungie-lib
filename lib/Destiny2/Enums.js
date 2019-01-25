/** @module Destiny2/Enum */
"use strict"


/**
 * @readonly
 * @enum { string } - The types of membership the Accounts system supports. This is the external facing enum used in place of the internal-only Bungie.SharedDefinitions.MembershipType.
 */
const bungieMembershipType = {
	NONE          : 0,
	TIGERXBOX     : 1,
	TIGERPSN      : 2,
	TIGERBLIZZARD : 4,
	TIGERDEMON    : 10,
	BUNGIENEXT    : 254,
	ALL           : -1
}

const destinyComponentType = {
	/***/
	NONE : 0,
	/** Profiles is the most basic component, only relevant when calling GetProfile. This returns basic information about the profile, which is almost nothing: a list of characterIds, some information about the last time you logged in, and that most sobering statistic: how long you've played. */
	PROFILES : 100,
	/** Only applicable for GetProfile, this will return information about receipts for refundable vendor items. */
	VENDORRECIPTS : 101,
	/** Asking for this will get you the profile-level inventories, such as your Vault buckets (yeah, the Vault is really inventory buckets located on your Profile) */
	PROFILEINVENTORIES : 102,
	/** This will get you a summary of items on your Profile that we consider to be "currencies", such as Glimmer. I mean, if there's Glimmer in Destiny 2. I didn't say there was Glimmer. */
	PROFILECURRENCIES : 103
	/** This will get you any progression-related information that exists on a Profile-wide level, across all characters. */
	PROFILEPROGRESSION : 104,
	/** This will get you summary info about each of the characters in the profile. */
	CHARACTERS : 200,
	/** This will get you information about any non-equipped items on the character or character(s) in question, if you're allowed to see it. You have to either be authenticated as that user, or that user must allow anonymous viewing of their non-equipped items in Bungie.Net settings to actually get results. */
	CHARACTERINVENTORIES: 201,
	/** This will get you information about the progression (faction, experience, etc... "levels") relevant to each character, if you are the currently authenticated user or the user has elected to allow anonymous viewing of its progression info. */
	CHARACTERPROGRESSSIONS : 202,
	/** This will get you just enough information to be able to render the character in 3D if you have written a 3D rendering library for Destiny Characters, or "borrowed" ours. It's okay, I won't tell anyone if you're using it. I'm no snitch. (actually, we don't care if you use it - go to town) */
	CHARACTERRENDERDATA : 203,
	/** This will return info about activities that a user can see and gating on it, if you are the currently authenticated user or the user has elected to allow anonymous viewing of its progression info. Note that the data returned by this can be unfortunately problematic and relatively unreliable in some cases. We'll eventually work on making it more consistently reliable. */
	CHARACTERACTIVITIES : 204,
	/** This will return info about the equipped items on the character(s). Everyone can see this. */
	CHARACTEREQUIPMENT : 205,
	/** This will return basic info about instanced items - whether they can be equipped, their tracked status, and some info commonly needed in many places (current damage type, primary stat value, etc) */
	ITEMINSTANCES : 300,
	/** Items can have Objectives (DestinyObjectiveDefinition) bound to them. If they do, this will return info for items that have such bound objectives. */
	ITEMOBJECTIVES : 301,
	/** Items can have perks (DestinyPerkDefinition). If they do, this will return info for what perks are active on items. */
	ITEMPERKS : 302,
	/** If you just want to render the weapon, this is just enough info to do that rendering. */
	ITEMRENDERDATA : 303,
	/** Items can have stats, like rate of fire. Asking for this component will return requested item's stats if they have stats. */
	ITEMSTATS : 304,
	/** Items can have sockets, where plugs can be inserted. Asking for this component will return all info relevant to the sockets on items that have them. */
	ITEMSOCKETS : 305,
	/** Items can have talent grids, though that matters a lot less frequently than it used to. Asking for this component will return all relevant info about activated Nodes and Steps on this talent grid, like the good ol' days. */
	ITEMTALENTGRIDS : 306,
	/** Items that *aren't* instanced still have important information you need to know: how much of it you have, the itemHash so you can look up their DestinyInventoryItemDefinition, whether they're locked, etc... Both instanced and non-instanced items will have these properties. You will get this automatically with Inventory components - you only need to pass this when calling GetItem on a specific item. */
	ITEMCOMMONDATA : 307,
	/** Items that are "Plugs" can be inserted into sockets. This returns statuses about those plugs and why they can/can't be inserted. I hear you giggling, there's nothing funny about inserting plugs. Get your head out of the gutter and pay attention! */
	ITEMPLUGSTATES : 308,
	/** When obtaining vendor information, this will return summary information about the Vendor or Vendors being returned. */
	VENDORS : 400,
	/** When obtaining vendor information, this will return information about the categories of items provided by the Vendor. */
	VENDORCATEGORIES : 401,
	/** When obtaining vendor information, this will return the information about items being sold by the Vendor. */
	VENDORSALES : 402,
	/** Asking for this component will return you the account's Kiosk statuses: that is, what items have been filled out/acquired. But only if you are the currently authenticated user or the user has elected to allow anonymous viewing of its progression info. */
	KIOSKS : 500,
	/** A "shortcut" component that will give you all of the item hashes/quantities of items that the requested character can use to determine if an action (purchasing, socket insertion) has the required currency. (recall that all currencies are just items, and that some vendor purchases require items that you might not traditionally consider to be a "currency", like plugs/mods!) */
	CURRENCYLOOKUPS : 600,
	/** Returns summary status information about all "Presentation Nodes". See DestinyPresentationNodeDefinition for more details, but the gist is that these are entities used by the game UI to bucket Collectibles and Records into a hierarchy of categories. You may ask for and use this data if you want to perform similar bucketing in your own UI: or you can skip it and roll your own. */
	PRESENTATIONNODES :700,
	/** Returns summary status information about all "Collectibles". These are records of what items you've discovered while playing Destiny, and some other basic information. For detailed information, you will have to call a separate endpoint devoted to the purpose. */
	COLLECTIBLES : 800,
	/** Returns summary status information about all "Records" (also known in the game as "Triumphs". I know, it's confusing because there's also "Moments of Triumph" that will themselves be represented as "Triumphs.") */
	RECORDS : 900,
	description : "destiny component type"
}

module.exports = {
	bungieMembershipType : map( bungieMembershipType ),
	destinyComponentType : map( destinyComponentType )
};