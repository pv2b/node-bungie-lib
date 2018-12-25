"use strict"

/**
 * @module Endpoints/Forum
 */
 
/** An object containing all of the Forum endpoints */
const endpoints = {
	rootPath                         : "https://www.bungie.net/Platform",
	authorization                    : "https://www.bungie.net/en/oauth/authorize",
	token                            : "https://www.bungie.net/platform/app/oauth/token/",
	getTopicsPaged                   : "/Forum/GetTopicsPaged/{page}/{pageSize}/{group}/{sort}/{quickDate}/{categoryFilter}/",
	getCoreTopcisPaged               : "/Forum/GetCoreTopicsPaged/{page}/{sort}/{quickDate}/{categoryFilter}/",
	getPostsThreadedPaged            : "/Forum/GetPostsThreadedPaged/{parentPostId}/{page}/{pageSize}/{replySize}/{getParentPost}/{rootThreadMode}/{sortMode}/",
	getPostsThreadedPagedFromChild   : "/Forum/GetPostsThreadedPagedFromChild/{childPostId}/{page}/{pageSize}/{replySize}/{rootThreadMode}/{sortMode}/",
	getPostAndParent                 : "/Forum/GetPostAndParent/{childPostId}/",
	getPostAndParentAwaitingApproval : "/Forum/GetPostAndParentAwaitingApproval/{childPostId}/",
	getTopicForContent               : "/Forum/GetTopicForContent/{contentId}/",
	getForumTagSuggestions           : "/Forum/GetForumTagSuggestions/",
	getPoll                          : "/Forum/Poll/{topicId}/",
	joinFireteamThread               : "/Forum/Recruit/Join/{topicId}/",
	leaveFireteamThread              : "/Forum/Recruit/Leave/{topicId}/",
	kickBanFireteamApplicant         : "/Forum/Recruit/KickBan/{topicId}/{targetMembershipId}/",
	approveFireteamThread            : "/Forum/Recruit/Approve/{topicId}/",
	getRecruitmentThreadSummaries    : "/Forum/Recruit/Summaries/"
};

module.exports = endpoints;