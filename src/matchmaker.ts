function findOrCreateMatch(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, payload: string): string {
  logger.info('findOrCreateMatch rpc called');
  const limit = 10;
  const isAuthoritative = true;
  const minSize = 2;
  const maxSize = 5;
  const label = "*";
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
  return JSON.stringify({ matchId });
}