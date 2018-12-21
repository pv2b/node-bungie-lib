"use strict"
/**
 * @module { Enum } ForumEnum
 */

 
/**
 * @readonly
 * @enum { number } represents the forum category filters
 */
const topicsCategoryFilters = {
	/** A short description of this Enum table */
	"description" : "category filter",
	/**  Use no filter */
	"NONE" : 0,
	/** Filter for links */
	"LINKS" : 1,
	/** Filter for questions */
	"QUESTIONS" : 2,
	/** Filter for answered questions */
	"ANSWEREDQUESTIONS" : 4,
	/** Filter for media */
	"MEDIA" : 8,
	/** Filter for text-only */
	"TEXTONLY" : 16,
	/** Filter for announcements */
	"ANNOUNCEMENT" : 32,
	/** Filter for official Bungie topics */
	"BUNGIEOFFICIAL" : 64,
	/** Filter for polls */
	"POLLS" : 128,
	/** 
	 * Name of Enum 0
	 * @type { string } 
	 */
	0 : "NONE",
	/** 
	 * Name of Enum 1
	 * @type { string }
	 */
	1 : "LINKS",
	/** 
	 * Name of Enum 2
	 * @type { string } 
	 */
	2 : "QUESTIONS",
	/** 
	 * Name of Enum 4
	 * @type { string }
	 */
	4 : "ANSWEREDQUESTIONS",
	/**
	 * Name of Enum 8
	 * @type { string } 
	 */
	8 : "MEDIA",
	/** 
	 * Name of Enum 16
	 * @type { string }
	 */
	16 : "TEXTONLY",
	/**
	 * Name of Enum 32
	 * @type { string }
	 */
	32 : "ANNOUNCEMENT",
	/**
	 * Name of Enum 64
	 * @type { string }
	 */
	64 : "BUNGIEOFFICIAL",
	/**
	 * Name of Enum 128
	 * @type { string } 
	 */
	128 : "POLLS"
}

/** 
 * @readonly
 * @enum { number } represents quick sorting by date
 */
const topicsQuickDate = {
	/** A short description of this Enum table */
	"description" : "quick date",
	/** All dates */
	"ALL" : 0,
	/**  Last year */
	"LASTYEAR" : 1,
	/** Last month */
	"LASTMONTH" : 2,
	/** Last week */
	"LASTWEEK" : 3,
	/** Yesterday */
	"LASTDAY" : 4,
	/**
	 * Name of Enum 0
	 * @type {string}
	 */
	0 : "ALL",
	/**
	 * Name of Enum 1
	 * @type { string }
	 */
	1 : "LASTYEAR",
	/**
	 * Name of Enum 2
	 * @type { string }
	 */
	2 : "LASTMONTH",
	/**
	 * Name of Enum 3
	 * @type { string }
	 */
	3 : "LASTWEEK",
	/**
	 * Name of Enum 4
	 * @type { string }
	 */
	4 : "LASTDAY"
}

/**
 * @readonly
 * @enum { number } represents the various forum sort options
 */
const topicsSort = {
	/** A short description of this Enum table*/
	"description" : "sortable topic",
	/** Use default sorting */
	"DEFAULT" : 0,
	/** Sort by last replied */
	"LASTREPLIED" : 1,
	/** Sort by most replies */
	"MOSTREPLIED" : 2,
	/** Sort by popularity */
	"POPULARITY" : 3,
	/** Sort by how controversial a topic is */
	"CONTROVERSIALITY" : 4,
	/** Sort by how liked a topic is */
	"LIKED" : 5,
	/** Sort by highest rated topics */
	"HIGGHESTRATED" : 6, 
	/** Sorty by the most up-voted tpics */
	"MOSTUPDVOTED" : 7,
	/**
	 * Name of Enum 0
	 * @type { string }
	 */
	0 : "DEFAULT",
	/**
	 * Name of Enum 1
	 * @type { string }
	 */
	1 : "LASTREPLIED",
	/**
	 * Name of Enum 2
	 * @type { string }
	 */
	2 : "MOSTREPLIED",
	/**
	 * Name of Enum 3
	 * @type { string }
	 */
	3 : "POPULARITY",
	/**
	 * Name of Enum 4
	 * @type { string }
	 */
	4 : "CONTROVERSIALITY",
	/**
	 * Name of Enum 5
	 * @type { string }
	 */
	5 : "LIKED",
	/**
	 * Name of Enum 6
	 * @type { string }
	 */
	6 : "HIGHESTRATED",
	/**
	 * Name of Enum 7
	 * @type { string }
	 */
	7 : "MOSTUPVOTED"
}

/**
 * @readonly
 * @enum { number } represents the various forum media types
 */
const mediaType = {
	/** A short description of this enum table */
	"description" : "media type",
	/** No media type */
	"NONE" : 0,
	/** Media is some type of image */
	"IMAGE" : 1,
	/** Media is some type of video */
	"VIDEO" : 2,
	/** Media is a youtube video */
	"YOUTUBE" : 3,
	/**
	 * Name of Enum 0
	 * @type { string }
	 */
	0 : "NONE",
	/**
	 * Name of Enum 1
	 * @type { string }
	 */
	1 : "IMAGE",
	/**
	 * Name of Enum 2
	 * @type { string }
	 */
	2 : "VIDEO",
	/**
	 * Name of Enum 3
	 * @type { string }
	 */
	3 : "YOUTUBE"
}

/**
 * @readonly
 * @enum { number } represents how popular a post is
 */
