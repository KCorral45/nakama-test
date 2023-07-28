let InitModule: nkruntime.InitModule = function(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, initializer: nkruntime.Initializer) {
  // register rpc
  initializer.registerRpc("create_match", rpcCreateMatch);
  initializer.registerRpc("find_or_create_match", findOrCreateMatch);
  initializer.registerRpc("get_matchlist", getMatchListings);

  // register match
  initializer.registerMatch(moduleName_classic, {
    matchInit : classicMatchInit,
    matchJoinAttempt : classicMatchJoinAttempt,
    matchJoin : classicMatchJoin,
    matchLeave : classicMatchLeave,
    matchLoop : classicMatchLoop,
    matchTerminate : classicMatchTerminate,
    matchSignal : classicMatchSignal,
  });

  initializer.registerMatch(moduleName_ranked, {
    matchInit : rankedMatchInit,
    matchJoinAttempt : rankedMatchJoinAttempt,
    matchJoin : rankedMatchJoin,
    matchLeave : rankedMatchLeave,
    matchLoop : rankedMatchLoop,
    matchTerminate : rankedMatchTerminate,
    matchSignal : rankedMatchSignal,
  });

  logger.info("InitModule");
}
