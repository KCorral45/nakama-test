"use strict";
var InitModule = function (ctx, logger, nk, initializer) {
    initializer.registerRpc("create_match", rpcCreateMatch);
    initializer.registerRpc("matchmaker", findOrCreateMatch);
    initializer.registerRpc("match_listings", getMatchListings);
    initializer.registerMatch(moduleName_classic, {
        matchInit: classicMatchInit,
        matchJoinAttempt: classicMatchJoinAttempt,
        matchJoin: classicMatchJoin,
        matchLeave: classicMatchLeave,
        matchLoop: classicMatchLoop,
        matchTerminate: classicMatchTerminate,
        matchSignal: classicMatchSignal,
    });
    initializer.registerMatch(moduleName_ranked, {
        matchInit: rankedMatchInit,
        matchJoinAttempt: rankedMatchJoinAttempt,
        matchJoin: rankedMatchJoin,
        matchLeave: rankedMatchLeave,
        matchLoop: rankedMatchLoop,
        matchTerminate: rankedMatchTerminate,
        matchSignal: rankedMatchSignal,
    });
    logger.info("Hello World!");
};
var moduleName_classic = "classic";
var classicMatchInit = function (ctx, logger, nk, params) {
    logger.debug('Lobby match created');
    return {
        state: {
            Debug: true
        },
        tickRate: 10,
        label: "classic"
    };
};
var classicMatchJoin = function (ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function (presence) {
        state.presences[presence.userId] = presence;
        logger.debug('%q joined Lobby match', presence.userId);
    });
    return {
        state: state
    };
};
var classicMatchJoinAttempt = function (ctx, logger, nk, dispatcher, tick, state, presence, metadata) {
    logger.debug('%q attempted to join Lobby match', ctx.userId);
    return {
        state: state,
        accept: true
    };
};
var classicMatchLeave = function (ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function (presence) {
        state.presences[presence.userId] = presence;
        logger.debug('%q left Lobby match', presence.userId);
    });
    return {
        state: state
    };
};
var classicMatchLoop = function (ctx, logger, nk, dispatcher, tick, state, messages) {
    // If we have no presences in the match according to the match state, increment the empty ticks count
    if (state.presences.length === 0) {
        state.emptyTicks++;
    }
    // If the match has been empty for more than 100 ticks, end the match by returning null
    if (state.emptyTicks > 100) {
        return null;
    }
    return {
        state: state
    };
};
var classicMatchSignal = function (ctx, logger, nk, dispatcher, tick, state, data) {
    logger.debug('Lobby match signal received: ' + data);
    return {
        state: state,
        data: "Lobby match signal received: " + data
    };
};
var classicMatchTerminate = function (ctx, logger, nk, dispatcher, tick, state, graceSeconds) {
    logger.debug('Lobby match terminated');
    return {
        state: state
    };
};
var moduleName_ranked = "ranked";
var rankedMatchInit = function (ctx, logger, nk, params) {
    logger.debug('Lobby match created');
    return {
        state: {
            Debug: true
        },
        tickRate: 10,
        label: "ranked"
    };
};
var rankedMatchJoin = function (ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function (presence) {
        state.presences[presence.userId] = presence;
        logger.debug('%q joined Lobby match', presence.userId);
    });
    return {
        state: state
    };
};
var rankedMatchJoinAttempt = function (ctx, logger, nk, dispatcher, tick, state, presence, metadata) {
    logger.debug('%q attempted to join Lobby match', ctx.userId);
    return {
        state: state,
        accept: true
    };
};
var rankedMatchLeave = function (ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function (presence) {
        state.presences[presence.userId] = presence;
        logger.debug('%q left Lobby match', presence.userId);
    });
    return {
        state: state
    };
};
var rankedMatchLoop = function (ctx, logger, nk, dispatcher, tick, state, messages) {
    logger.debug('Lobby match loop executed');
    return {
        state: state
    };
};
var rankedMatchSignal = function (ctx, logger, nk, dispatcher, tick, state, data) {
    logger.debug('Lobby match signal received: ' + data);
    return {
        state: state,
        data: "Lobby match signal received: " + data
    };
};
var rankedMatchTerminate = function (ctx, logger, nk, dispatcher, tick, state, graceSeconds) {
    logger.debug('Lobby match terminated');
    return {
        state: state
    };
};
function rpcCreateMatch(ctx, logger, nk, payload) {
    var matchId = nk.matchCreate('classic');
    return JSON.stringify({ matchId: matchId });
}
function findOrCreateMatch(ctx, logger, nk, payload) {
    logger.info('findOrCreateMatch rpc called');
    var limit = 10;
    var isAuthoritative = true;
    var minSize = 2;
    var maxSize = 5;
    var label = "*";
    var matches = nk.matchList(limit, isAuthoritative, label, minSize, maxSize, "");
    // If matches exist, sort by match size and return the largest.
    if (matches.length > 0) {
        matches.sort(function (a, b) {
            return a.size >= b.size ? 1 : -1;
        });
        return matches[0].matchId;
    }
    // If no matches exist, create a new one using the "lobby" module and return it's ID.
    var matchId = nk.matchCreate(moduleName_classic, { debug: true });
    return JSON.stringify({ matchId: matchId });
}
function getMatchListings(context, logger, nk) {
    var limit = 10;
    var isAuthoritative = false;
    var label = "";
    var minSize = 0;
    var maxSize = 4;
    var matches = nk.matchList(limit, isAuthoritative, label, minSize, maxSize, "");
    matches.forEach(function (match) {
        logger.info("Match id '%s'", match.matchId);
    });
}