const postPopularity = {
	/** A short description of this Enum table */
	"description" : "post popularity",
	/** Unknown */
	"EMPTY" : 0,
	/** post is not popular */
	"DEFAULT" : 1,
	/** post is being discussed by several individuals */
	"DISCUSSED" : 2,
	/** Post Somewhat popular */
	"COOLSTORY" : 3,
	/** Post is very popular */
	"HEADTINGUP" : 4,
	/** Post is practically viral */
	"HOT" : 5,
	/**
	 * Name of Enum 0
	 * @type { string }
	 */
	0 : "EMPTY",
	/**
	 * Name of Enum 1
	 * @type { string }
	 */
	1 : "DEFAULT",
	/**
	 * Name of Enum 2
	 * @type { string }
	 */
	2 : "DISCUSSED",
	/**
	 * Name of Enum 3
	 * @type { string }
	 */
	3 : "COOLSTORY",
	/**
	 * Name of Enum 4
	 * @type { string }
	 */
	4 : "HEATINGUP",
	/**
	 * Name of Enum 5
	 * @type { string }
	 */
	5 : "HOT"	
}

/** 
 * @readonly
 * @enum { number } Represents the various post categories
 */
const postCategory = {
	/** A short description of this Enum table */
	"description" : "post category",
	/** An uncategorized post */
	"NONE" : 0,
	/** A Text only post */
	"TEXTONLY" : 1,
	/** A media post */
	"MEDIA" : 2,
	/** A link post */
	"LINK" : 4,
	/** A post containing a poll */
	"POLL" : 8,
	/** A post asking a question */
	"QUESTION" : 16,
	/** A question post that has been answered */
	"ANSWERED" : 32,
	/** An announcement post */
	"ANNOUNCEMENT" : 64,
	/** A comment */
	"CONTENTCOMMENT" : 128,
	/** An official Bungie post */
	"BUNGIEOFFICIAL" : 256,
	/** An official Ninja post */
	"NINJAOFFICIAL" : 512,
	/** A recruitment post */
	"RECRUITMENT" : 1024,
	/**
	 * Name of Enum 0
	 * @type { string }
	 */
	0 : "NONE",
	/**
	 * Name of Enum 1
	 * @type { string }
	 */
	1 : "TEXTONLY",
	/**
	 * Name of Enum 2
	 * @type { string }
	 */
	2 : "MEDIA",
	/**
	 * Name of Enum 4
	 * @type { string }
	 */
	4 : "LINK",
	/**
	 * Name of Enum 8
	 * @type { string }
	 */
	8 : "POLL",
	/**
	 * Name of Enum 16
	 * @type { string }
	 */
	16 : "QUESTION",
	/**
	 * Name of Enum 32
	 * @type { string }
	 */
	32 : "ANSWERED",
	/**
	 * Name of Enum 64
	 * @type { string }
	 */
	64 : "ANNOUNCEMENT",
	/**
	 * Name of Enum 128
	 * @type { string }
	 */
	128 : "CONTENTCOMMENT",
	/**
	 * Name of Enum 256
	 * @type { string }
	 */
	256 : "BUNGIEOFFICIAL",
	/**
	 * Name of Enum 512
	 * @type { string }
	 */
	512 : "NINJAOFFICIAL",
	/**
	 * Name of Enum 1024
	 * @type { string }
	 */
	1024 : "RECRUITMENT"
}

const flags = {
	/** A short description of this Enum table*/
	"description" : "forum flag",
	/** No flags */
	"NONE" : 0,
	/** Flagged as a Bungie staff post */
	"BUNGIESTAFFPOST" : 1,
	/** Flagged as a Ninja post*/
	"FORUMNINJAPOST" : 2,
	/** Flagged as a Forum Mentor post */
	"FORUMMENTORPOST" : 4,
	/** Flagged as a Bungie staff topic*/
	"TOPICBUNGIESTAFFPOSTED" : 8,
	/** Flagged as a topic that a Bungie volunteer has post on */
	"TOPICBUNGIEVOLUNTEERPOSTED" : 16,
	/** Flagged as a question that was answered by Bungie */
	"QUESTIONANSWEREDBYBUNGIE" : 32,
	/** Flagged as a question that was answered by Ninja */
	"QUESTIONANSWEREDBYNINJA" : 64,
	/** Flagged as community content */
	"COMMUNITYCONTENT" : 128,
	/**
	 * Name of Enum 0
	 * @type { string }
	 */
	"0" : "NONE",
	/**
	 * Name of Enum 1
	 * @type { string }
	 */
	1 : "BUNGIESTAFFPOST",
	/**
	 * Name of Enum 2
	 * @type { string }
	 */
	2 : "FORUMNINJAPOST",
	/**
	 * Name of Enum 4
	 * @type { string }
	 */
	4 : "FORUMMENTORPOST",
	/**
	 * Name of Enum 8
	 * @type { string }
	 */
	8 : "TOPICBUNGIESTAFFPOSTED",
	/**
	 * Name of Enum 16
	 * @type { string }
	 */
	16 : "TOPICBUNGIEVOLUNTEERPOSTED",
	/**
	 * Name of Enum 32
	 * @type { string }
	 */
	32 : "QUESTIONANSWEREDBYBUNGIE",
	/**
	 * Name of Enum 64
	 * @type { string }
	 */
	64 : "QUESTIONANSWEREDBYNINJA",
	/**
	 * Name of Enum 128
	 * @type { string }
	 */
	128 : "COMMUNITYCONTENT"
}

module.exports = {
	topicsCategoryFilters : topicsCategoryFilters,
	topicsQuickDate : topicsQuickDate,
	topicsSort : topicsSort,
	postPopularity : postPopularity,
	postCategory : postCategory,
	flags : flags
}