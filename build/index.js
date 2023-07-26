"use strict";
var InitModule = function (ctx, logger, nk, initializer) {
    initializer.registerRpc("create_match", rpcCreateMatch);
    initializer.registerRpc("matchmaker", findOrCreateMatch);
    initializer.registerMatch(moduleName, {
        matchInit: matchInit,
        matchJoinAttempt: matchJoinAttempt,
        matchJoin: matchJoin,
        matchLeave: matchLeave,
        matchLoop: matchLoop,
        matchTerminate: matchTerminate,
        matchSignal: matchSignal,
    });
    logger.info("Hello World!");
};
var moduleName = "torneo";
var matchInit = function (ctx, logger, nk, params) {
    logger.debug('Lobby match created');
    return {
        state: { Debug: true },
        tickRate: 10,
        label: ""
    };
};
var matchJoin = function (ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function (presence) {
        state.presences[presence.userId] = presence;
        logger.debug('%q joined Lobby match', presence.userId);
    });
    return {
        state: state
    };
};
var matchJoinAttempt = function (ctx, logger, nk, dispatcher, tick, state, presence, metadata) {
    logger.debug('%q attempted to join Lobby match', ctx.userId);
    return {
        state: state,
        accept: true
    };
};
var matchLeave = function (ctx, logger, nk, dispatcher, tick, state, presences) {
    presences.forEach(function (presence) {
        state.presences[presence.userId] = presence;
        logger.debug('%q left Lobby match', presence.userId);
    });
    return {
        state: state
    };
};
var matchLoop = function (ctx, logger, nk, dispatcher, tick, state, messages) {
    logger.debug('Lobby match loop executed');
    return {
        state: state
    };
};
var matchSignal = function (ctx, logger, nk, dispatcher, tick, state, data) {
    logger.debug('Lobby match signal received: ' + data);
    return {
        state: state,
        data: "Lobby match signal received: " + data
    };
};
var matchTerminate = function (ctx, logger, nk, dispatcher, tick, state, graceSeconds) {
    logger.debug('Lobby match terminated');
    return {
        state: state
    };
};
function rpcCreateMatch(ctx, logger, nk, payload) {
    var matchId = nk.matchCreate('torneo', { payload: payload });
    return JSON.stringify({ matchId: matchId });
}
function findOrCreateMatch(ctx, logger, nk, payload) {
    logger.info('findOrCreateMatch rpc called');
    var limit = 10;
    var isAuthoritative = true;
    var minSize = 2;
    var maxSize = 5;
    var label = "";
    var matches = nk.matchList(limit, isAuthoritative, label, minSize, maxSize, "");
    // If matches exist, sort by match size and return the largest.
    if (matches.length > 0) {
        matches.sort(function (a, b) {
            return a.size >= b.size ? 1 : -1;
        });
        return matches[0].matchId;
    }
    // If no matches exist, create a new one using the "lobby" module and return it's ID.
    var matchId = nk.matchCreate(moduleName, { debug: true });
    return JSON.stringify({ matchId: matchId });
}
