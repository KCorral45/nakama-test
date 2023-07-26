let InitModule: nkruntime.InitModule = function(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, initializer: nkruntime.Initializer) {
  initializer.registerRpc("create_match", rpcCreateMatch);
  initializer.registerRpc("matchmaker", findOrCreateMatch);
  initializer.registerMatch(moduleName,{
    matchInit,
    matchJoinAttempt,
    matchJoin,
    matchLeave,
    matchLoop,
    matchTerminate,
    matchSignal,
  });
  logger.info("Hello World!");
}