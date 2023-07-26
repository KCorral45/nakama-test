function rpcCreateMatch(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
  var matchId = nk.matchCreate('torneo', { payload: payload });
  return JSON.stringify({ matchId });
}