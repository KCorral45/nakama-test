let InitModule: nkruntime.InitModule = function(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, initializer: nkruntime.Initializer) {
  initializer.registerRpc("create_match", rpcCreateMatch);
  initializer.registerRpc("matchmaker", findOrCreateMatch);
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
  logger.info("Hello World!");
}